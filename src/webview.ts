import * as vscode from 'vscode';

const defaultOpts = {
  enableScripts: true,
};

// keep track of open webviews that have a key,
// so that they can be updated
const webviewRegistry: Record<string, vscode.WebviewPanel> = {};

function setHtml(panel: vscode.WebviewPanel, title: string, html: string): vscode.WebviewPanel {
  if (panel.title !== title) {
    panel.title = title;
  }
  if (panel.webview.html !== html) {
    panel.webview.html = html;
  }
  panel.reveal();
  return panel;
}

function urlInIframe(uri: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<style type="text/css">
  body, html {
    margin: 0; padding: 0; height: 100%; overflow: hidden;
  }
  #content {
    position: absolute; left: 0; right: 0; bottom: 0; top: 0px;
  }
</style>
</head>
<body>
  <iframe src="${uri}" style="width:100%; height:100%; border:none;"></iframe>
</body>
</html>`;
}

export function show({
  title = 'Webview',
  html,
  url,
  key,
  column = vscode.ViewColumn.Beside,
  opts = defaultOpts,
}: {
  title?: string;
  html?: string;
  url?: string;
  key?: string;
  column?: vscode.ViewColumn;
  opts?: typeof defaultOpts;
}): vscode.WebviewPanel {
  const finalHtml = url ? urlInIframe(url) : html || '';
  if (key) {
    const existingPanel = webviewRegistry[key];
    if (existingPanel) {
      return setHtml(existingPanel, title, finalHtml);
    }
  }

  const panel = vscode.window.createWebviewPanel('calva-webview', title, column, opts);
  setHtml(panel, title, finalHtml);

  if (key) {
    webviewRegistry[key] = panel;
    panel.onDidDispose(() => delete webviewRegistry[key]);
  }

  return panel;
}

// TODO: register a command for creating a webview, because why not?
