import { describe, test } from "@jest/globals";
import { lineSplitter } from "../src/parser/lineSplitter";
import { syntaxChecker } from "../src/parser/syntaxChecker";
import { TapeSize } from "../src/enum/tapeSize";
import { SyntaxError } from "../src/error/syntaxError";
import { fail } from "assert";

describe("syntaxCheckerDoubleTape", () => {
  test("Happy Path", () => {
    try {
      const input = `
        name: Binary addition
        init: q011
        accept: q5	

        q011,0,0
        q012,0,0,>,>

        
        q011,1,0
        q012,0,0,-,<

        `.trim();

      const lines = lineSplitter(input);

      syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
        fail("Syntax error thrown unexpectedly");
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Happy Path with comments", () => {
    try {
      const input = `
        name: Binary addition
        init: q011
        // This is a comment
        accept: q5	

        q011,0,0 // This is a comment
        q012,0,0,>,>

        // This is a comment
        q011,1,0
        // This is a comment
        q012,0,0,-,<

        `.trim();

      const lines = lineSplitter(input);

      syntaxChecker(lines, () => {}, TapeSize.DOUBLE);
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
        fail("Syntax error thrown unexpectedly");
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Multi Init", () => {
    try {
      const input = `
        name: Binary addition
        init: q011
        // This is a comment
        accept: q5	
        init: q011

        // This is a comment
        q011,1,0
        // This is a comment
        q012,0,0,-,<

        `.trim();

      const lines = lineSplitter(input);

      syntaxChecker(lines, () => {}, TapeSize.DOUBLE);

      fail("Expected syntax error for multiple init states");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Multi Accept", () => {
    try {
      const input = `
        name: Binary addition
        init: q011
        // This is a comment
        accept: q5	
        accept: q5	

        // This is a comment
        q011,1,0
        // This is a comment
        q012,0,0,-,<

        `.trim();

      const lines = lineSplitter(input);

      syntaxChecker(lines, () => {}, TapeSize.DOUBLE);

      fail("Expected syntax error for multiple accept states");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Multi Name", () => {
    try {
      const input = `
        name: Binary addition
        init: q011
        // This is a comment
        accept: q5	
        name: Binary addition

        // This is a comment
        q011,1,0
        // This is a comment
        q012,0,0,-,<

        `.trim();

      const lines = lineSplitter(input);

      syntaxChecker(lines, () => {}, TapeSize.DOUBLE);

      fail("Expected syntax error for multiple name states");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Name after transition", () => {
    try {
      const input = `

        init: q011
        // This is a comment
        accept: q5	

        // This is a comment
        q011,1,0
        name: Binary addition

        // This is a comment
        q012,0,0,-,<

        `.trim();

      const lines = lineSplitter(input);

      syntaxChecker(lines, () => {}, TapeSize.DOUBLE);

      fail("Expected syntax error for name after transition");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Invalid head movement character", () => {
    try {
      const input = `
        name: Binary addition
        init: q011
        accept: q5	
        q011,1,0
        q012,0,0,-,!
        `.trim();

      const lines = lineSplitter(input);

      syntaxChecker(lines, () => {}, TapeSize.DOUBLE);

      fail("Expected syntax error for invalid head movement character");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Invalid multichar state cosume", () => {
    try {
      const input = `
        name: Binary addition
        init: q011
        accept: q5	
        q011,11,0
        q012,abda,0,-,>
        `.trim();

      const lines = lineSplitter(input);

      syntaxChecker(lines, () => {}, TapeSize.DOUBLE);

      fail("Expected syntax error for invalid multichar state consume");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });
});

describe("syntaxCheckerSingleTape", () => {
  test("Happy Path", () => {
    try {
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
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
        fail("Syntax error thrown unexpectedly");
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Happy Path with comments", () => {
    try {
      const input = `
        name: Unary increment
        init: q0
        // comment
        accept: qf

        q0,0 // comment
        q0,0,>

        // comment
        q0,_
        qf,_,-
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.SINGLE);
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
        fail("Syntax error thrown unexpectedly");
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Multiple init states", () => {
    try {
      const input = `
        name: Unary increment
        init: q0 q1
        // comment
        accept: qf

        q0,0 // comment
        q0,0,>

        // comment
        q0,_
        qf,_,-
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.SINGLE);

      fail("Expected syntax error for multiple init states");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Multi Init", () => {
    try {
      const input = `
        name: Unary increment
        init: q0
        accept: qf
        init: q1

        q0,0
        q0,0,>
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.SINGLE);

      fail("Expected syntax error for multiple init states");
    } catch (err) {
      if (!(err instanceof SyntaxError)) {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Multi Accept", () => {
    try {
      const input = `
        name: Unary increment
        init: q0
        accept: qf
        accept: qx

        q0,0
        q0,0,>
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.SINGLE);

      fail("Expected syntax error for multiple accept states");
    } catch (err) {
      if (!(err instanceof SyntaxError)) {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Multi Name", () => {
    try {
      const input = `
        name: Unary increment
        init: q0
        accept: qf
        name: Another name

        q0,0
        q0,0,>
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.SINGLE);

      fail("Expected syntax error for multiple name declarations");
    } catch (err) {
      if (!(err instanceof SyntaxError)) {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Name after transition", () => {
    try {
      const input = `
        init: q0
        accept: qf

        q0,0
        name: Unary increment

        q0,0,>
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.SINGLE);

      fail("Expected syntax error for name after transition");
    } catch (err) {
      if (!(err instanceof SyntaxError)) {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Invalid head movement character", () => {
    try {
      const input = `
        name: Unary increment
        init: q0
        accept: qf

        q0,0
        q0,0,!
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.SINGLE);

      fail("Expected syntax error for invalid head movement character");
    } catch (err) {
      if (!(err instanceof SyntaxError)) {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Invalid multichar state consume", () => {
    try {
      const input = `
        name: Unary increment
        init: q0
        accept: qf

        q0,11
        q0,a,-
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.SINGLE);

      fail("Expected syntax error for invalid multichar consume symbol");
    } catch (err) {
      if (!(err instanceof SyntaxError)) {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Missing  write/move transition", () => {
    try {
      const input = `
        name: Unary increment
        init: q0
        // comment
        accept: qf

        q0,0 // comment

        // comment
        q0,_
        qf,_,-
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.SINGLE);

      fail("Expected syntax error for missing write/move transition");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });
});

describe("syntaxCheckerTripleTape", () => {
  test("Happy Path", () => {
    try {
      const input = `
        name: Triple tape operation
        init: q0
        accept: qf

        q0,0,0,0
        q1,1,1,1,>,>,>

        q1,1,0,1
        q2,0,1,0,<,-,>
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.TRIPLE);
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
        fail("Syntax error thrown unexpectedly");
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Happy Path with comments", () => {
    try {
      const input = `
        name: Triple tape operation
        init: q0
        // This is a comment
        accept: qf

        q0,0,0,0 // This is a comment
        q1,1,1,1,>,>,>

        // This is a comment
        q1,1,0,1
        // This is a comment
        q2,0,1,0,<,-,>
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.TRIPLE);
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
        fail("Syntax error thrown unexpectedly");
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Multi Init", () => {
    try {
      const input = `
        name: Triple tape operation
        init: q0
        // This is a comment
        accept: qf
        init: q1

        // This is a comment
        q1,1,0,1
        // This is a comment
        q2,0,1,0,<,-,>
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.TRIPLE);

      fail("Expected syntax error for multiple init states");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Multi Accept", () => {
    try {
      const input = `
        name: Triple tape operation
        init: q0
        // This is a comment
        accept: qf
        accept: qx

        // This is a comment
        q1,1,0,1
        // This is a comment
        q2,0,1,0,<,-,>
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.TRIPLE);

      fail("Expected syntax error for multiple accept states");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Multi Name", () => {
    try {
      const input = `
        name: Triple tape operation
        init: q0
        // This is a comment
        accept: qf
        name: Another name

        // This is a comment
        q1,1,0,1
        // This is a comment
        q2,0,1,0,<,-,>
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.TRIPLE);

      fail("Expected syntax error for multiple name states");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Name after transition", () => {
    try {
      const input = `
        init: q0
        // This is a comment
        accept: qf

        // This is a comment
        q1,1,0,1
        name: Triple tape operation

        // This is a comment
        q2,0,1,0,<,-,>
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.TRIPLE);

      fail("Expected syntax error for name after transition");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Invalid head movement character", () => {
    try {
      const input = `
        name: Triple tape operation
        init: q0
        accept: qf

        q0,1,0,1
        q1,0,1,0,-,!,>
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.TRIPLE);

      fail("Expected syntax error for invalid head movement character");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Invalid multichar state consume", () => {
    try {
      const input = `
        name: Triple tape operation
        init: q0
        accept: qf

        q0,11,0,1
        q1,abc,1,0,-,>,
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.TRIPLE);

      fail("Expected syntax error for invalid multichar state consume");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Wrong number of tape symbols", () => {
    try {
      const input = `
        name: Triple tape operation
        init: q0
        accept: qf

        q0,0,0
        q1,1,1,1,>,>,>
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.TRIPLE);

      fail("Expected syntax error for wrong number of tape symbols");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });

  test("Wrong number of head movements", () => {
    try {
      const input = `
        name: Triple tape operation
        init: q0
        accept: qf

        q0,0,0,0
        q1,1,1,1,>,>
      `.trim();

      const lines = lineSplitter(input);
      syntaxChecker(lines, () => {}, TapeSize.TRIPLE);

      fail("Expected syntax error for wrong number of head movements");
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.error(`Syntax Error on line ${err.lineNumber}: ${err.message}`);
      } else {
        fail("Unexpected error type thrown");
      }
    }
  });
});
