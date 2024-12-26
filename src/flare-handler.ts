import * as vscode from 'vscode';
import * as webview from './webview';

let evalFn: (code: any) => void;
export function setEvalFn(fn: typeof evalFn) {
  evalFn = fn;
}

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

type InfoRequest = { type: 'info'; message: string; items?: string[]; then?: any };
type WarnRequest = { type: 'warn'; message: string; items?: string[] };
type ErrorRequest = { type: 'error'; message: string; items?: string[] };
type WebviewRequest = { type: 'webview'; title?: string; html?: string; url?: string; key?: string; column?: vscode.ViewColumn; opts?: any};
type DefaultRequest = { type: 'default'; [key: string]: any };

type ActRequest = InfoRequest | WarnRequest | ErrorRequest | WebviewRequest | DefaultRequest;

const actHandlers: Record<string, (request: ActRequest) => void> = {
  default: (request: DefaultRequest) => {
    vscode.window.showErrorMessage(`Unknown flare request type: ${JSON.stringify(request.type)}`);
  },
  info: ({ message, items = [], then }: InfoRequest) => {
    const p = vscode.window.showInformationMessage(message, ...items);
    if (then) {
      p.then((selected) => {
        evalFn?.([['resolve', then], selected]);
      });
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

function act(request: ActRequest): void {
  const handler = actHandlers[request.type] || actHandlers.default;
  handler(request);
}

export function inspect(x: any): any {
  if (isFlare(x)) {
    console.log('FLARE');
    act(getFlareRequest(x));
  }
  return x;
}
