import * as vscode from 'vscode';
import * as webview from './webview';

function isFlare(value: any): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.keys(value).length === 1 &&
    value.hasOwnProperty('calva/flare')
  );
}

function getFlareRequest(flare: Record<string, any>): any {
  return Object.values(flare)[0];
}

type EvaluateFunction = (
  code: string,
  options: any,
  selection?: vscode.Selection
) => Promise<string | null>;

type InfoRequest = { type: 'info'; message: string; items?: string[]; then?: any };
type WarnRequest = { type: 'warn'; message: string; items?: string[] };
type ErrorRequest = { type: 'error'; message: string; items?: string[] };
type WebviewRequest = { type: 'webview'; title?: string; html?: string; url?: string; key?: string; column?: vscode.ViewColumn; opts?: any};
type DefaultRequest = { type: 'default'; [key: string]: any };

type ActRequest = InfoRequest | WarnRequest | ErrorRequest | WebviewRequest | DefaultRequest;

const actHandlers: Record<string, (request: ActRequest, EvaluateFunction) => void> = {
  default: (request: DefaultRequest, evaluate: EvaluateFunction) => {
    vscode.window.showErrorMessage(`Unknown flare request type: ${JSON.stringify(request.type)}`);
  },
  info: ({ message, items = [], then }: InfoRequest, evaluate: EvaluateFunction) => {
    const p = vscode.window.showInformationMessage(message, ...items);
    if (then) {
      p.then((selected) => evaluate("(resolve " + then + " " + selected + ")", null));
    }
  },
  warn: ({ message, items = [] }: WarnRequest) => {
    vscode.window.showWarningMessage(message, ...items);
  },
  error: ({ message, items = [] }: ErrorRequest) => {
    vscode.window.showErrorMessage(message, ...items);
  },
  webview: (request: WebviewRequest) => {
    webview.show(request);
  }
};

function act(request: ActRequest, evaluate: EvaluateFunction): void {
  const handler = actHandlers[request.type] || actHandlers.default;
  handler(request, evaluate);
}

export function inspect(x: any, evaluate: EvaluateFunction): any {
  if (isFlare(x)) {
    console.log('FLARE');
    act(getFlareRequest(x), evaluate);
  }
  return x;
}
