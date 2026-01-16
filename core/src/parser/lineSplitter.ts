import { LineType, type Line } from "./line";

export function lineSplitter(input: string): Line[] {
  const lines: Line[] = [];
  let lineNo = 1;
  let currentLine = "";
  let isCommentBlock = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char == "/" && i + 1 < input.length && input[i + 1] == "/") {
      isCommentBlock = true;
    } else if (char == "\n") {
      const newLine: Line = {
        lineNo: lineNo,
        rawText: currentLine,
        normalizedText: currentLine.trim(),
        lineType: classifyLine(currentLine.trim()),
      };
      if (newLine.normalizedText.length > 0) lines.push(newLine);
      lineNo++;
      currentLine = "";
      isCommentBlock = false;
    } else {
      if (!isCommentBlock) currentLine += char;
    }
  }

  if (currentLine.length > 0) {
    const newLine: Line = {
      lineNo: lineNo,
      rawText: currentLine,
      normalizedText: currentLine.trim(),
      lineType: classifyLine(currentLine.trim()),
    };
    lines.push(newLine);
  }

  return lines;
}

export function classifyLine(text: string): LineType {
  if (/s*name\s*:/.test(text)) return LineType.NAME;
  if (/s*init\s*:/.test(text)) return LineType.INIT;
  if (/s*accept\s*:/.test(text)) return LineType.ACCEPT;
  return LineType.READ_WRITE_MOVE;
}
