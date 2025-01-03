import * as vscode from 'vscode';

const defaultOpts = {
  enableScripts: true,
};

interface CalvaWebPanel extends vscode.WebviewPanel {
  url?: string;
}

// keep track of open webviews that have a key
// so that they can be updated in the future
const calvaWebPanels: Record<string, CalvaWebPanel> = {};

export function show({
  title = 'Webview',
  key,
  html,
  url,
  reload = false,
  reveal = true,
  column = vscode.ViewColumn.Beside,
  opts = defaultOpts,
}: {
  title?: string;
  key?: string;
  html?: string;
  url?: string;
  reload?: boolean;
  reveal?: boolean;
  column?: vscode.ViewColumn;
  opts?: typeof defaultOpts;
}): void {
  let panel: CalvaWebPanel;
  if (key) {
    panel = calvaWebPanels[key];
  }
  if (!panel) {
    panel = vscode.window.createWebviewPanel('calva-webview', title, column, opts);
    if (key) {
      calvaWebPanels[key] = panel;
      panel.onDidDispose(() => delete calvaWebPanels[key]);
    }
  }

  if (html && panel.webview.html != html) {
    panel.webview.html = html;
  }

  if (url && (url != panel.url || reload)) {
    panel.url = url;
    panel.webview.html = urlInIframe(url);
  }

  if (panel.title !== title) {
    panel.title = title;
  }

  if (reveal) {
    panel.reveal();
  }
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
