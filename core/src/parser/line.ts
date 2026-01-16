export interface Line {
  lineNo: number;
  rawText: string;
  normalizedText: string;
  lineType: LineType;
}

export enum LineType {
  NAME,
  INIT,
  ACCEPT,
  READ_WRITE_MOVE, // use this state for boty read and write_move lines
}
