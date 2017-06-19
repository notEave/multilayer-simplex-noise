import { double, int } from '../datastruct/Cast';

export class MathC {

  public static inRange(min:number, max:number, v:number) {
    return v >= min && v <= max;
  }

  public static average(numbers:number[]): number {
    let total:number;

    if(numbers.length === 0)
      throw new Error("Supplied array is empty");

    total = 0;

    numbers.forEach(v => {
        total += double(v);
    });

    return total / numbers.length;
  }

  /**
  * PHP style rounding function
  */
  public static round(value:number, precision?:number):number {
    const DEFAULT_PRECISION:number = 0;
    const PRECISION_MULT:number = 10;
    let valueMult:number;
    let raisedValue:number;

    if(precision === undefined)
      precision = DEFAULT_PRECISION;

    valueMult = Math.pow(PRECISION_MULT, precision);

    return Math.round(double(value) * valueMult) / valueMult;
  }

  public static floor(value:number, precision?:number):number {
    const DEFAULT_PRECISION:number = 0;
    const PRECISION_MULT:number = 10;
    let valueMult:number;
    let raisedValue:number;

    if(precision === undefined)
      precision = DEFAULT_PRECISION;

    valueMult = Math.pow(PRECISION_MULT, int(precision));

    return Math.floor(double(value) * valueMult) / valueMult;
  }

  public static ceil(value:number, precision?:number):number {
    const DEFAULT_PRECISION:number = 0;
    const PRECISION_MULT:number = 10;
    let valueMult:number;
    let raisedValue:number;

    if(precision === undefined)
      precision = DEFAULT_PRECISION;

    valueMult = Math.pow(PRECISION_MULT, int(precision));

    return Math.ceil(double(value) * valueMult) / valueMult;
  }
}
