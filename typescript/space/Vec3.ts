import { Vec2 } from './Vec2';
import { double } from '../datastruct/Cast';

export class Vec3 extends Vec2 {
  protected z:number;

  public constructor(x:number, y:number, z:number) {
    super(x, y);
    this.z = double(z);
  }

  public distance(p:Vec3):number {
    // return Math.hypot(super.x - p.x, super.y - p.y, this.z - p.z);
    throw new Error('Feature not tested');
  }

  public setZ(z:number):void {
    this.z = double(z);
  }

  public getZ():number {
    return this.z;
  }
}
