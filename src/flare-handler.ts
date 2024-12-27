import * as vscode from 'vscode';
import * as path from 'path';
import * as webview from './webview';
import { parseEdn } from '../out/cljs-lib/cljs-lib';

type EvaluateFunction = (code: string) => Promise<string | null>;

type InfoRequest = { type: 'info'; message: string; items?: string[]; then?: string };
type WarnRequest = { type: 'warn'; message: string; items?: string[]; then?: string };
type ErrorRequest = { type: 'error'; message: string; items?: string[]; then?: string };
type WebviewRequest = {
  type: 'webview';
  title?: string;
  html?: string;
  url?: string;
  key?: string;
  column?: vscode.ViewColumn;
  opts?: any;
  then?: string;
};
type CommandRequest = { type: 'command'; command: string; args?: string[]; then?: string };
type CommandsRequest = { type: 'commands'; then?: string };
type DefaultRequest = { type: 'default'; [key: string]: any };

type ActRequest =
  | InfoRequest
  | WarnRequest
  | ErrorRequest
  | WebviewRequest
  | CommandRequest
  | CommandsRequest
  | DefaultRequest;

function callback(p, thensym: string, evaluate: EvaluateFunction): void {
  if (thensym) {
    p.then((x: any) => evaluate(`((resolve '${thensym}) ${JSON.stringify(x)})`)).error((e) => {
      // TODO: I haven't seen this work yet, test it somehow
      vscode.window.showErrorMessage('failed callback: ' + e);
      console.log('OH NO', e);
    });
  }
}

function parseArg(arg: string) {
  try {
    // Try to parse JSON (handles numbers, booleans, arrays, objects)
    return JSON.parse(arg);
  } catch {
    // If parsing fails, check if it's a valid file path and convert to URI
    if (path.isAbsolute(arg) || arg.startsWith('./') || arg.startsWith('../')) {
      return vscode.Uri.file(arg);
    }
    // Return the argument as a string if it's not a valid file path
    return arg;
  }
}

const actHandlers: Record<string, (request: ActRequest, EvaluateFunction) => void> = {
  default: (request: DefaultRequest, evaluate: EvaluateFunction) => {
    void vscode.window.showErrorMessage(
      `Unknown flare request type: ${JSON.stringify(request.type)}`
    );
  },
  info: ({ message, items = [], then }: InfoRequest, evaluate: EvaluateFunction) => {
    const p = vscode.window.showInformationMessage(message, ...items);
    callback(p, then, evaluate);
  },
  warn: ({ message, items = [], then }: WarnRequest, evaluate: EvaluateFunction) => {
    const p = vscode.window.showWarningMessage(message, ...items);
    callback(p, then, evaluate);
  },
  error: ({ message, items = [], then }: ErrorRequest, evaluate: EvaluateFunction) => {
    const p = vscode.window.showErrorMessage(message, ...items);
    callback(p, then, evaluate);
  },
  webview: ({ then, ...request }: WebviewRequest, evaluate: EvaluateFunction) => {
    const p = webview.show(request);
    // TODO: p here is a panel, not a promise, so then clause will fail
    callback(p, then, evaluate);
  },
  // TODO: handling commands sounds like fun, but there aren't actually many that are useful afaik,
  // there are some that could be considered dangerous
  // there are so many and they aren't documented anywhere afaik
  command: ({ command, args = [], then }: CommandRequest, evaluate: EvaluateFunction) => {
    // TODO: args might not be an array like we expect
    const parsedArgs = (args || []).map(parseArg);
    console.log('ARGS', parsedArgs);
    const p = vscode.commands.executeCommand(command, ...parsedArgs);
    callback(p, then, evaluate);
  },
  commands: ({ then }: CommandsRequest, evaluate: EvaluateFunction) => {
    const p = vscode.commands.getCommands();
    callback(p, then, evaluate);
  },
};

function act(request: ActRequest, evaluate: EvaluateFunction): void {
  const handler = actHandlers[request.type] || actHandlers.default;
  handler(request, evaluate);
}

function isFlare(x: any): boolean {
  return typeof x === 'object' && x !== null && 'calva/flare' in x;
}

function getFlareRequest(flare: Record<string, any>): any {
  return Object.values(flare)[0];
}

export function inspect(edn: string, evaluate: EvaluateFunction): any {
  console.log('INSPECT', edn);
  if (
    edn &&
    typeof edn === 'string' &&
    (edn.startsWith('{:calva/flare') || edn.startsWith('#:calva{:flare'))
  ) {
    try {
      const x = parseEdn(edn);
      console.log('PARSED', x);
      if (isFlare(x)) {
        console.log('FLARE', x);
        const request = getFlareRequest(x);
        act(request, evaluate);
      }
    } catch (e) {
      console.log('ERROR: inspect failed', e);
    }
  }
}
