import { useEffect, useRef, useState } from "react";
import { Graph } from "../../../core/src/parser/graph";
import {
  Simulator,
  type StepResult,
} from "../../../core/src/simulator/simulator";
import { useApp } from "@/provider/app-provider";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { PauseIcon, PlayIcon, SkipForwardIcon, SquareIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
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
  const [duration, setDuration] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isAnimating = useRef(false);

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
    setSimulator(null);
  }, [graph]);

  function executeStep() {
    if (!simulator || isAnimating.current) return;

    isAnimating.current = true;

    const prevHeadPositions = [...simulator.heads];
    const response: StepResult = simulator.step();

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

    if (!simulator.stepResult.continue) {
      setAutoPlay(false);
    }

    // reset offset after animation
    setTimeout(() => {
      isAnimating.current = false;
      setOffset1(0);
      setOffset2(0);
      setOffset3(0);
      setSimulator(simulator.clone()); // refresh ui
    }, duration * 1000);
  }

  function loadTape() {
    if (!graph) return;
    if (!inputRef.current) return;

    const simulator = new Simulator();
    simulator.init(graph, tapeSize);
    const input = inputRef.current.value;

    for (let i = 0; i < input.length; i++) {
      simulator.tapes[0].set(i, input[i]);
    }

    setSimulator(simulator);
    setAutoPlay(false);
  }

  function halt() {
    setAutoPlay(false);
    setIsPaused(false);
    setSimulator(null);
  }

  console.log(isPaused);

  useEffect(() => {
    const loop = setInterval(() => {
      if (autoPlay && !isPaused) {
        executeStep();
      }
    }, duration * 1000);

    return () => {
      clearInterval(loop);
    };
  }, [autoPlay, duration, isPaused, simulator]);

  return (
    <div className="w-3/4 h-fit mx-auto  border-2 p-5 mb-5">
      <h1 className="text-center font-bold text-2xl ">{graph?.name}</h1>
      <hr className="my-3 font-bold " />
      <div className="w-full h-12 flex flex-row justify-between">
        <div className="font-bold select-none">
          Steps : {simulator?.stepCount}
        </div>
        <div className="font-bold">State : {simulator?.currentState}</div>
        <div>
          {simulator?.stepResult.accepted && (
            <div>
              <span className="font-bold text-green-400 select-none">
                Accepted
              </span>
            </div>
          )}
          {simulator?.stepResult.rejected && (
            <div>
              <span className="font-bold text-red-400 select-none">
                Rejected
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-full my-10 overflow-hidden ">
        {(tapeSize == TapeSize.SINGLE ||
          tapeSize == TapeSize.DOUBLE ||
          tapeSize == TapeSize.TRIPLE) && (
          <div ref={tape1Ref} className="w-full h-fit my-10 overflow-hidden">
            <div
              className="h-12 flex"
              style={{
                transform: `translateX(${offset1 - CELL_WIDTH}px)`,
                transition: `transform ${duration}s ease`,
              }}
            >
              {[...Array(CELL_COUNT + 2)].map((_, i) => {
                const head = simulator?.heads[0] ?? 0;
                const symbol = simulator?.tapes[0].get(head - 12 + i) ?? " ";

                return (
                  <div
                    key={i}
                    className="h-full bg-blue-500 border-2 relative flex items-center justify-center font-bold"
                    style={{
                      width: CELL_WIDTH,
                      minWidth: CELL_WIDTH,
                    }}
                  >
                    <span>{symbol == "_" ? " " : symbol}</span>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                width: CELL_WIDTH / 2,
                marginLeft: CELL_WIDTH * 11 + CELL_WIDTH / 4,
                marginTop: -8,
              }}
            >
              <div
                className="w-0 h-0 
                rotate-180
            border-l-[12px] border-l-transparent
            border-r-[12px] border-r-transparent
            border-t-[20px] border-t-white"
              ></div>
            </div>
          </div>
        )}

        {(tapeSize == TapeSize.DOUBLE || tapeSize == TapeSize.TRIPLE) && (
          <div ref={tape2Ref} className="w-full h-fit my-10 overflow-hidden">
            <div
              className="h-12 flex"
              style={{
                transform: `translateX(${offset2 - CELL_WIDTH}px)`,
                transition: `transform ${duration}s ease`,
              }}
            >
              {[...Array(CELL_COUNT + 2)].map((_, i) => {
                const head = simulator?.heads[1] ?? 0;
                const symbol = simulator?.tapes[1].get(head - 12 + i) ?? " ";

                return (
                  <div
                    key={i}
                    className="h-full bg-blue-500 border-2 flex items-center justify-center font-bold"
                    style={{
                      width: CELL_WIDTH,
                      minWidth: CELL_WIDTH,
                    }}
                  >
                    {symbol == "_" ? " " : symbol}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                width: CELL_WIDTH / 2,
                marginLeft: CELL_WIDTH * 11 + CELL_WIDTH / 4,
                marginTop: -8,
              }}
            >
              <div
                className="w-0 h-0 
                rotate-180
            border-l-[12px] border-l-transparent
            border-r-[12px] border-r-transparent
            border-t-[20px] border-t-white"
              ></div>
            </div>
          </div>
        )}

        {tapeSize == TapeSize.TRIPLE && (
          <div ref={tape3Ref} className="w-full h-fit my-10 overflow-hidden">
            <div
              className="h-12 flex"
              style={{
                transform: `translateX(${offset3 - CELL_WIDTH}px)`,
                transition: `transform ${duration}s ease`,
              }}
            >
              {[...Array(CELL_COUNT + 2)].map((_, i) => {
                const head = simulator?.heads[2] ?? 0;
                const symbol = simulator?.tapes[2].get(head - 12 + i) ?? " ";
                return (
                  <div
                    key={i}
                    className="h-full bg-blue-500 border-2 flex items-center justify-center font-bold"
                    style={{
                      width: CELL_WIDTH,
                      minWidth: CELL_WIDTH,
                    }}
                  >
                    {symbol == "_" ? " " : symbol}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                width: CELL_WIDTH / 2,
                marginLeft: CELL_WIDTH * 11 + CELL_WIDTH / 4,
                marginTop: -8,
              }}
            >
              <div
                className="w-0 h-0 
                rotate-180
            border-l-[12px] border-l-transparent
            border-r-[12px] border-r-transparent
            border-t-[20px] border-t-white"
              ></div>
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
            disabled={!graph}
          >
            Load Tape
          </Button>
        </div>
        <div className="flex flex-row w-1/3 gap-1 items-center justify-center">
          <Button
            className="mt-4 w-12 cursor-pointer"
            variant={"outline"}
            onMouseUp={() => {
              setIsPaused(false);
              setAutoPlay(true);
            }}
          >
            <PlayIcon className="inline " />
          </Button>
          <Button
            className="mt-4 w-12 cursor-pointer"
            variant={"outline"}
            onMouseUp={() => setIsPaused((prev) => !prev)}
          >
            <PauseIcon className="inline " />
          </Button>
          <Button
            className="mt-4 w-12 cursor-pointer"
            variant={"outline"}
            onMouseUp={() => halt()}
          >
            <SquareIcon className="inline " />
          </Button>
          <Button
            className="mt-4 w-12 cursor-pointer"
            variant={"outline"}
            onMouseUp={() => {
              if (autoPlay) {
                if (isPaused) executeStep();
              } else {
                executeStep();
              }
            }}
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
            onValueChange={(value) => {
              setSpeed(Math.max(value[0], 10));
              setDuration(1 - speed / 100);
            }}
          />
        </div>
      </footer>
    </div>
  );
}
