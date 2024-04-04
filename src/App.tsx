import { useState } from "react";
import { FormBuilder } from "@formio/react";
import "formiojs/dist/formio.full.css";
import "./App.css";

function App() {
  const [schema, setSchema] = useState({});

  return (
    <div className="app-container">
      <FormBuilder
        form={{
          display: "form",
          components: [
            {
              label: "Email",
              tableView: true,
              key: "email",
              type: "email",
              input: true,
            },
            {
              label: "Password",
              tableView: false,
              key: "password",
              type: "password",
              input: true,
              protected: true,
            },
          ],
        }}
        onChange={setSchema}
      />
      <pre>{JSON.stringify(schema)}</pre>
    </div>
  );
}

export default App;
