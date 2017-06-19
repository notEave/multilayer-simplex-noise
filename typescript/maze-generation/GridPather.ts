import { ICollection } from '../datastruct/ICollection';
import { Stack } from '../datastruct/Stack';
import { int } from '../datastruct/Cast';
import { Cell } from './Cell';
import { AttractionGrid } from './AttractionGrid';
import { GridWrapper } from './GridWrapper';
import { Random } from '../util/Random';

export class GridPather {
  // STATIC

  // INSTANCE
  private readonly grid:GridWrapper;

  private readonly path:ICollection<Cell>;

  // CONSTRUCTOR
  public constructor(grid:AttractionGrid) {
    this.grid = new GridWrapper(grid);
    this.path = new Stack<Cell>();
  }

  // PUBLIC
  public iterate():void {
    if(this.path.isEmpty()) {
      throw new Error('Path start not defined');
    }

    if(this.headHasUntraversedNeighbor()) {
      this.moveToNeighbor();
      return;
    }
  }


  // PROTECTED
  // PRIVATE
  private headHasUntraversedNeighbor():boolean {
    return this.getHeadsUndiscoveredNeighbors().length !== 0;
  }

  private getHeadsUndiscoveredNeighbors():Cell[] {
    const NEIGHBORS:Cell[] = this.grid.neighborsofCell(this.path.peek());
    if(NEIGHBORS.length === 0) {
      return [];
    }

    return NEIGHBORS.filter((v:Cell) => {
      return !v.isTraversed();
    });
  }

  private moveToNeighbor():void {
    const POSSIBLE_NEIGHBORS:Cell[] = this.getHeadsUndiscoveredNeighbors();
    const ATTRACTIONS:number[] = POSSIBLE_NEIGHBORS.map((v:Cell) => {
      return v.getAttraction();
    });
    const MAX:number = Math.max(...ATTRACTIONS);

    const MAX_ATTRACTION:Cell[] = POSSIBLE_NEIGHBORS.filter((v:Cell) => {
      return v.getAttraction() === MAX;
    })

    const DIRECTION:number = Random.rangeInt(0, MAX_ATTRACTION.length);

    this.traverseTo(MAX_ATTRACTION[DIRECTION]);
  }

  private returnToLast():void {
    this.path.take();
  }

  private traverseTo(cell:Cell):void {
    this.path.put(cell);
    this.path.peek().setTraversed(true);
  }

  // SETTER
  public setPathStart(x:number, y:number):void {
    if(!this.path.isEmpty()) {
      throw new Error('Path is not empty');
    }

    const S_X:number = int(x);
    const S_Y:number = int(y);

    const WIDTH :number = this.grid.getGrid().getWidth() ;
    const HEIGHT:number = this.grid.getGrid().getHeight();

    if(S_X < 0 || S_Y < 0 || S_X >= WIDTH || S_Y >= HEIGHT) {
      throw new Error('Tried to set start of path outside of grid bounds');
    }

    this.traverseTo(this.grid.getCell(S_X, S_Y));
  }

  // GETTER
  public getPath():ICollection<Cell> {
    return this.path;
  }

  public getGridWrapper():GridWrapper {
    return this.grid;
  }
}
