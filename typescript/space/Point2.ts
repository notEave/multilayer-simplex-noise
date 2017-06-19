import { int } from '../datastruct/Cast';

export class Point2 {
  protected x:number;
  protected y:number;

  public constructor(x:number, y:number) {
    this.x = int(x);
    this.y = int(y);
  }

  public distance(p:Point2):number {
    return Math.hypot(this.x - p.x, this.y - p.y);
  }

  public setX(x:number):void {
    this.x = int(x);
  }

  public setY(y:number):void {
    this.y = int(y);
  }

  public getX():number {
    return this.x;
  }

  public getY():number {
    return this.y;
  }
}
