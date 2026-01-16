import { describe, expect, test } from "@jest/globals";
import { lineSplitter } from "../src/parser/lineSplitter";

describe("lineSplitter", () => {
  test("Fast binary palindrome", () => {
    const input = `
    // Input: a binary number n
// Ouput: accepts if n is a palindrome
// Example: accepts 10101
//
// Palindrome Algorithm
// for Turing Machine Simulator 
// turingmachinesimulator.com
//
// --------- States -----------|
// qCopy - copy to second tape |
// qReturn - return first tape |
// qTest - Test each character |
// qaccept - accepting state   |
//-----------------------------|

name: Fast binary palindrome
init: qCopy
accept: qAccept

qCopy,0,_
qCopy,_,0,>,>

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

    const result = lineSplitter(input);
    expect(result.length).toBe(21);

    expect(result[0]).toEqual({
      lineNo: 16,
      rawText: "name: Fast binary palindrome",
      normalizedText: "name: Fast binary palindrome",
    });

    expect(result[20]).toEqual({
      lineNo: 45,
      rawText: "qAccept,_,_,-,-",
      normalizedText: "qAccept,_,_,-,-",
    });
  });
});

describe("lineSplitter", () => {
  test("Logarithm of length", () => {
    const input = `
// Input: binary number n
// Ouput: floor(log(|n|))
// |n| is the length of n
// Example: 1111 returns 10

// Logarithm of Length Algorithm
// for Turing Machine Simulator 
// turingmachinesimulator.com
// by Pedro Aste - ppaste@uc.cl

name: Logarithm of length
init: q0
accept: q7

q0,0,_
q0,_,1,>,-

q0,1,_
q0,_,1,>,-

q0,0,1
q1,_,0,-,<

q1,_,_
q2,_,1,-,>

q0,1,1
q1,_,0,-,<

q0,0,0
q0,_,1,>,-

q0,1,0
q0,_,1,>,-

q0,0,1
q1,_,0,-,<

q1,_,1
q1,_,0,-,<

q1,_,0
q2,_,1,-,<

q2,_,1
q2,_,1,-,>

q2,_,0
q2,_,0,-,>

q2,_,_
q0,_,_,>,<

q0,_,0
q3,_,0,-,-

q0,_,1
q3,_,1,-,-

q3,_,0
q3,0,_,<,<

q3,_,1
q3,1,_,<,<

q3,_,_
q4,_,_,>,-

q4,0,_
q4,_,0,>,-

q4,1,_
q4,_,0,>,-

q4,0,1
q5,_,0,>,<

q5,_,_
q6,_,1,-,>

q5,0,_
q6,0,1,-,>

q5,1,_
q6,1,1,-,>

q4,1,1
q5,_,0,>,<

q4,0,0
q4,_,1,>,-

q4,1,0
q4,_,1,>,-

q5,_,1
q5,_,0,-,<

q5,_,0
q6,_,1,-,<

q6,_,1
q6,_,1,-,>

q6,_,0
q6,_,0,-,>

q5,0,1
q5,0,0,-,<

q5,0,0
q6,0,1,-,<

q6,0,1
q6,0,1,-,>

q6,0,0
q6,0,0,-,>

q5,1,1
q5,1,0,-,<

q5,1,0
q6,1,1,-,<

q6,1,1
q6,1,1,-,>

q6,1,0
q6,1,0,-,>

q6,0,_
q4,0,_,-,<

q6,1,_
q4,1,_,-,<

q4,_,1
q7,_,1,-,-

q6,_,_
q7,_,_,-,<

    `.trim();

    const result = lineSplitter(input);

    expect(result.length).toBe(89);

    expect(result[0]).toEqual({
      lineNo: 11,
      rawText: "name: Logarithm of length",
      normalizedText: "name: Logarithm of length",
    });

    expect(result[3]).toEqual({
      lineNo: 15,
      rawText: "q0,0,_",
      normalizedText: "q0,0,_",
    });

    expect(result[result.length - 1]).toEqual({
      lineNo: 142,
      rawText: "q7,_,_,-,<",
      normalizedText: "q7,_,_,-,<",
    });
  });
});
