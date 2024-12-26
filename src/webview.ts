import * as vscode from 'vscode';

const defaultOpts = {
  enableScripts: true
};

function insertPanel(state: { webviews: Record<string, vscode.WebviewPanel> }, key: string, panel: vscode.WebviewPanel): void {
  state.webviews[key] = panel;
}

function deleteWebviewPanel(state: { webviews: Record<string, vscode.WebviewPanel> }, key: string): void {
  delete state.webviews[key];
}

function selectWebviewPanel(state: { webviews: Record<string, vscode.WebviewPanel> }, key: string): vscode.WebviewPanel | undefined {
  return state.webviews[key];
}

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
  title = "Webview",
  html,
  url,
  key,
  column = vscode.ViewColumn.Beside,
  opts = defaultOpts
}: {
  title?: string;
  html?: string;
  url?: string;
  key?: string;
  column?: vscode.ViewColumn;
  opts?: typeof defaultOpts;
}): vscode.WebviewPanel {
  const finalHtml = url ? urlInIframe(url) : html || '';
  const appState = db.getAppState();
  if (key) {
    const existingPanel = selectWebviewPanel(appState, key);
    if (existingPanel) {
      return setHtml(existingPanel, title, finalHtml);
    }
  }

  const panel = vscode.window.createWebviewPanel("calva-webview", title, column, opts);
  setHtml(panel, title, finalHtml);

  if (key) {
    insertPanel(appState, key, panel);
    panel.onDidDispose(() => deleteWebviewPanel(appState, key));
  }

  return panel;
}
