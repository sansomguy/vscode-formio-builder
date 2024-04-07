import * as vscode from "vscode";
import { getNonce } from "./utils/getNonce";
import {
  FileUpdate,
  fileUpdateMessageType,
  isFormBuilderUpdate,
} from "~messages/update";

/**
 * Provider for formio formbuilder based schema editor.
 *
 * Formbuilders are used for formio schema files which are just json files.
 * To get started, run this extension and open an empty `.json` formio schema file in VS Code.
 *
 */
export class FormIOBuilderEditorProvider
  implements vscode.CustomTextEditorProvider
{
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new FormIOBuilderEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      FormIOBuilderEditorProvider.viewType,
      provider
    );
    return providerRegistration;
  }

  private static readonly viewType = "formioBuilder.editor";

  constructor(private readonly context: vscode.ExtensionContext) {}

  /**
   * Called when our custom editor is opened.
   *
   *
   */
  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // Setup initial content for the webview
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    function updateWebview() {
      const message: FileUpdate = {
        type: fileUpdateMessageType,
        text: document.getText(),
      };
      webviewPanel.webview.postMessage(message);
    }

    // Hook up event handlers so that we can synchronize the webview with the text document.
    //
    // The text document acts as our model, so we have to sync change in the document to our
    // editor and sync changes in the editor back to the document.
    //
    // Remember that a single text document can also be shared between multiple custom
    // editors (this happens for example when you split a custom editor)
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
      (e) => {
        if (e.document.uri.toString() === document.uri.toString()) {
          updateWebview();
        }
      }
    );

    // Make sure we get rid of the listener when our editor is closed.
    webviewPanel.onDidDispose(() => {
      changeDocumentSubscription.dispose();
    });

    // Receive message from the webview.
    webviewPanel.webview.onDidReceiveMessage((message) => {
      switch (true) {
        case isFormBuilderUpdate(message): {
          this.updateTextDocument(document, message.schema);
          break;
        }
      }
    });

    updateWebview();
  }

  /**
   * Get the static html used for the editor webviews.
   */
  private getHtmlForWebview(webview: vscode.Webview): string {
    // // Use a nonce to whitelist which scripts can be run
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "index.js")
    );

    const stlyesUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, "media", "index.css")
    );
    const nonce = getNonce();
    // <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
    return /*html*/ `
	<!DOCTYPE html>
		<html lang="en">
		<head>
		<meta charset="UTF-8">
		
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link href="${stlyesUri}" nonce="${webview.cspSource}" rel="stylesheet" />
		<title>FormIO Builder</title>
		</head>
		<body>
			<div id="root">
			</div>
			<script type="module" nonce="${nonce}" src="${scriptUri}"></script>
		</body>
		</html>
		`;
  }

  /**
   * Write out the json to a given document.
   */
  private updateTextDocument(document: vscode.TextDocument, json: any) {
    const edit = new vscode.WorkspaceEdit();

    // Just replace the entire document every time for this example extension.
    // A more complete extension should compute minimal edits instead.
    edit.replace(
      document.uri,
      new vscode.Range(0, 0, document.lineCount, 0),
      JSON.stringify(json, null, 2)
    );

    return vscode.workspace.applyEdit(edit);
  }
}
