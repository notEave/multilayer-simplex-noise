import { int } from '../datastruct/Cast';
import { Vec2 } from '../space/Vec2';
import { Random } from '../util/Random';
import { MathC } from '../util/MathC';

import { MultiSimplex } from './MultiSimplex';




export class MultiSimplexWrapper {
  private readonly resolution:number;
  private readonly layers:number;
  private readonly compression:number;
  private readonly multiSimplex:MultiSimplex;

  public constructor(resolution:number, layers:number, compression:number) {
    this.resolution = int(resolution);
    this.layers     = int(layers);
    this.compression = int(compression);
    this.multiSimplex = new MultiSimplex();
    this.createLayers();
  }

  private createLayers():void {
    for(let i:number = 1; i <= this.layers; i++) {
      this.multiSimplex.addLayer(
        new Vec2(
          // TODO what is the max allowable range for simplex origin?
          Random.rangeDouble(-100, 100),
          Random.rangeDouble(-100, 100)
        ),
        1 / i,
        Math.pow(5, i / 2)
      );
    }
  }

  public normalNoise2D():number[][] {
    return this.multiSimplex.normalNoise2D(
      this.resolution, this.resolution
    ).map(v => v.map(k => MathC.round(k, this.compression / 10)));
  }
}
