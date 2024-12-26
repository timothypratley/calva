import * as vscode from 'vscode';
import * as webview from './webview';
import { parseEdn } from '../out/cljs-lib/cljs-lib';

type EvaluateFunction = (
  code: string,
  options: any,
  selection?: vscode.Selection
) => Promise<string | null>;

type InfoRequest = { type: 'info'; message: string; items?: string[]; then?: any };
type WarnRequest = { type: 'warn'; message: string; items?: string[] };
type ErrorRequest = { type: 'error'; message: string; items?: string[] };
type WebviewRequest = {
  type: 'webview';
  title?: string;
  html?: string;
  url?: string;
  key?: string;
  column?: vscode.ViewColumn;
  opts?: any;
};
type DefaultRequest = { type: 'default'; [key: string]: any };

type ActRequest = InfoRequest | WarnRequest | ErrorRequest | WebviewRequest | DefaultRequest;

const actHandlers: Record<string, (request: ActRequest, EvaluateFunction) => void> = {
  default: (request: DefaultRequest, evaluate: EvaluateFunction) => {
    void vscode.window.showErrorMessage(
      `Unknown flare request type: ${JSON.stringify(request.type)}`
    );
  },
  info: ({ message, items = [], then }: InfoRequest, evaluate: EvaluateFunction) => {
    const p = vscode.window.showInformationMessage(message, ...items);
    if (then) {
      void p.then((selected) => evaluate('(resolve ' + then + ' ' + selected + ')', null));
    }
  },
  warn: ({ message, items = [] }: WarnRequest) => {
    void vscode.window.showWarningMessage(message, ...items);
  },
  error: ({ message, items = [] }: ErrorRequest) => {
    void vscode.window.showErrorMessage(message, ...items);
  },
  webview: (request: WebviewRequest) => {
    webview.show(request);
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
        console.log('FLARE');
        act(getFlareRequest(x), evaluate);
      }
      return x;
    } catch (e) {
      console.log('ERROR: jsedn.parse failed: ' + e);
    }
  }
}
