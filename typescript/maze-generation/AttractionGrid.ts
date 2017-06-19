import { int } from '../datastruct/Cast';
import { Cell } from './Cell';

export class AttractionGrid {

  // STATIC
  // INSTANCE
  private readonly width:number;
  private readonly height:number;
  private readonly table:Cell[][];

  // CONSTRUCTOR
  public constructor(width:number, height:number) {
    const WIDTH :number = int(width) ;
    const HEIGHT:number = int(height);

    const MIN_SIZE:number = 1;
    if(WIDTH < MIN_SIZE || HEIGHT < MIN_SIZE) {
      throw new Error('Tried to set Maze dimension to less than ' +  MIN_SIZE);
    }

    this.width  = WIDTH;
    this.height = HEIGHT;
    this.table  = this.createTable();
  }

  // PUBLIC
  // TODO Delete?
  public containsCell(c:Cell):boolean {
    let x:number, y:number;
    for(y = 0; y < this.height; y++) {
    for(x = 0; x < this.width ; x++) {
      return this.table[x][y] === c;
    }}
    return false;
  }

  public isGridCoordinate(x:number, y:number):boolean {
    if(x < 0 || y  < 0 || x >= this.width || y >= this.height) {
      return false;
    } return true ;
  }

  public sizeOf():number {
    return this.width * this.height;
  }

  // PROTECTED

  // PRIVATE
  private createTable():Cell[][] {
    let x:number, y:number;
    const TABLE:Cell[][] = [];

    for(y = 0; y < this.height; y++) {
    for(x = 0; x < this.width ; x++) {
      if(y === 0) {
        TABLE[x] = [];
      }
      TABLE[x][y] = new Cell(x, y);
    }}
    return TABLE;
  }

  // SETTER

  // GETTER
  public getCell(x:number, y:number):Cell {
    if(this.isGridCoordinate(x, y)) {
      return this.table[x][y];
    } else {
      throw new Error('Tried to access cell outside of grid bounds');
    }
  }

  public getWidth():number {
    return this.width;
  }

  public getHeight():number {
    return this.height;
  }
}
