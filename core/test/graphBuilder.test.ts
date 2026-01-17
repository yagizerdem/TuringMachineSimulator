import { describe, expect, test } from "@jest/globals";
import { classifyLine, lineSplitter } from "../src/parser/lineSplitter";
import { LineType } from "../src/parser/line";
import { Graph } from "../src/parser/graph";
import { graphBuilder } from "../src/parser/graphBuilder";
import { syntaxChecker } from "../src/parser/syntaxChecker";
import { TapeSize } from "../src/enum/tapeSize";

describe("graphBuilderDoubleTape", () => {
  test("Basic ", () => {
    const input = `
        name: Fast binary palindrome
        init: qCopy
        accept: qAccept

        qCopy,0,_
        qCopy,_,0,>,>

        qCopy,1,_
        qCopy,1,1,>,>

        qCopy,_,_
        qReturn,_,_,-,<

        `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);

    const graph = graphBuilder(lines);

    expect(graph).toBeInstanceOf(Graph);
    expect(graph.name).toBe("Fast binary palindrome");
    expect(Array.from(graph.acceptStates)).toContain("qAccept");
    expect(graph.startState).toBe("qCopy");
    expect(graph.nodes.size).toBe(1);
    const node = graph.nodes.get("qCopy");
    expect(node?.transitions.length).toEqual(3);
    expect(node).toBeDefined();

    const transition0 = node!.transitions[0];
    expect(transition0).toBeDefined();

    expect(transition0.read).toEqual(["0", "_"]);
    expect(transition0.write).toEqual(["_", "0"]);
    expect(transition0.move).toEqual([">", ">"]);
    expect(transition0.toState).toBe("qCopy");

    const transition1 = node!.transitions[1];

    expect(transition1.read).toEqual(["1", "_"]);
    expect(transition1.write).toEqual(["1", "1"]);
    expect(transition1.move).toEqual([">", ">"]);
    expect(transition1.toState).toBe("qCopy");

    const transition2 = node!.transitions[2];

    expect(transition2.read).toEqual(["_", "_"]);
    expect(transition2.write).toEqual(["_", "_"]);
    expect(transition2.move).toEqual(["-", "<"]);
    expect(transition2.toState).toBe("qReturn");
  });

  test("Multiple states with various transitions", () => {
    const input = `
    name: Binary addition
    init: q0
    accept: qAccept

    q0,0,_
    q1,1,0,>,>

    q0,1,_
    q1,0,1,>,>

    q1,0,0
    q2,1,-,>,<

    q1,1,1
    q2,0,0,<,<

    q2,_,_
    qAccept,_,_,-,-
  `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);

    expect(graph).toBeInstanceOf(Graph);
    expect(graph.name).toBe("Binary addition");
    expect(graph.startState).toBe("q0");
    expect(Array.from(graph.acceptStates)).toContain("qAccept");
    expect(graph.nodes.size).toBe(3);

    const node0 = graph.nodes.get("q0");
    expect(node0).toBeDefined();
    expect(node0?.transitions.length).toBe(2);

    const node1 = graph.nodes.get("q1");
    expect(node1).toBeDefined();
    expect(node1?.transitions.length).toBe(2);

    const node2 = graph.nodes.get("q2");
    expect(node2).toBeDefined();
    expect(node2?.transitions.length).toBe(1);
  });

  test("Self-loop transitions", () => {
    const input = `
    name: Self loop test
    init: q0
    accept: qf

    q0,0,0
    q0,1,1,>,>

    q0,1,1
    q0,0,0,-,-

    q0,_,_
    qf,_,_,-,-
  `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);

    expect(graph.nodes.size).toBe(1);
    const node = graph.nodes.get("q0");
    expect(node?.transitions.length).toBe(3);

    expect(node?.transitions[0].toState).toBe("q0");
    expect(node?.transitions[1].toState).toBe("q0");
    expect(node?.transitions[2].toState).toBe("qf");
  });

  test("Complex movements with stay operation", () => {
    const input = `
    name: Stay operation test
    init: qStart
    accept: qEnd

    qStart,0,1
    qMiddle,1,0,-,>

    qMiddle,1,0
    qMiddle,0,1,>,-

    qMiddle,_,_
    qEnd,_,_,-,-
  `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);

    const startNode = graph.nodes.get("qStart");
    expect(startNode?.transitions[0].move).toEqual(["-", ">"]);

    const middleNode = graph.nodes.get("qMiddle");
    expect(middleNode?.transitions[0].move).toEqual([">", "-"]);
    expect(middleNode?.transitions[1].move).toEqual(["-", "-"]);
  });

  test("All different symbols", () => {
    const input = `
    name: Symbol variety
    init: q0
    accept: qf

    q0,a,b
    q1,c,d,>,>

    q1,x,y
    q2,z,w,<,>

    q2,0,1
    qf,2,3,-,-
  `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);

    const node0 = graph.nodes.get("q0");
    expect(node0?.transitions[0].read).toEqual(["a", "b"]);
    expect(node0?.transitions[0].write).toEqual(["c", "d"]);

    const node1 = graph.nodes.get("q1");
    expect(node1?.transitions[0].read).toEqual(["x", "y"]);
    expect(node1?.transitions[0].write).toEqual(["z", "w"]);
  });

  test("Blank symbol handling", () => {
    const input = `
    name: Blank handling
    init: q0
    accept: qf

    q0,_,_
    q1,0,0,>,>

    q1,0,_
    q2,_,1,-,>

    q2,_,0
    qf,1,_,<,-
  `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);

    const node0 = graph.nodes.get("q0");
    expect(node0?.transitions[0].read).toEqual(["_", "_"]);
    expect(node0?.transitions[0].write).toEqual(["0", "0"]);

    const node1 = graph.nodes.get("q1");
    expect(node1?.transitions[0].read).toEqual(["0", "_"]);
    expect(node1?.transitions[0].write).toEqual(["_", "1"]);
  });

  test("Single transition per state", () => {
    const input = `
    name: Linear machine
    init: q0
    accept: q3

    q0,0,0
    q1,1,1,>,>

    q1,1,1
    q2,0,0,>,>

    q2,0,0
    q3,1,1,-,-
  `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);

    expect(graph.nodes.size).toBe(3);

    graph.nodes.forEach((node, stateName) => {
      if (stateName !== "q3") {
        expect(node.transitions.length).toBe(1);
      }
    });
  });

  test("Many transitions from one state", () => {
    const input = `
    name: Multi-branch
    init: q0
    accept: qf

    q0,0,0
    q1,0,0,>,>

    q0,1,1
    q2,1,1,>,>

    q0,a,a
    q3,a,a,>,>

    q0,b,b
    q4,b,b,>,>

    q0,_,_
    qf,_,_,-,-
  `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);

    const node0 = graph.nodes.get("q0");
    expect(node0?.transitions.length).toBe(5);

    expect(node0?.transitions[0].toState).toBe("q1");
    expect(node0?.transitions[1].toState).toBe("q2");
    expect(node0?.transitions[2].toState).toBe("q3");
    expect(node0?.transitions[3].toState).toBe("q4");
    expect(node0?.transitions[4].toState).toBe("qf");
  });

  test("Write same as read", () => {
    const input = `
    name: Copy test
    init: q0
    accept: qf

    q0,0,1
    q1,0,1,>,>

    q1,1,0
    q2,1,0,<,<

    q2,a,b
    qf,a,b,-,-
  `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);

    const node0 = graph.nodes.get("q0");
    expect(node0?.transitions[0].read).toEqual(["0", "1"]);
    expect(node0?.transitions[0].write).toEqual(["0", "1"]);

    const node1 = graph.nodes.get("q1");
    expect(node1?.transitions[0].read).toEqual(["1", "0"]);
    expect(node1?.transitions[0].write).toEqual(["1", "0"]);
  });

  test("Mixed movement directions", () => {
    const input = `
    name: Mixed movements
    init: q0
    accept: qf

    q0,0,0
    q1,1,1,>,<    // İki hareket yönü eklendi

    q1,1,1
    q2,0,0,<,>

    q2,0,0
    q3,1,1,-,>

    q3,1,1
    qf,0,0,>,-
  `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);

    const node0 = graph.nodes.get("q0");
    expect(node0?.transitions[0].move).toEqual([">", "<"]);

    const node1 = graph.nodes.get("q1");
    expect(node1?.transitions[0].move).toEqual(["<", ">"]);

    const node2 = graph.nodes.get("q2");
    expect(node2?.transitions[0].move).toEqual(["-", ">"]);

    const node3 = graph.nodes.get("q3");
    expect(node3?.transitions[0].move).toEqual([">", "-"]);
  });

  test("Accept state with no outgoing transitions", () => {
    const input = `
    name: Terminal accept
    init: q0
    accept: qAccept

    q0,0,0
    q1,1,1,>,>

    q1,1,1
    qAccept,0,0,-,-
  `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);

    expect(graph.nodes.has("qAccept")).toBe(false);
    expect(Array.from(graph.acceptStates)).toContain("qAccept");
  });

  test("Numeric state names", () => {
    const input = `
    name: Numeric states
    init: q0
    accept: q999

    q0,0,0
    q1,1,1,>,>

    q1,1,1
    q42,0,0,>,>

    q42,0,0
    q999,1,1,-,-
  `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);

    expect(graph.startState).toBe("q0");
    expect(graph.nodes.has("q1")).toBe(true);
    expect(graph.nodes.has("q42")).toBe(true);
    expect(Array.from(graph.acceptStates)).toContain("q999");
  });

  test("Special characters in symbols", () => {
    const input = `
    name: Special chars
    init: q0
    accept: qf

    q0,#,$
    q1,@,%,>,>

    q1,*,&
    q2,!,^,<,<

    q2,+,=
    qf,-,~,-,-
  `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);

    const node0 = graph.nodes.get("q0");
    expect(node0?.transitions[0].read).toEqual(["#", "$"]);
    expect(node0?.transitions[0].write).toEqual(["@", "%"]);

    const node1 = graph.nodes.get("q1");
    expect(node1?.transitions[0].read).toEqual(["*", "&"]);
    expect(node1?.transitions[0].write).toEqual(["!", "^"]);
  });

  test("Empty machine with only accept state", () => {
    const input = `
    name: Minimal
    init: qf
    accept: qf
  `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);

    expect(graph.startState).toBe("qf");
    expect(Array.from(graph.acceptStates)).toContain("qf");
    expect(graph.nodes.size).toBe(0);
  });

  test("Long state name chains", () => {
    const input = `
    name: Long names
    init: qInitialState
    accept: qFinalAcceptState

    qInitialState,0,0
    qProcessingState,1,1,>,>

    qProcessingState,1,1
    qIntermediateState,0,0,>,>

    qIntermediateState,0,0
    qFinalAcceptState,1,1,-,-
  `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);

    expect(graph.startState).toBe("qInitialState");
    expect(graph.nodes.has("qProcessingState")).toBe(true);
    expect(graph.nodes.has("qIntermediateState")).toBe(true);
    expect(Array.from(graph.acceptStates)).toContain("qFinalAcceptState");
  });

  test("Transitions with comments", () => {
    const input = `
    name: Commented machine
    init: q0
    accept: qf

    // First transition
    q0,0,0 // This reads 0,0
    q1,1,1,>,> // Move right on both tapes

    // Second transition  
    q1,1,1
    qf,0,0,-,- // Stay on both
  `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);

    const node0 = graph.nodes.get("q0");
    expect(node0?.transitions.length).toBe(1);
    expect(node0?.transitions[0].toState).toBe("q1");

    const node1 = graph.nodes.get("q1");
    expect(node1?.transitions.length).toBe(1);
    expect(node1?.transitions[0].toState).toBe("qf");
  });
});

describe("graphBuilderSingleTape", () => {
  test("Basic unary increment", () => {
    const input = `
      name: Unary increment
      init: q0
      accept: qf

      q0,0
      q0,0,>

      q0,_
      qf,_,-
    `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.SINGLE);
    const graph = graphBuilder(lines);

    const node = graph.nodes.get("q0")!;
    expect(node.transitions.length).toBe(2);

    expect(node.transitions[0]).toMatchObject({
      read: ["0"],
      write: ["0"],
      move: [">"],
      toState: "q0",
    });

    expect(node.transitions[1]).toMatchObject({
      read: ["_"],
      write: ["_"],
      move: ["-"],
      toState: "qf",
    });
  });

  test("Linear multi-state machine", () => {
    const input = `
      name: Binary counter
      init: q0
      accept: qAccept

      q0,0
      q1,1,>

      q1,1
      q2,0,>

      q2,0
      q3,1,<

      q3,_
      qAccept,_,-
    `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.SINGLE);
    const graph = graphBuilder(lines);

    expect(graph.nodes.size).toBe(4);
  });

  test("Self-loop transitions", () => {
    const input = `
      name: Self loop test
      init: q0
      accept: qf

      q0,0
      q0,1,>

      q0,1
      q0,0,-

      q0,_
      qf,_,-
    `.trim();

    const graph = graphBuilder(lineSplitter(input));
    expect(graph.nodes.get("q0")!.transitions.length).toBe(3);
  });

  test("Stay / Left / Right movements", () => {
    const input = `
      name: Move test
      init: q0
      accept: qf

      q0,0
      q1,1,-

      q1,1
      q2,0,>

      q2,0
      qf,1,<
    `.trim();

    const graph = graphBuilder(lineSplitter(input));

    expect(graph.nodes.get("q0")!.transitions[0].move).toEqual(["-"]);
    expect(graph.nodes.get("q1")!.transitions[0].move).toEqual([">"]);
    expect(graph.nodes.get("q2")!.transitions[0].move).toEqual(["<"]);
  });

  test("Special symbols allowed", () => {
    const input = `
      name: Symbols
      init: q0
      accept: qf

      q0,#
      q1,@,>

      q1,*
      q2,!,<

      q2,+
      qf,-,-
    `.trim();

    const graph = graphBuilder(lineSplitter(input));

    expect(graph.nodes.get("q0")!.transitions[0].read).toEqual(["#"]);
    expect(graph.nodes.get("q0")!.transitions[0].write).toEqual(["@"]);
  });

  test("Accept state has no outgoing transitions", () => {
    const input = `
      name: Terminal
      init: q0
      accept: qf

      q0,0
      qf,1,-
    `.trim();

    const graph = graphBuilder(lineSplitter(input));

    expect(graph.nodes.has("qf")).toBe(false);
    expect(Array.from(graph.acceptStates)).toContain("qf");
  });

  test("Minimal machine (init = accept)", () => {
    const input = `
      name: Minimal
      init: qf
      accept: qf
    `.trim();

    const graph = graphBuilder(lineSplitter(input));
    expect(graph.nodes.size).toBe(0);
  });
});

describe("graphBuilderTripleTape", () => {
  test("Basic unary-style operation on triple tape", () => {
    const input = `
      name: Triple unary
      init: q0
      accept: qf

      q0,0,_,_
      q0,0,_,_,>,>,-

      q0,_,_,_
      qf,_,_,_,-,-,-
    `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.TRIPLE);
    const graph = graphBuilder(lines);

    const node = graph.nodes.get("q0")!;
    expect(node.transitions.length).toBe(2);

    expect(node.transitions[0]).toMatchObject({
      read: ["0", "_", "_"],
      write: ["0", "_", "_"],
      move: [">", ">", "-"],
      toState: "q0",
    });

    expect(node.transitions[1]).toMatchObject({
      read: ["_", "_", "_"],
      write: ["_", "_", "_"],
      move: ["-", "-", "-"],
      toState: "qf",
    });
  });

  test("Linear multi-state machine (triple tape)", () => {
    const input = `
      name: Linear triple
      init: q0
      accept: qAccept

      q0,0,_,_
      q1,1,_,_,>,>,-

      q1,1,_,_
      q2,0,_,_,>,>,-

      q2,0,_,_
      q3,1,_,_,<,<,-

      q3,_,_,_
      qAccept,_,_,_,-,-,-
    `.trim();

    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.TRIPLE);
    const graph = graphBuilder(lines);

    expect(graph.nodes.size).toBe(4);
  });

  test("Self-loop transitions (triple tape)", () => {
    const input = `
      name: Self loop triple
      init: q0
      accept: qf

      q0,0,_,_
      q0,1,_,_,>,>,-

      q0,1,_,_
      q0,0,_,_,-,-,-

      q0,_,_,_
      qf,_,_,_,-,-,-
    `.trim();

    const graph = graphBuilder(lineSplitter(input));
    expect(graph.nodes.get("q0")!.transitions.length).toBe(3);
  });

  test("Stay / Left / Right movements (triple tape)", () => {
    const input = `
      name: Move test triple
      init: q0
      accept: qf

      q0,0,_,_
      q1,1,_,_,-,>,-

      q1,1,_,_
      q2,0,_,_,>,<,-

      q2,0,_,_
      qf,1,_,_,<,-,-
    `.trim();

    const graph = graphBuilder(lineSplitter(input));

    expect(graph.nodes.get("q0")!.transitions[0].move).toEqual(["-", ">", "-"]);
    expect(graph.nodes.get("q1")!.transitions[0].move).toEqual([">", "<", "-"]);
    expect(graph.nodes.get("q2")!.transitions[0].move).toEqual(["<", "-", "-"]);
  });

  test("Special symbols allowed (triple tape)", () => {
    const input = `
      name: Symbols triple
      init: q0
      accept: qf

      q0,#,$,_
      q1,@,%,_,>,>,-

      q1,*,&,_
      q2,!,^,_,<,<,-

      q2,+,=,_
      qf,-,~,_, -,-,-
    `.trim();

    const graph = graphBuilder(lineSplitter(input));

    const t0 = graph.nodes.get("q0")!.transitions[0];
    expect(t0.read).toEqual(["#", "$", "_"]);
    expect(t0.write).toEqual(["@", "%", "_"]);
  });

  test("Accept state has no outgoing transitions (triple)", () => {
    const input = `
      name: Terminal triple
      init: q0
      accept: qf

      q0,0,_,_
      qf,1,_,_,-,-,-
    `.trim();

    const graph = graphBuilder(lineSplitter(input));

    expect(graph.nodes.has("qf")).toBe(false);
    expect(Array.from(graph.acceptStates)).toContain("qf");
  });

  test("Minimal machine (init = accept) triple", () => {
    const input = `
      name: Minimal triple
      init: qf
      accept: qf
    `.trim();

    const graph = graphBuilder(lineSplitter(input));
    expect(graph.nodes.size).toBe(0);
  });
});
