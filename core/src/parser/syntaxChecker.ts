import { Line, LineType } from "./line";
import { SyntaxError } from "../error/syntaxError";
import { TapeSize } from "../enum/tapeSize";

export function syntaxChecker(
  lines: Line[],
  onProcessLine: (lastProcessedIndex: number) => void,
  tapeSize: TapeSize,
) {
  let hasInit = false;
  let hasName = false;
  let hasAccept = false;
  let seenTransition = false;
  let expectingWrite = false;

  let readWriteMoveCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    switch (line.lineType) {
      case LineType.INIT:
        if (seenTransition) {
          throw new SyntaxError({
            message: "INIT must be defined before transitions",
            lineNumber: line.lineNo,
          });
        }
        if (hasInit) {
          throw new SyntaxError({
            message: "Multiple INIT definitions",
            lineNumber: line.lineNo,
          });
        }

        var indexOfColon = line.normalizedText.indexOf(":");
        const initStatesStr = line.normalizedText
          .substring(indexOfColon + 1)
          .split(" ")
          .filter((s) => s.trim() !== "")
          .map((s) => s.trim());

        if (initStatesStr.length !== 1) {
          throw new SyntaxError({
            message: "There must be exactly one INIT state",
            lineNumber: line.lineNo,
          });
        }

        for (const stateName of initStatesStr) {
          const response = validateStateName(stateName, line.lineNo);
          if (!response.isValid) throw response.error;
        }

        hasInit = true;
        onProcessLine(i);
        break;

      case LineType.NAME:
        if (seenTransition) {
          throw new SyntaxError({
            message: "NAME must be defined before transitions",
            lineNumber: line.lineNo,
          });
        }
        if (hasName) {
          throw new SyntaxError({
            message: "Multiple NAME definitions",
            lineNumber: line.lineNo,
          });
        }
        hasName = true;
        onProcessLine(i);
        break;

      case LineType.ACCEPT:
        if (seenTransition) {
          throw new SyntaxError({
            message: "ACCEPT must be defined before transitions",
            lineNumber: line.lineNo,
          });
        }
        if (hasAccept) {
          throw new SyntaxError({
            message: "Only one ACCEPT state is allowed",
            lineNumber: line.lineNo,
          });
        }

        var indexOfColon = line.normalizedText.indexOf(":");
        const acceptStatesStr = line.normalizedText
          .substring(indexOfColon + 1)
          .split(" ")
          .filter((s) => s.trim() !== "")
          .map((s) => s.trim());

        for (const stateName of acceptStatesStr) {
          const response = validateStateName(stateName, line.lineNo);
          if (!response.isValid) throw response.error;
        }

        hasAccept = true;
        onProcessLine(i);
        break;

      case LineType.READ_WRITE_MOVE:
        seenTransition = true;
        onProcessLine(i);

        if (readWriteMoveCounter % 2 === 0) {
          const res = validateReadLine(line, tapeSize);
          expectingWrite = true;
          if (!res.isValid) throw res.error;
        } else {
          const res = validateWriteMoveLine(line, tapeSize);
          if (!res.isValid) throw res.error;
          expectingWrite = false;
        }

        readWriteMoveCounter++;
        break;

      default:
        throw new SyntaxError({
          message: "Unknown line type",
          lineNumber: line.lineNo,
        });
    }
  }

  if (!hasInit) {
    throw new SyntaxError({
      message: "Missing INIT definition",
      lineNumber: 0,
    });
  }

  if (!hasName) {
    throw new SyntaxError({
      message: "Missing NAME definition",
      lineNumber: 0,
    });
  }

  if (!hasAccept) {
    throw new SyntaxError({
      message: "Missing ACCEPT definition",
      lineNumber: 0,
    });
  }

  if (expectingWrite) {
    throw new SyntaxError({
      message: "Unmatched READ line without WRITE/MOVE",
      lineNumber: lines[lines.length - 1].lineNo,
    });
  }
}

interface checkLineSyntaxResult {
  isValid: boolean;
  error: SyntaxError | null;
}

function validateReadLine(line: Line, tapeSize: TapeSize) {
  const result: checkLineSyntaxResult = {
    isValid: true,
    error: null,
  };
  // validate size
  const tokens = line.normalizedText
    .split(",")
    .filter((t: string) => t.trim() !== "")
    .map((t: string) => t.trim());

  if (tokens.length - 1 !== tapeSizeToNumber(tapeSize)) {
    result.isValid = false;
    result.error = new SyntaxError({
      message: `Invalid symbol count: expected ${tapeSizeToNumber(
        tapeSize,
      )} symbols for tape size ${TapeSize[tapeSize]}, but got ${
        tokens.length - 1
      }`,
      lineNumber: line.lineNo,
    });

    return result;
  }

  const [firstToken, ...restTokens] = tokens;

  // first token is the state name
  var response = validateStateName(firstToken, line.lineNo);
  if (!response.isValid) return response;

  for (const token of restTokens) {
    response = validateConsumeChar(token, line.lineNo);
    if (!response.isValid) return response;
  }

  return result;
}

function validateWriteMoveLine(line: Line, tapeSize: TapeSize) {
  const result: checkLineSyntaxResult = {
    isValid: true,
    error: null,
  };
  // validate size
  const tokens = line.normalizedText
    .split(",")
    .filter((t: string) => t.trim() !== "")
    .map((t: string) => t.trim());

  if (tokens.length - 1 !== tapeSizeToNumber(tapeSize) * 2) {
    result.isValid = false;
    result.error = new SyntaxError({
      message: `Invalid write/move pair count: expected ${
        tapeSizeToNumber(tapeSize) * 2
      } tokens (${tapeSizeToNumber(tapeSize)} write + ${tapeSizeToNumber(
        tapeSize,
      )} move) for tape size ${TapeSize[tapeSize]}, but got ${
        tokens.length - 1
      }`,
      lineNumber: line.lineNo,
    });

    return result;
  }

  const [firstToken, ...restTokens] = tokens;

  // first token is the state name
  var response = validateStateName(firstToken, line.lineNo);
  if (!response.isValid) return response;

  for (let j = 0; j < tapeSizeToNumber(tapeSize); j++) {
    response = validateConsumeChar(restTokens[j], line.lineNo);
    if (!response.isValid) return response;
  }

  for (let j = tapeSizeToNumber(tapeSize); j < restTokens.length; j++) {
    response = validateMoveDirection(restTokens[j], line.lineNo);
    if (!response.isValid) return response;
  }

  return result;
}

// auxiliary

function tapeSizeToNumber(tapeSize: TapeSize): number {
  switch (tapeSize) {
    case TapeSize.SINGLE:
      return 1;
    case TapeSize.DOUBLE:
      return 2;
    case TapeSize.TRIPLE:
      return 3;
  }
}

function validateStateName(
  str: string,
  lineNumber: number,
): checkLineSyntaxResult {
  const result: checkLineSyntaxResult = {
    isValid: true,
    error: null,
  };

  if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(str) == false) {
    result.isValid = false;
    result.error = new SyntaxError({
      message: `Invalid symbol '${str}'`,
      lineNumber: lineNumber,
    });
  }

  return result;
}

function validateConsumeChar(
  char: string,
  lineNumber: number,
): checkLineSyntaxResult {
  const result: checkLineSyntaxResult = {
    isValid: true,
    error: null,
  };

  if (/^[a-zA-Z0-9_]$/.test(char) == false) {
    result.isValid = false;
    result.error = new SyntaxError({
      message: `Invalid symbol '${char}'`,
      lineNumber: lineNumber,
    });
  }

  return result;
}

function validateMoveDirection(
  dir: string,
  lineNumber: number,
): checkLineSyntaxResult {
  const result: checkLineSyntaxResult = {
    isValid: true,
    error: null,
  };

  if (/[><-]/.test(dir) == false) {
    result.isValid = false;
    result.error = new SyntaxError({
      message: `Invalid symbol '${dir}'`,
      lineNumber: lineNumber,
    });
  }

  return result;
}
