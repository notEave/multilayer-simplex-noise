import { GridWrapper } from './GridWrapper';
import { Cell } from './Cell';
import { ICollection } from '../datastruct/ICollection';
import { List } from '../datastruct/List';
import { Stack } from '../datastruct/Stack';
import { int } from '../datastruct/Cast';
import { CellFilters } from './CellFilters';
import { Random } from '../util/Random';

export class GridPopulation {
  private readonly grid:GridWrapper;

  private readonly active:ICollection<Cell>;
  private readonly fullArea:ICollection<Cell>;

  public constructor(grid:GridWrapper) {
    this.grid = grid;
    this.active = new List<Cell>();
    this.fullArea = new Stack<Cell>();
  }

  public iterate():void {
    if(this.fullArea.isEmpty()) {
      throw new Error('Path start not defined');
    }

    if(this.freeNeighbors().length > 0) {
      this.moveToNeighbor();
      this.cleanActiveList();
    }
  }

  private cleanActiveList():void {
    for(let i:number = 0; i < this.active.length(); i++) {
      if(this.grid.neighborsOf(this.active.peek(i)).every(c => c.isTraversed())) {
        this.active.take(i)
        /*
        * if we delete an element we back up by one
        * since the next elements index is now the current index
        */
        i--;
      }
    }
  }

  private freeNeighbors():Cell[] {
    const NON_TRAVERSED:Cell[] = [];

    this.active.toArray().forEach((c:Cell) => {
      let free:Cell[] = this.grid.cellFilter(
        this.grid.neighborsOf(c),
        CellFilters.notTraversed
      );

      free.forEach(c => NON_TRAVERSED.push(c));
    });

    return NON_TRAVERSED;
  }

  private moveToNeighbor():void {
    const FREE_NEIGHBORS:Cell[] = this.freeNeighbors();

    const ATTRACTIONS:number[] = FREE_NEIGHBORS.map(c => c.getAttraction());

    const MAX:number = Math.max(...ATTRACTIONS);

    const MAX_ATTRACTION:Cell[] = FREE_NEIGHBORS.filter(c => c.getAttraction() === MAX);

    // INDEX <- 0 === tail-first ;; array - 1 === head-first
    const INDEX:number = 0;

    this.traverseTo(MAX_ATTRACTION[INDEX]);
  }

  private traverseTo(cell:Cell):void {
    cell.setTraversed(true);
    this.active.put(cell);
    this.fullArea.put(cell);
  }

  public startFrom(x:number, y:number):void {
    if(!this.fullArea.isEmpty()) {
      throw new Error('Area is not empty');
    }

    const S_X:number = int(x);
    const S_Y:number = int(y);

    const WIDTH:number = this.grid.getGrid().getWidth();
    const HEIGHT:number = this.grid.getGrid().getHeight();

    if(S_X < 0 || S_Y < 0 || S_X >= WIDTH || S_Y >= HEIGHT) {
      throw new Error('Tried to set start of path outside of grid bounds');
    }

    this.traverseTo(this.grid.getGrid().getCell(S_X, S_Y));
  }

  public getActive():ICollection<Cell> {
    return this.active;
  }

  public getFullArea():ICollection<Cell> {
    return this.fullArea;
  }
}
