import { Graph } from "../parser/graph";

export class Simulator {
  public graph: Graph;
  public tape1 = new Map<number, string>();
  public tape2 = new Map<number, string>();
  public tape3 = new Map<number, string>();
  public currentState: string = undefined;

  public init(graph: Graph) {
    this.graph = graph;
    this.tape1.clear();
    this.tape2.clear();
    this.tape3.clear();
    this.currentState = this.graph.startState;
  }

  public step(): boolean {
    const curNode = this.graph.nodes.get(this.currentState);
    if (!curNode) {
      return false; // rejected
    }

    return true;
  }
}
