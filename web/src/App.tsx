import { useEffect, useRef, useState } from "react";
import { CodeEditor } from "./components/code-editor";
import { TapeCard } from "./components/tape-card";
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
import { graphBuilder } from "../../core/src/parser/graphBuilder";
import gsap from "gsap";
import { Graph } from "../../core/src/parser/graph";
import {
  Binary_addition,
  Binary_Multiplication,
  Binary_numbers_divisible_by_3,
  Binary_palindrome,
  Decimal_to_binary,
  Duplicate_binary_string,
  Even_amount_of_zeros,
  Fast_binary_palindrome,
  Logarithm_of_length,
} from "./programs";

function App() {
  const [code, setCode] = useState("");
  const { setTapeSize, tapeSize } = useApp();
  const [error, setError] = useState<string | null>(null);
  const errorPanelRef = useRef<HTMLDivElement | null>(null);
  const [graph, setGraph] = useState<Graph | null>(null);

  function compile() {
    try {
      setError(null);
      const lines = lineSplitter(code);
      console.log(lines);
      syntaxChecker(lines, () => {}, tapeSize);
      const graph = graphBuilder(lines);
      setGraph(graph);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError(`Line ${err.lineNumber}: ${err.message}`);
      }
    }
  }

  useEffect(() => {
    if (errorPanelRef.current && error) {
      gsap.fromTo(
        errorPanelRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5 },
      );
    }

    if (errorPanelRef && !error) {
      gsap.to(errorPanelRef.current, { opacity: 0, y: -20, duration: 0.5 });
    }
  }, [error]);

  return (
    <DefaultLayout>
      <div className="w-full h-full  overflow-y-scroll">
        {graph && <TapeCard graph={graph} />}
        {error && (
          <div
            className="w-1/2  mx-auto my-1 p-4  font-bold text-chart-5"
            ref={errorPanelRef}
          >
            Error: {error}
          </div>
        )}
        <div className="w-1/2 flex flex-col mx-auto min-w-96 mb-10 ">
          <div className="flex items-end justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-64 bg-secondary mx-4 mb-4 p-4 font-bold  cursor-pointer">
                Examples
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>1 Tape</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onMouseUp={() => setCode(Binary_numbers_divisible_by_3)}
                >
                  Divisible by 3 Algorithm
                </DropdownMenuItem>
                <DropdownMenuItem onMouseUp={() => setCode(Binary_palindrome)}>
                  Binary palindrome
                </DropdownMenuItem>
                <DropdownMenuItem onMouseUp={() => setCode(Decimal_to_binary)}>
                  Decimal to binary
                </DropdownMenuItem>
                <DropdownMenuItem
                  onMouseUp={() => setCode(Even_amount_of_zeros)}
                >
                  Even amount of zeros
                </DropdownMenuItem>
                <DropdownMenuItem
                  onMouseUp={() => setCode(Duplicate_binary_string)}
                >
                  Duplicate binary string
                </DropdownMenuItem>
                <DropdownMenuLabel>2 Tapes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onMouseUp={() => setCode(Fast_binary_palindrome)}
                >
                  Fast binary palindrome
                </DropdownMenuItem>
                <DropdownMenuItem
                  onMouseUp={() => setCode(Logarithm_of_length)}
                >
                  Logarithm of length
                </DropdownMenuItem>
                <DropdownMenuLabel>3 Tapes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onMouseUp={() => setCode(Binary_addition)}>
                  Binary addition
                </DropdownMenuItem>
                <DropdownMenuItem
                  onMouseUp={() => setCode(Binary_Multiplication)}
                >
                  Binary Multiplication
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="w-64 bg-secondary mb-4 p-4 font-bold  cursor-pointer">
                Select Tape Count
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onSelect={() => {
                    setGraph(null);
                    setTapeSize(TapeSize.SINGLE);
                  }}
                >
                  1 (Single)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setGraph(null);
                    setTapeSize(TapeSize.DOUBLE);
                  }}
                >
                  2 (Double)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setGraph(null);
                    setTapeSize(TapeSize.TRIPLE);
                  }}
                >
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
            value={code}
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
