import { useContext, useEffect, useState } from "react";
import { FormBuilder } from "@formio/react";
import "./App.css";
import { isFileUpdate, isFormBuilderUpdate } from "../../messages/update";
import { VSCodeProvider } from "./vscodeAPI/context";

declare global {
  interface Window {
    initialDocumentJson: Record<string, unknown>;
  }
}

function App() {
  const [schema, setSchema] = useState<Record<string, unknown>>(
    window.initialDocumentJson
  );

  const vscode = useContext(VSCodeProvider);

  useEffect(() => {
    window.addEventListener("message", receiveMessage);
  });

  function receiveMessage(event: MessageEvent) {
    const message = event.data; // The json data that the extension sent
    switch (true) {
      case isFileUpdate(message): {
        const { text } = message;
        setSchema(JSON.parse(text));
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
  }

  return (
    <div className="app-container">
      <FormBuilder form={schema} onChange={handleOnChange} />
    </div>
  );
}

export default App;
