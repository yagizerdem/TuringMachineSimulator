import { cn } from "@/lib/utils";
import * as monaco from "monaco-editor";
import { useEffect, useRef } from "react";

interface CodeEditorProps {
  value: string;
  className?: string;
  getCode?: (code: string) => void;
}

export function CodeEditor({ value, className, getCode }: CodeEditorProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    monaco.languages.register({
      id: "turingMachineScript",
    });

    // custom tokenizer
    const langauge = monaco.languages.setMonarchTokensProvider(
      "turingMachineScript",
      {
        tokenizer: {
          root: [
            [/\/\/.*/, "comment"],
            [/[><_-]/, "operator"], // - stay > move right < move left _ (EPS)
            [/\b\d+\b/, "number"],
            [/\b[a-zA-Z]+\d+\b/, "state"],
            [/\b[a-zA-Z]+\b/, "string"],
          ],
        },
      },
    );

    const model = monaco.editor.createModel(value, "turingMachineScript");

    monaco.editor.defineTheme("default", {
      base: "vs",
      inherit: false,
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",

        // line numbers
        "editorLineNumber.foreground": "#5a5a5a",
        "editorLineNumber.activeForeground": "#ffffff",
        "editorLineNumber.dimmedForeground": "#3a3a3a",
        "editor.lineHighlightBackground": "#3A312C",
        "editorCursor.foreground": "#ffffff",
        "editorCursor.background": "#ffffff",
      } as monaco.editor.IColors,
      rules: [
        { token: "comment", foreground: "008000" },
        { token: "state", foreground: "BF40BF", fontStyle: "bold" },
        { token: "string", foreground: "89CFF0" },
        { token: "number", foreground: "7FFFD4" },
        { token: "operator", foreground: "CF9FFF" },
      ] as monaco.editor.ITokenThemeRule[],
    } as monaco.editor.IStandaloneThemeData);

    const editor = monaco.editor.create(ref.current!, {
      theme: "default",
      model: model,
    } as monaco.editor.IStandaloneEditorConstructionOptions);

    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      getCode?.(editor.getValue());
    });

    // Handle window resize
    const handleResize = () => {
      editor.layout();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      editor.dispose();
      model.dispose();
    };
  }, []);

  return <div ref={ref} className={cn("h-full w-full", className)}></div>;
}
