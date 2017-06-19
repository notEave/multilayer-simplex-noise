import { ICollection } from '../datastruct/ICollection';
import { List } from '../datastruct/List';
import { uint } from '../datastruct/Cast';
import { Vec2 } from '../space/Vec2';

import { SimplexWrapper } from './SimplexWrapper';

export class MultiSimplex {
  private readonly coll:ICollection<SimplexWrapper>;

  public constructor() {
    this.coll = new List<SimplexWrapper>();
  }

  public addLayer(origin:Vec2, amplitude:number, frequency:number):void {
    this.coll.put(new SimplexWrapper(origin, amplitude, frequency));
  }

  public noise2D(sx:number, sy:number):number[][] {
    if(this.coll.length() === 0) {
      throw new Error('Multisimplex is empty');
    }

    const ARR:number[][] = this.coll.peek(0).positiveNoise2D(uint(sx), uint(sy));

    let noise:number[][];
    let y:number, x:number;
    for(let i:number = 1; i < this.coll.length(); i++) {
      noise = this.coll.peek(i).positiveNoise2D(uint(sx), uint(sy));
      for(y = 0; y < sy; y++) {
      for(x = 0; x < sx; x++) {
        ARR[x][y] += noise[x][y];
      }}
    }

    return ARR;
  }

  public normalNoise2D(sx:number, sy:number):number[][] {
    const ARR:number[][] = this.noise2D(sx, sy);
    
    let x:number, y:number;
    let max:number = 0;
    let min:number = Number.MAX_SAFE_INTEGER;
    for(y = 0; y < sy; y++) {
    for(x = 0; x < sx; x++) {
      if(ARR[x][y] > max) max = ARR[x][y];
      if(ARR[x][y] < min) min = ARR[x][y];
    }}

    for(y = 0; y < sy; y++) {
    for(x = 0; x < sx; x++) {
      ARR[x][y] = (ARR[x][y] - min) / (max - min);
    }}

    return ARR;
  }

  public noise1D(length:number):number[] {
    if(this.coll.length() === 0) {
      throw new Error('Multisimplex is empty');
    }

    const ARR:number[] = this.coll.peek(0).positiveNoise1D(uint(length));

    for(let i:number = 1; i < this.coll.length(); i++) {
      this.coll.peek(i).positiveNoise1D(uint(length)).forEach((v:number, j:number) => {
        ARR[j] += v;
      });
    }

    return ARR;
  }

  public normalNoise1D(length:number):number[] {
    const ARR:number[] = this.noise1D(length);
    const MAX:number = Math.max(...ARR);
    const MIN:number = Math.min(...ARR);

    return ARR.map(v => v = (v - MIN) / (MAX - MIN));
  }

  public getSimplexWrappers():SimplexWrapper[] {
    return this.coll.toArray();
  }
}
