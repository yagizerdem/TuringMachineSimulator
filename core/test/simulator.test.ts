import { describe, expect, test } from "@jest/globals";
import { lineSplitter } from "../src/parser/lineSplitter";
import { graphBuilder } from "../src/parser/graphBuilder";
import { LineType } from "../src/parser/line";
import { syntaxChecker } from "../src/parser/syntaxChecker";
import { TapeSize } from "../src/enum/tapeSize";
import { Simulator, StepResult } from "../src/simulator/simulator";

describe("Binary numbers divisible by 3", () => {
  const input = `
name: Binary numbers divisible by 3
init: q0
accept: qAccept

q0,0
q0,0,>

q0,1
q1,1,>

q1,0
q2,0,>

q1,1
q0,1,>

q2,0
q1,0,>

q2,1
q2,1,>

q0,_
qAccept,_,-
    `.trim();

  test("ACCEPT", () => {
    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.SINGLE);
    const graph = graphBuilder(lines);
    const simulator = new Simulator();
    simulator.init(graph, TapeSize.SINGLE);

    simulator.tapes[0].set(0, "1");
    simulator.tapes[0].set(1, "1");
    simulator.tapes[0].set(2, "0");

    let result: StepResult | null = null;

    do {
      result = simulator.step();

      if (result.rejected) {
        expect(false).toBe(true);
        break;
      }

      // should accept
      if (result.accepted) {
        break;
      }
    } while (result.continue);
  });

  test("REJECT", () => {
    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.SINGLE);
    const graph = graphBuilder(lines);
    const simulator = new Simulator();
    simulator.init(graph, TapeSize.SINGLE);

    simulator.tapes[0].set(0, "1");
    simulator.tapes[0].set(1, "1");
    simulator.tapes[0].set(2, "0");
    simulator.tapes[0].set(3, "1");

    let result: StepResult | null = null;

    do {
      result = simulator.step();

      // should reject
      if (result.rejected) {
        break;
      }

      if (result.accepted) {
        expect(true).toBe(false);
        break;
      }
    } while (result.continue);
  });

  test("REJECT", () => {
    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.SINGLE);
    const graph = graphBuilder(lines);
    const simulator = new Simulator();
    simulator.init(graph, TapeSize.SINGLE);

    simulator.tapes[0].set(0, "1");
    simulator.tapes[0].set(1, "a");
    simulator.tapes[0].set(2, "0");

    let result: StepResult | null = null;

    do {
      result = simulator.step();

      // should reject

      if (result.rejected) {
        break;
      }

      if (result.accepted) {
        expect(true).toBe(false);
        break;
      }
    } while (result.continue);
  });
});

describe("Binary addition", () => {
  const input = `
name: Binary addition
init: q0
accept: q5

q0,0,_,_
q0,0,_,_,>,-,-

q0,1,_,_
q0,1,_,_,>,-,-

q0,#,_,_
q1,_,_,_,>,-,-

q1,0,_,_
q1,_,0,_,>,>,-

q1,1,_,_
q1,_,1,_,>,>,-

q1,_,_,_
q2,_,_,_,<,<,-

q2,_,0,_
q2,_,0,_,<,-,-

q2,_,1,_
q2,_,1,_,<,-,-

q2,1,0,_
q3,1,0,_,-,-,-

q2,1,1,_
q3,1,1,_,-,-,-

q2,0,1,_
q3,0,1,_,-,-,-

q2,0,0,_
q3,0,0,_,-,-,-

q3,1,0,_
q3,1,0,1,<,<,<

q3,0,1,_
q3,0,1,1,<,<,<

q3,0,0,_
q3,0,0,0,<,<,<

q3,1,1,_
q4,1,1,0,<,<,<

q3,_,_,_
q5,_,_,_,-,-,-

q3,1,_,_
q3,1,_,1,<,<,<

q3,0,_,_
q3,0,_,0,<,<,<

q3,_,1,_
q3,_,1,1,<,<,<

q3,_,0,_
q3,_,0,0,<,<,<

q4,0,0,_
q3,0,0,1,<,<,<

q4,0,1,_
q4,0,1,0,<,<,<

q4,1,0,_
q4,1,0,0,<,<,<

q4,1,1,_
q4,1,1,1,<,<,<

q4,_,0,_
q3,_,0,1,<,<,<

q4,_,1,_
q4,_,1,0,<,<,<

q4,1,_,_
q4,1,_,0,<,<,<

q4,0,_,_
q3,0,_,1,<,<,<

q4,_,_,_
q5,_,_,1,-,-,-
    `.trim();

  test("ACCEPT", () => {
    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.TRIPLE);
    const graph = graphBuilder(lines);
    const simulator = new Simulator();
    simulator.init(graph, TapeSize.TRIPLE);

    // Input: 101#110 (5 + 6)
    simulator.tapes[0].set(0, "1");
    simulator.tapes[0].set(1, "0");
    simulator.tapes[0].set(2, "1");

    simulator.tapes[0].set(3, "#");

    simulator.tapes[0].set(4, "1");
    simulator.tapes[0].set(5, "1");
    simulator.tapes[0].set(6, "0");

    let result: StepResult | null = null;
    do {
      result = simulator.step();
      if (result.rejected) {
        expect(false).toBe(true);
        break;
      }
      // should accept
      if (result.accepted) {
        break;
      }
    } while (result.continue);

    // Check the result on tape 3

    console.log(simulator.tapes[2]);

    expect(simulator.tapes[2].get(-3)).toBe("1");
    expect(simulator.tapes[2].get(-2)).toBe("0");
    expect(simulator.tapes[2].get(-1)).toBe("1");
    expect(simulator.tapes[2].get(0)).toBe("1");
  });
});

describe("Fast binary palindrome", () => {
  const input = `
name: Fast binary palindrome
init: qCopy
accept: qAccept

qCopy,0,_
qCopy,0,0,>,>

qCopy,1,_
qCopy,1,1,>,>

qCopy,_,_
qReturn,_,_,-,<

qReturn,_,0
qReturn,_,0,-,<

qReturn,_,1
qReturn,_,1,-,<

qReturn,_,_
qTest,_,_,<,>

qTest,0,0
qTest,0,0,<,>

qTest,1,1
qTest,1,1,<,>

qTest,_,_
qAccept,_,_,-,-
    `.trim();

  test("ACCEPT", () => {
    const lines = lineSplitter(input);
    syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    const graph = graphBuilder(lines);
    const simulator = new Simulator();
    simulator.init(graph, TapeSize.DOUBLE);

    // Input: 101#110 (5 + 6)
    simulator.tapes[0].set(0, "1");
    simulator.tapes[0].set(1, "0");
    simulator.tapes[0].set(2, "1");

    let result: StepResult | null = null;
    do {
      result = simulator.step();
      if (result.rejected) {
        expect(false).toBe(true);
        break;
      }
      // should accept
      if (result.accepted) {
        break;
      }
    } while (result.continue);

    // Check the result on tape 2
    console.log(simulator.tapes[1]);

    expect(simulator.tapes[1].get(0)).toBe("1");
    expect(simulator.tapes[1].get(1)).toBe("0");
    expect(simulator.tapes[1].get(2)).toBe("1");
  });
});
