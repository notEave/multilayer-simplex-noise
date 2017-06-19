import { IllegalArgumentError } from '../error/IllegalArgumentError';

export class StringC {
  public static parseHex(hex:string):number {
    const PARSED_NUM:number = Number.parseInt(hex, 16);

    if(isNaN(PARSED_NUM))
      throw new IllegalArgumentError();

    return PARSED_NUM;
  }

  public static contains(s:string, regex:RegExp) {
    const NO_MATCH_INDEX:number = -1;

    return s.search(regex) !== NO_MATCH_INDEX;
  }
}
