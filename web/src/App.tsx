import { CodeEditor } from "./components/code-editor";
import { DefaultLayout } from "./layout";

function App() {
  return (
    <DefaultLayout>
      <CodeEditor value="string here" />
    </DefaultLayout>
  );
}

export default App;
