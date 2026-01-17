import { TapeSize } from "../enum/tapeSize";
import { Graph } from "../parser/graph";

export interface StepResult {
  accepted: boolean;
  rejected: boolean;
  continue: boolean;
}

export class Simulator {
  public graph: Graph;
  public tapes: Map<number, string>[];
  public heads: number[];
  public currentState: string = undefined;

  public init(graph: Graph, tapeSize: TapeSize) {
    this.graph = graph;
    if (tapeSize === TapeSize.SINGLE) {
      this.tapes = [new Map<number, string>()];
      this.heads = [0];
    } else if (tapeSize === TapeSize.DOUBLE) {
      this.tapes = [new Map<number, string>(), new Map<number, string>()];
      this.heads = [0, 0];
    } else if (tapeSize === TapeSize.TRIPLE) {
      this.tapes = [
        new Map<number, string>(),
        new Map<number, string>(),
        new Map<number, string>(),
      ];
      this.heads = [0, 0, 0];
    }
    this.currentState = this.graph.startState;
  }

  public step(): StepResult {
    const result: StepResult = {
      accepted: false,
      rejected: false,
      continue: false,
    };
    const curNode = this.graph.nodes.get(this.currentState);
    if (!curNode) {
      result.rejected = true;
      return result;
    }

    for (const transition of curNode.transitions) {
      const tapeSymbols = this.getTapeSymbols();

      const match = transition.read.every(
        (symbol, index) => symbol === (tapeSymbols[index] || "_"),
      );

      if (match) {
        // write symbols
        for (let i = 0; i < this.heads.length; i++) {
          const writeSymbol = transition.write[i];
          this.tapes[i].set(this.heads[i], writeSymbol);
        }

        // move heads
        for (let i = 0; i < this.heads.length; i++) {
          const moveDirection = transition.move[i];
          if (moveDirection == ">") {
            this.heads[i]++;
          } else if (moveDirection == "<") {
            this.heads[i]--;
          } else if (moveDirection == "-") {
            // do nothing
          }
        }

        this.currentState = transition.toState;

        // check if moved to accept state
        if (this.graph.acceptStates.has(this.currentState)) {
          result.accepted = true;
          return result;
        }

        result.continue = true;
        return result;
      }
    }

    if (this.graph.acceptStates.has(this.currentState)) {
      result.accepted = true;
      return result;
    }

    result.rejected = true;
    return result;
  }

  private getTapeSymbols(): string[] {
    const symbols: string[] = [];

    for (let i = 0; i < this.heads.length; i++) {
      symbols.push(this.tapes[i].get(this.heads[i]) || "_"); // _ represents blank symbol (EPS)
    }
    return symbols;
  }
}
