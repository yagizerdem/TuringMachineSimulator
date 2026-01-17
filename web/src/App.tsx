import { useState } from "react";
import { CodeEditor } from "./components/code-editor";
import { Tape } from "./components/tape";
import { Button } from "./components/ui/button";
import { DefaultLayout } from "./layout";
import { lineSplitter } from "../../core/src/parser/lineSplitter";
import { syntaxChecker } from "../../core/src/parser/syntaxChecker";
import { SyntaxError } from "../../core/src/error/syntaxError";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "./provider/app-provider";
import { TapeSize } from "../../core/src/enum/tapeSize";

function App() {
  const [code, setCode] = useState("");
  const { setTapeSize, tapeSize } = useApp();

  function compile() {
    try {
      const lines = lineSplitter(code);
      console.log(lines);
      // syntaxChecker(lines, ()=> {}, );
    } catch (err) {
      if (err instanceof SyntaxError) {
      }
    }
  }

  return (
    <DefaultLayout>
      <div className="w-full h-full  overflow-y-scroll">
        <Tape />
        <div className="w-1/2 flex flex-col mx-auto min-w-96 my-10 ">
          <div className="flex items-end justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-64 bg-secondary my-4 p-4 font-bold  cursor-pointer">
                Select Tape Count
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setTapeSize(TapeSize.SINGLE)}>
                  1 (Single)
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTapeSize(TapeSize.DOUBLE)}>
                  2 (Double)
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTapeSize(TapeSize.TRIPLE)}>
                  3 (Triple)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="ml-4 bg-chart-2 min-h-8 cursor-pointer my-4"
              variant={"outline"}
            >
              Current: {tapeSize}
            </Button>
          </div>

          <CodeEditor
            value=""
            className="w-full h-1/2 min-w-96 min-h-96 max-h-120"
            getCode={(code) => {
              setCode(code);
            }}
          />
          <Button
            className="w-full bg-chart-2 min-h-8 cursor-pointer my-0"
            onMouseUp={compile}
          >
            Compile
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default App;
