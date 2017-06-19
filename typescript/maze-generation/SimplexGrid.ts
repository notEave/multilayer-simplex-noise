import { MultiSimplex } from '../noise/MultiSimplex';
import { AttractionGrid } from './AttractionGrid';

export class SimplexGrid extends AttractionGrid {
  private readonly simplex:MultiSimplex;

  public constructor(x:number, y:number, simplex:MultiSimplex) {
    super(x, y);
    this.simplex = simplex;
    const NOISE:number[][] = this.simplex.normalNoise2D(x, y);

    let _x:number;
    let _y:number;
    for(_y = 0; _y < super.getHeight(); _y++) {
    for(_x = 0; _x < super.getWidth() ; _x++) {
      let curr:number = NOISE[_x][_y];
      super.getCell(_x, _y).setAttraction(curr);

      //if(curr > 4/5) {
      // super.getCell(_x, _y).setAttraction(1.0);
      //} else if(curr > 3/5) {
      // super.getCell(_x, _y).setAttraction(3/4);
      //} else if(curr > 2/5) {
      // super.getCell(_x, _y).setAttraction(2/4);
      //} else if(curr > 1/5) {
      // super.getCell(_x, _y).setAttraction(1/4);
      //}
    }}
  }
}
