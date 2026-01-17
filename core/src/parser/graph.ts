class Graph {
  public name: string;
  public startState: string;
  public acceptStates: Set<string>;
  public nodes: Map<string, GraphNode> = new Map(); // state and node mapping

  constructor({
    name,
    startState,
    acceptStates,
  }: {
    name: string;
    startState: string;
    acceptStates: Set<string>;
  }) {
    this.name = name;
    this.startState = startState;
    this.acceptStates = acceptStates;
  }
}

class GraphNode {
  public state: string;
  public transitions: Transition[] = [];
}

class Transition {
  public read: string[];
  public write: string[];
  public move: string[];
}
