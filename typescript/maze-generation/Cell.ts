import { int, normal } from '../datastruct/Cast';

export class Cell {

  // STATIC

  // INSTANCE
  private readonly x         :number ;
  private readonly y         :number ;
  private          attraction:number ;
  private          traversed :boolean;

  // CONSTRUCTOR
  public constructor(x:number, y:number, attraction?:number) {
    this.x = int(x);
    this.y = int(y);
    this.traversed  = false;
    this.attraction = normal(attraction || 0.0);
  }

  // PUBLIC
  public equals(c:Cell):boolean {
    return this.x          === c.x &&
           this.y          === c.y &&
           this.attraction === c.attraction;
  }

  // PROTECTED

  // PRIVATE

  // SETTER
  public setAttraction(attraction:number):void {
    this.attraction = normal(attraction);
  }

  public setTraversed(state:boolean) {
    this.traversed = state;
  }

  // GETTER
  public getX():number {
    return this.x;
  }

  public getY():number {
    return this.y;
  }

  public getAttraction():number {
    return this.attraction;
  }

  public isTraversed():boolean {
    return this.traversed;
  }

  // OVERRIDE
  public toString():string {
    return `${this.x}, ${this.y}, attraction: ${this.attraction}`;
  }
}
