import { Cast } from '../datastruct/Cast';
import { ubyte } from '../datastruct/Cast';
import { normal } from '../datastruct/Cast';
import { HSL } from './HSL';

export class RGB {
  private red  :number;
  private green:number;
  private blue :number;
  private alpha:number;

  public constructor(red:number, green:number, blue:number, alpha?:number) {
    this.red   = ubyte(red);
    this.green = ubyte(green);
    this.blue  = ubyte(blue);
    if(alpha === undefined) {
      this.alpha = 1.0;
    } else {
      this.alpha = alpha;
    }
  }

  public toString():string {
    return 'RGBA(' +
      (this.red  ) + ',' +
      (this.green) + ',' +
      (this.blue ) + ',' +
      (this.alpha) + ')' ;
  }
  public setRed(red:number):void {
    this.red = ubyte(red);
  }

  public setGreen(green:number):void {
    this.green = ubyte(green);
  }

  public setBlue(blue:number):void {
    this.blue = ubyte(blue);
  }

  public setAlpha(alpha:number):void {
    this.alpha = normal(alpha);
  }

  public getRed():number {
    return this.red;
  }

  public getGreen():number {
    return this.green;
  }

  public getBlue():number {
    return this.blue;
  }

  public getAlpha():number {
    return this.alpha;
  }
}
