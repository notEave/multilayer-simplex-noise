import { Simplex } from './Simplex';
import { Vec2 } from '../space/Vec2';
import { double, uint } from '../datastruct/Cast';

export class SimplexWrapper {

  private origin:Vec2;
  private amplitude:number;
  private frequency:number;

  /*
  * origin:Vec2, frequency
  * Create a wrapper class for simple handling of simplex noise,
  * Origin is the x,y point where simplex generation starts,
  * frequency is the amount between generated simplex point.
  */
  public constructor(origin:Vec2, amplitude:number, frequency:number) {
    this.origin = origin;
    this.amplitude = double(amplitude);
    this.frequency = double(frequency);
  }

  public noise2D(sx:number, sy:number):number[][] {
    const STEP_X :number = this.frequency / sx;
    const STEP_Y :number = this.frequency / sy;
    const START_X:number = this.origin.getX() - STEP_X * sx / 2;
    const START_Y:number = this.origin.getY() - STEP_Y * sy / 2;

    return (new Array<Array<number>>(uint(sx)).fill([])
      .map((v:number[], x:number) => {
        return new Array<number>(uint(sy)).fill(0).map((n:number, y:number) => {
          const X:number = START_X  + x * STEP_X;
          const Y:number = START_Y  + y * STEP_Y;
          return Simplex.noise(X, Y) * this.amplitude;
      });
    }));
  }

  public positiveNoise2D(sx:number, sy:number):number[][] {
    return this.noise2D(sx, sy).map((n:number[]) => {
      return n.map((v:number) => {
        return this.limitRange(v);
      });
    });
  }

  public noise1D(length:number):number[] {
    const STEP:number = this.frequency / length;
    const START:number = this.origin.getX() - STEP * length / 2;
    return new Array<number>(uint(length)).fill(0).map((v:number, x:number) => {
      const X:number = START + x * STEP;
      const Y:number = this.origin.getY();
      return Simplex.noise(X, Y) * this.amplitude;
    });
  }

  public positiveNoise1D(length:number):number[] {
    return this.noise1D(length).map((v:number) => {
      return this.limitRange(v);
    });
  }

  private limitRange(v:number):number {
    return (v + this.amplitude) / 2;
  }

  public setOrigin(origin:Vec2):void {
    this.origin = origin;
  }

  public setFrequency(frequency:number):void {
    this.frequency = double(frequency);
  }


  public getFrequency():number {
    return this.frequency;
  }

  public getOrigin():Vec2 {
    return this.origin;
  }
}
