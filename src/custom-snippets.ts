import * as vscode from 'vscode';
import * as _ from 'lodash';
import * as util from './utilities';
import * as getText from './util/get-text';
import * as namespace from './namespace';
import * as outputWindow from './repl-window/repl-doc';
import { getConfig } from './config';
import * as replSession from './nrepl/repl-session';
import evaluate from './evaluate';
import * as state from './state';
import { getStateValue, parseEdn } from '../out/cljs-lib/cljs-lib';
import * as output from './results-output/output';

// the structure of custom REPL command snippets as configured by the user
export type CustomREPLCommandSnippet = {
  name: string;
  key?: string;
  snippet: string;
  repl?: string;
  ns?: string;
  resultIsCommand?: boolean;
  commandThen?: string;
};

// a snippet that is ready to be evaluated, with additional fields for internal use
export type SnippetDefinition = {
  snippet: string;
  ns: string;
  repl: string;
  evaluationSendCodeToOutputWindow?: boolean;
  resultIsCommand?: boolean;
  commandThen?: string;
};

export function evaluateCustomCodeSnippetCommand(codeOrKeyOrSnippet?: string | SnippetDefinition) {
  evaluateCodeOrKeyOrSnippet(codeOrKeyOrSnippet).catch((err) => {
    console.log('Failed to run snippet', err);
    void vscode.window.showErrorMessage(`Failed to run snippet: ${err.message}`);
  });
}

async function evaluateCodeOrKeyOrSnippet(codeOrKeyOrSnippet?: string | SnippetDefinition) {
  if (!getStateValue('connected')) {
    void vscode.window.showErrorMessage('Not connected to a REPL');
    return;
  }
  const editor = util.getActiveTextEditor();
  const [editorNS, _] =
    editor && editor.document && editor.document.languageId === 'clojure'
      ? namespace.getNamespace(editor.document, editor.selections[0].active)
      : undefined;
  const editorRepl =
    editor && editor.document && editor.document.languageId === 'clojure'
      ? replSession.getReplSessionTypeFromState()
      : 'clj';
  const snippetDefinition: SnippetDefinition =
    typeof codeOrKeyOrSnippet !== 'string' && codeOrKeyOrSnippet !== undefined
      ? codeOrKeyOrSnippet
      : await getSnippetDefinition(codeOrKeyOrSnippet as string, editorNS, editorRepl);

  if (!snippetDefinition) {
    // user pressed ESC, not picking one
    return undefined;
  }

  snippetDefinition.repl = snippetDefinition.repl ?? editorRepl;
  snippetDefinition.ns =
    snippetDefinition.ns ?? (editorRepl === snippetDefinition.repl ? editorNS : undefined);
  snippetDefinition.evaluationSendCodeToOutputWindow =
    snippetDefinition.evaluationSendCodeToOutputWindow ?? true;

  const options = {};

  options['evaluationSendCodeToOutputWindow'] = snippetDefinition.evaluationSendCodeToOutputWindow;
  // don't allow addToHistory if we don't show the code but are inside the repl
  options['addToHistory'] =
    state.extensionContext.workspaceState.get('outputWindowActive') &&
    !snippetDefinition.evaluationSendCodeToOutputWindow
      ? false
      : undefined;

  const context = makeContext(editor, snippetDefinition.ns, editorNS, snippetDefinition.repl);
  const result = await evaluateCodeInContext(editor, snippetDefinition.snippet, context, options);

  if (typeof result === 'string' && snippetDefinition.resultIsCommand) {
    const value = parseEdn(result);
    if (!Array.isArray(value) || !value[0]) {
      void vscode.window.showErrorMessage('Result is not a command array');
      return result;
    } else {
      const command = value[0];
      const args = value.slice(1).map(decodeArgument);
      const commandResult = await vscode.commands.executeCommand(command, ...args);
      if (snippetDefinition.commandThen) {
        const code = `(${snippetDefinition.commandThen} ${commandResult})`;
        return await evaluateCodeInContext(editor, code, context, options);
      }
      return commandResult;
    }
  }

  return result;
}

async function evaluateCodeInContext(
  editor: vscode.TextEditor,
  code: string,
  context: any,
  options: any
) {
  const result = await evaluateSnippet(editor, code, context, options);
  output.replWindowAppendPrompt();
  return result;
}

async function getSnippetDefinition(codeOrKey: string, editorNS: string, editorRepl: string) {
  const configErrors: { name: string; keys: string[] }[] = [];
  const globalSnippets = getConfig().customREPLCommandSnippetsGlobal;
  const workspaceSnippets = getConfig().customREPLCommandSnippetsWorkspace;
  const workspaceFolderSnippets = getConfig().customREPLCommandSnippetsWorkspaceFolder;
  let snippets = [
    ...(workspaceFolderSnippets ? workspaceFolderSnippets : []),
    ...(workspaceSnippets ? workspaceSnippets : []),
    ...(globalSnippets ? globalSnippets : []),
  ];
  if (snippets.length < 1) {
    snippets = getConfig().customREPLCommandSnippets;
  }
  const snippetsDict = {};
  const snippetsMenuItems: vscode.QuickPickItem[] = [];
  snippets.forEach((c: CustomREPLCommandSnippet) => {
    const undefs = ['name', 'snippet'].filter((k) => {
      return !c[k];
    });
    if (undefs.length > 0) {
      configErrors.push({ name: c.name, keys: undefs });
    }
    const entry = { ...c };
    entry.ns = entry.ns ? entry.ns : editorNS;
    entry.repl = entry.repl ? entry.repl : editorRepl;
    const item = {
      label: `${entry.key ? entry.key + ': ' : ''}${entry.name}`,
      detail: `${entry.snippet}`,
      description: `${entry.repl}`,
      snippet: entry.snippet,
      resultIsCommand: entry.resultIsCommand,
      commandThen: entry.commandThen,
    };
    snippetsMenuItems.push(item);
    if (!snippetsDict[entry.key]) {
      snippetsDict[entry.key] = entry;
    }
  });

  if (configErrors.length > 0) {
    void vscode.window.showErrorMessage(
      'Errors found in the `calva.customREPLCommandSnippets` setting. Values missing for: ' +
        JSON.stringify(configErrors),
      'OK'
    );
    return;
  }

  let pick: any;
  if (codeOrKey === undefined) {
    // Called without args, show snippets menu
    if (snippetsMenuItems.length > 0) {
      try {
        const pickResult = await util.quickPickSingle({
          values: snippetsMenuItems,
          placeHolder: 'Choose a command to run at the REPL',
          saveAs: 'runCustomREPLCommand',
        });
        if (pickResult === undefined || pickResult.label.length < 1) {
          return;
        }
        pick = pickResult;
      } catch (e) {
        console.error(e);
      }
    }
    if (pick === undefined) {
      output.appendLineOtherOut(
        'No snippets configured. Configure snippets in `calva.customREPLCommandSnippets`.'
      );
      return;
    }
  }

  if (pick === undefined) {
    // still no pick, but codeOrKey might be one
    pick = snippetsDict[codeOrKey];
  }

  return pick ?? { snippet: codeOrKey };
}

export function makeContext(editor: vscode.TextEditor, ns: string, editorNS: string, repl: string) {
  return {
    currentLine: editor.selections[0].active.line,
    currentColumn: editor.selections[0].active.character,
    currentFilename: editor.document.fileName,
    ns,
    editorNS,
    repl,
    selection: editor.document.getText(editor.selections[0]),
    selectionWithBracketTrail: getText.selectionAddingBrackets(
      editor.document,
      editor.selections[0].active
    ),
    currentFileText: getText.currentFileText(editor.document),
    ...(editor.document.languageId === 'clojure'
      ? getText.currentClojureContext(editor.document, editor.selections[0].active)
      : {}),
  };
}

export async function evaluateSnippet(editor: vscode.TextEditor, code, context, options) {
  const ns = context.ns;
  const repl = context.repl;
  const interpolatedCode = interpolateCode(editor, code, context);
  return await evaluate.evaluateInOutputWindow(interpolatedCode, repl, ns, options);
}

function interpolateCode(editor: vscode.TextEditor, code: string, context): string {
  const interpolateCode = code
    .replace(/\$line/g, context.currentLine)
    .replace(/\$hover-line/g, context.hoverLine)
    .replace(/\$column/g, context.currentColumn)
    .replace(/\$hover-column/g, context.hoverColumn)
    .replace(/\$file-text/g, context.currentFileText[1])
    .replace(/\$file/g, context.currentFilename?.replace(/\\/g, '\\\\') ?? '')
    .replace(/\$hover-file-text/g, context.hovercurrentFileText?.[1] ?? '')
    .replace(/\$hover-file/g, context.hoverFilename?.replace(/\\/g, '\\\\') ?? '')
    .replace(/\$ns/g, context.ns)
    .replace(/\$editor-ns/g, context.editorNS)
    .replace(/\$repl/g, context.repl)
    .replace(/\$selection-closing-brackets/g, context.selectionWithBracketTrail?.[1])
    .replace(/\$selection/g, context.selection)
    .replace(/\$hover-text/g, context.hoverText);
  if (editor.document.languageId !== 'clojure') {
    return interpolateCode;
  } else {
    return interpolateCode
      .replace(/\$current-form/g, context.currentForm[1])
      .replace(/\$current-pair/g, context.currentPair[1])
      .replace(/\$enclosing-form/g, context.enclosingForm[1])
      .replace(/\$top-level-form/g, context.topLevelForm[1])
      .replace(/\$current-fn/g, context.currentFn[1])
      .replace(/\$top-level-fn/g, context.topLevelFn[1])
      .replace(/\$top-level-defined-symbol/g, context.topLevelDefinedForm?.[1] ?? '')
      .replace(/\$head/g, context.head[1])
      .replace(/\$tail/g, context.tail[1])
      .replace(/\$hover-current-form/g, context.hovercurrentForm?.[1] ?? '')
      .replace(/\$hover-current-pair/g, context.hovercurrentPair?.[1] ?? '')
      .replace(/\$hover-enclosing-form/g, context.hoverenclosingForm?.[1] ?? '')
      .replace(/\$hover-top-level-form/g, context.hovertopLevelForm?.[1] ?? '')
      .replace(/\$hover-current-fn/g, context.hovercurrentFn?.[1] ?? '')
      .replace(/\$hover-current-fn/g, context.hovertopLevelFn?.[1] ?? '')
      .replace(/\$hover-top-level-defined-symbol/g, context.hovertopLevelDefinedForm?.[1] ?? '')
      .replace(/\$hover-head/g, context.hoverhead?.[1] ?? '')
      .replace(/\$hover-tail/g, context.hovertail?.[1] ?? '');
  }
}

function resolveRelativePath(path: string): string {
  if (path.startsWith('/')) {
    return path;
  }
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    const workspacePath = workspaceFolders[0].uri.fsPath;
    return vscode.Uri.file(`${workspacePath}/${path}`).fsPath;
  }
  return path;
}

function resolveFilePath(path: string): vscode.Uri {
  return vscode.Uri.file(resolveRelativePath(path));
}

const decoders = {
  File: resolveFilePath,
  Uri: vscode.Uri.parse,
};

function decodeArgument(arg: any): any {
  if (Array.isArray(arg) && arg.length > 1) {
    if (decoders[arg[0]]) {
      const Decoder = decoders[arg[0]];
      const decodedArgs = arg.slice(1).map(decodeArgument);
      return Decoder(...decodedArgs);
    }

    const parts = arg[0].split('.');
    if (parts.length > 0) {
      let vscodeType: any = vscode;
      for (const part of parts) {
        vscodeType = vscodeType[part];
        if (!vscodeType) {
          break;
        }
      }
      if (typeof vscodeType === 'function') {
        const decodedArgs = arg.slice(1).map(decodeArgument);
        if (vscodeType.prototype) {
          return new vscodeType(...decodedArgs);
        } else {
          return vscodeType(...decodedArgs);
        }
      }
    }
  }
  return arg;
}
