import { AttractionGrid } from './AttractionGrid';
import { Cell } from './Cell';

export class GridWrapper {
  private readonly grid:AttractionGrid;

  public constructor(grid:AttractionGrid) {
    this.grid = grid;
  }

  public neighborsOf(cell:Cell):Cell[] {
    const NEIGHBORS:Cell[] = [];
    const X:number = cell.getX();
    const Y:number = cell.getY();

    if(this.getGrid().isGridCoordinate(X, Y - 1)) {
      NEIGHBORS.push(this.grid.getCell(X, Y - 1));
    }

    if(this.getGrid().isGridCoordinate(X, Y + 1)) {
      NEIGHBORS.push(this.grid.getCell(X, Y + 1));
    }

    if(this.getGrid().isGridCoordinate(X - 1, Y)) {
      NEIGHBORS.push(this.grid.getCell(X - 1, Y));
    }

    if(this.getGrid().isGridCoordinate(X  + 1, Y)) {
      NEIGHBORS.push(this.grid.getCell(X + 1, Y));
    }

    return NEIGHBORS;
  }

  public cellFilter(cells:Cell[], filt:(c:Cell, arg?:number) => boolean, arg?:number):Cell[] {
    return cells.filter((c:Cell) => {
      return filt.call(undefined, c, arg || 0);
    });
  }

  public getGrid():AttractionGrid {
    return this.grid;
  }
}
