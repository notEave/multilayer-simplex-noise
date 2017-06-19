import { AttractionGrid }      from '../maze-generation/AttractionGrid';
import { GridWrapper }         from '../maze-generation/GridWrapper';
import { MultiSimplexWrapper } from '../noise/MultiSimplexWrapper';
import { GridPopulation }      from '../maze-generation/GridPopulation';
import { Random }              from '../util/Random';

export class SimplexLogic {
  private          complete   :boolean            ;
  private readonly gridWrapper:GridWrapper        ;
  private readonly simplex    :MultiSimplexWrapper;
  private readonly population :GridPopulation     ;

  public constructor(resolution :number,
                     compression:number,
                     noiseAmt   :number) {
    this.complete = false;

    this.gridWrapper = new GridWrapper(
      new AttractionGrid(resolution, resolution)
    );

    this.simplex = new MultiSimplexWrapper(resolution, noiseAmt, compression);

    const GRID:AttractionGrid = this.gridWrapper.getGrid();
    const ATTR:number[][] = this.simplex.normalNoise2D();

    let y:number, x:number;
    for(let y = 0; y < GRID.getHeight(); y++) {
    for(let x = 0; x < GRID.getWidth() ; x++) {
      GRID.getCell(x, y).setAttraction(ATTR[x][y]);
    }}

    this.population = new GridPopulation(this.gridWrapper);

    this.population.startFrom(
      Random.nextInt(resolution),
      Random.nextInt(resolution)
    );
  }

  public getPopulation():GridPopulation {
    return this.population;
  }

  public getGridWrapper():GridWrapper {
    return this.gridWrapper;
  }

  public update():void {
    this.population.iterate();
  }
}
