import { double } from '../datastruct/Cast';

export class Geometry {
  static readonly TAU:number = Math.PI * 2;

  public static radians(degrees:number):number {
    const HALF_TURN:number = 180.0;

    return double(degrees) * Math.PI / HALF_TURN;
  }

  public static degrees(radians:number):number {
    const HALF_TURN:number = 180.0;

    return double(radians) * HALF_TURN / Math.PI;
  }
}
