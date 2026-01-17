import { Line, LineType } from "./line";
import { Graph, GraphNode, Transition } from "./graph";
import { classifyLine } from "./lineSplitter";

export function graphBuilder(lines: Line[]): Graph {
  const graph: Graph = new Graph({
    name: undefined,
    startState: undefined,
    acceptStates: new Set<string>(),
  });

  let isReadLine = true;
  let lineIndex = 0;

  while (lineIndex < lines.length) {
    const lineType = classifyLine(lines[lineIndex].normalizedText);

    if (lineType == LineType.ACCEPT) {
      const indexOf = lines[lineIndex].normalizedText.indexOf(":");
      const acceptStates = lines[lineIndex].normalizedText
        .substring(indexOf + 1)
        .trim()
        .split(" ")
        .filter((s) => s.trim().length > 0)
        .map((s) => s.trim());

      acceptStates.forEach((state) => graph.acceptStates.add(state));
      lineIndex++;
    } else if (lineType == LineType.NAME) {
      const indexOf = lines[lineIndex].normalizedText.indexOf(":");
      const name = lines[lineIndex].normalizedText
        .substring(indexOf + 1)
        .trim();
      graph.name = name;
      lineIndex++;
    } else if (lineType == LineType.INIT) {
      const indexOf = lines[lineIndex].normalizedText.indexOf(":");
      const startState = lines[lineIndex].normalizedText
        .substring(indexOf + 1)
        .trim();
      graph.startState = startState;
      lineIndex++;
    } else if (lineType == LineType.READ_WRITE_MOVE) {
      const readLine = lines[lineIndex];
      lineIndex++;
      const writeMoveLine = lines[lineIndex];
      lineIndex++;

      let tokens = readLine.normalizedText
        .split(",")
        .filter((s) => s.trim().length > 0)
        .map((s) => s.trim());

      const [curState, ...readTokens] = tokens;
      if (graph.nodes.has(curState) === false) {
        const newNode = new GraphNode();
        graph.nodes.set(curState, newNode);
      }

      const transition = new Transition();
      transition.read = readTokens;

      tokens = writeMoveLine.normalizedText
        .split(",")
        .filter((s) => s.trim().length > 0)
        .map((s) => s.trim());

      const [toState, ...writeMoveTokens] = tokens;

      transition.toState = toState;
      transition.write = writeMoveTokens.slice(0, readTokens.length);
      transition.move = writeMoveTokens.slice(readTokens.length);

      const curNode = graph.nodes.get(curState);

      // already contains transifiton with same read symbols overwrite it
      let found = false;
      for (let i = 0; i < curNode.transitions.length; i++) {
        const existingTransition = curNode.transitions[i];
        if (
          existingTransition.read.length === transition.read.length &&
          existingTransition.read.every(
            (value, index) => value === transition.read[index],
          )
        ) {
          curNode.transitions[i] = transition;
          found = true;
          break;
        }
      }

      if (!found) {
        curNode.transitions.push(transition);
      }

      isReadLine = !isReadLine;
    }
  }

  return graph;
}
