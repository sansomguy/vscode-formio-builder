import * as vscode from "vscode";
import { FormIOBuilderEditorProvider } from "./FormIOBuilderEditorProvider";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(FormIOBuilderEditorProvider.register(context));
}
