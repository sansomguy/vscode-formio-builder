import { useContext, useEffect, useState } from "react";
import { FormBuilder } from "@formio/react";
import "formiojs/dist/formio.full.css";
import "./App.css";
import { isFileUpdate, isFormBuilderUpdate } from "../../messages/update";
import { VSCodeProvider } from "./vscodeAPI/context";

function App() {
  const [schema, setSchema] = useState<Record<string, unknown>>({
    display: "form",
  });

  const vscode = useContext(VSCodeProvider);

  useEffect(() => {
    window.addEventListener("message", receiveMessage);
  });

  function receiveMessage(event: MessageEvent) {
    const message = event.data; // The json data that the extension sent
    switch (true) {
      case isFileUpdate(message): {
        const { text } = message;
        // Update our webview's content
        setSchema(JSON.parse(text));
        // Then persist state information.
        // This state is returned in the call to `vscode.getState` below when a webview is reloaded.
        vscode?.setState({ text });
        break;
      }
      default:
        break;
    }
  }

  function sendMessage(message: any) {
    switch (true) {
      case isFormBuilderUpdate(message): {
        vscode?.postMessage(message);
        break;
      }
    }
  }

  function handleOnChange(form: Record<string, unknown>) {
    sendMessage({ type: "formBuilderUpdate", schema: form });
    vscode?.setState({ text: JSON.stringify(form) });
  }

  return (
    <div className="app-container">
      <FormBuilder form={schema} onChange={handleOnChange} />
    </div>
  );
}

export default App;
