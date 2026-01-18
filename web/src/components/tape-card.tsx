import { useEffect, useRef, useState } from "react";
import { Graph } from "../../../core/src/parser/graph";
import { Simulator } from "../../../core/src/simulator/simulator";
import { useApp } from "@/provider/app-provider";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { PauseIcon, PlayIcon, SkipForwardIcon, SquareIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tape } from "./tape";
import { TapeSize } from "../../../core/src/enum/tapeSize";

const CELL_COUNT = 23;

interface TapeCardProps {
  graph: Graph | null;
}

export function TapeCard({ graph }: TapeCardProps) {
  const [simulator, setSimulator] = useState<Simulator | null>(null);
  const { tapeSize } = useApp();
  const [speed, setSpeed] = useState(10);
  const tape1Ref = useRef<HTMLDivElement | null>(null);
  const tape2Ref = useRef<HTMLDivElement | null>(null);
  const tape3Ref = useRef<HTMLDivElement | null>(null);
  const [CELL_WIDTH, setCELL_WIDTH] = useState(20);
  const [offset1, setOffset1] = useState(0);
  const [offset2, setOffset2] = useState(0);
  const [offset3, setOffset3] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // calculate cell width on resize and initial render
  useEffect(() => {
    function calculate() {
      if (!tape1Ref.current) return;
      const width = tape1Ref.current.offsetWidth;
      setCELL_WIDTH(width / 23);
    }

    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  useEffect(() => {
    if (!graph) return;
    const simulator = new Simulator();
    simulator.init(graph, tapeSize);
    setSimulator(simulator);
  }, [graph]);

  function executeStep() {
    if (!simulator) return;
    const prevHeadPositions = [...simulator.heads];
    simulator.step();

    // animate tape movement
    if (
      tapeSize == TapeSize.SINGLE ||
      tapeSize == TapeSize.TRIPLE ||
      tapeSize == TapeSize.DOUBLE
    ) {
      const head1 = simulator.heads[0];
      if (head1 > prevHeadPositions[0]) {
        // move right
        setOffset1((prev) => prev + CELL_WIDTH);
      } else if (head1 < prevHeadPositions[0]) {
        // move left
        setOffset1((prev) => prev - CELL_WIDTH);
      }
    }

    if (tapeSize == TapeSize.DOUBLE || tapeSize == TapeSize.TRIPLE) {
      const head2 = simulator.heads[1];
      if (head2 > prevHeadPositions[1]) {
        // move right
        setOffset2((prev) => prev + CELL_WIDTH);
      } else if (head2 < prevHeadPositions[1]) {
        // move left
        setOffset2((prev) => prev - CELL_WIDTH);
      }
    }

    if (tapeSize == TapeSize.TRIPLE) {
      const head3 = simulator.heads[2];
      if (head3 > prevHeadPositions[2]) {
        // move right
        setOffset3((prev) => prev + CELL_WIDTH);
      } else if (head3 < prevHeadPositions[2]) {
        // move left
        setOffset3((prev) => prev - CELL_WIDTH);
      }
    }

    // reset offset after animation
    setTimeout(() => {
      setOffset1(0);
      setOffset2(0);
      setOffset3(0);
      setSimulator(simulator.clone()); // refresh ui
    }, 300);
  }

  function loadTape() {
    if (!inputRef.current || !simulator) return;
    const input = inputRef.current.value;

    for (let i = 0; i < input.length; i++) {
      simulator.tapes[0].set(i, input[i]);
    }

    setSimulator(simulator.clone());
  }

  return (
    <div className="w-3/4 h-fit mx-auto  border-2 p-5 mb-5">
      <h1 className="text-center font-bold text-2xl ">{graph?.name}</h1>
      <hr className="my-3 font-bold " />
      <div className="w-full h-full my-10 overflow-hidden">
        {(tapeSize == TapeSize.SINGLE ||
          tapeSize == TapeSize.DOUBLE ||
          tapeSize == TapeSize.TRIPLE) && (
          <div ref={tape1Ref} className="w-full h-12 my-10 overflow-hidden">
            <div
              className="h-full flex"
              style={{
                transform: `translateX(${offset1 - CELL_WIDTH}px)`,
                transition: "transform 0.2s ease",
              }}
            >
              {[...Array(CELL_COUNT + 2)].map((_, i) => {
                const head = simulator?.heads[0] ?? 0;
                const symbol = simulator?.tapes[0].get(head - 12 + i) ?? " ";

                return (
                  <div
                    key={i}
                    className="h-full bg-blue-500 border-2"
                    style={{
                      width: CELL_WIDTH,
                      minWidth: CELL_WIDTH,
                    }}
                  >
                    {symbol}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(tapeSize == TapeSize.DOUBLE || tapeSize == TapeSize.TRIPLE) && (
          <div ref={tape2Ref} className="w-full h-12 my-10 overflow-hidden">
            <div
              className="h-full flex"
              style={{
                transform: `translateX(${offset2 - CELL_WIDTH}px)`,
                transition: "transform 0.2s ease",
              }}
            >
              {[...Array(CELL_COUNT + 2)].map((_, i) => {
                const head = simulator?.heads[1] ?? 0;
                const symbol = simulator?.tapes[1].get(head - 12 + i) ?? " ";

                return (
                  <div
                    key={i}
                    className="h-full bg-blue-500 border-2"
                    style={{
                      width: CELL_WIDTH,
                      minWidth: CELL_WIDTH,
                    }}
                  >
                    {symbol}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tapeSize == TapeSize.TRIPLE && (
          <div ref={tape3Ref} className="w-full h-12 my-10 overflow-hidden">
            <div
              className="h-full flex"
              style={{
                transform: `translateX(${offset3 - CELL_WIDTH}px)`,
                transition: "transform 0.2s ease",
              }}
            >
              {[...Array(CELL_COUNT + 2)].map((_, i) => {
                const head = simulator?.heads[2] ?? 0;
                const symbol = simulator?.tapes[2].get(head - 12 + i) ?? " ";
                return (
                  <div
                    key={i}
                    className="h-full bg-blue-500 border-2"
                    style={{
                      width: CELL_WIDTH,
                      minWidth: CELL_WIDTH,
                    }}
                  >
                    {symbol}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <footer className="flex flex-row justify-between items-center mx-auto mt-4">
        <div className="w-1/3 h-fit">
          <Input className="w-64" placeholder="enter input" ref={inputRef} />
          <Button
            className="ml-2 cursor-pointer "
            onMouseUp={loadTape}
            disabled={!simulator}
          >
            Load Tape
          </Button>
        </div>
        <div className="flex flex-row w-1/3 gap-1 items-center justify-center">
          <Button className="mt-4 w-12 cursor-pointer" variant={"outline"}>
            <PlayIcon className="inline " />
          </Button>
          <Button className="mt-4 w-12 cursor-pointer" variant={"outline"}>
            <PauseIcon className="inline " />
          </Button>
          <Button className="mt-4 w-12 cursor-pointer" variant={"outline"}>
            <SquareIcon className="inline " />
          </Button>
          <Button
            className="mt-4 w-12 cursor-pointer"
            variant={"outline"}
            onMouseUp={() => executeStep()}
          >
            <SkipForwardIcon className="inline " />
          </Button>
        </div>
        <div className="w-1/3 flex flex-col ">
          <span className="font-bold block mb-2 select-none">
            Speed: ({speed} / 100)
          </span>
          <Slider
            value={[speed]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setSpeed(Math.max(value[0], 10))}
          />
        </div>
      </footer>
    </div>
  );
}
