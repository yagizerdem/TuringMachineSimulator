import { describe, expect, test } from "@jest/globals";
import { classifyLine } from "../src/parser/lineSplitter";
import { LineType } from "../src/parser/line";

describe("lineClassifier", () => {
  test("classifies lines correctly", () => {
    let input = "accept: q1 q2";
    let result = classifyLine(input);
    expect(result).toEqual(LineType.ACCEPT);

    input = "init: q1";
    result = classifyLine(input);
    expect(result).toEqual(LineType.INIT);

    input = "   init: q1    ";
    result = classifyLine(input);
    expect(result).toEqual(LineType.INIT);

    input = "name  : q1    ";
    result = classifyLine(input);
    expect(result).toEqual(LineType.NAME);
  });
});
