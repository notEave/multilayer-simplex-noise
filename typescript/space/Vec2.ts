import { double } from '../datastruct/Cast';

export class Vec2 {
  protected x:number;
  protected y:number;

  public constructor(x:number, y:number) {
    this.x = double(x);
    this.y = double(y);
  }

  public distance(p:Vec2):number {
    return Math.hypot(this.x - p.x, this.y - p.y);
  }

  public setX(x:number):void {
    this.x = double(x);
  }

  public setY(y:number):void {
    this.y = double(y);
  }

  public getX():number {
    return this.x;
  }

  public getY():number {
    return this.y;
  }
}
