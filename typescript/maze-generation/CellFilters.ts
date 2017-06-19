import { Cell } from './Cell';

export class CellFilters {

  public static traversed(c:Cell):boolean {
    return c.isTraversed();
  }

  public static notTraversed(c:Cell):boolean {
    return !c.isTraversed();
  }

  public static attractLess(c:Cell, attraction:number):boolean {
    return c.getAttraction() < attraction;
  }

  public static attractMore(c:Cell, attraction:number):boolean {
    return c.getAttraction() > attraction;
  }

  public static attractExact(c:Cell, attraction:number):boolean {
    return c.getAttraction() === attraction;
  }
}


export function traversed(c:Cell):boolean {
  return CellFilters.traversed(c);
}

export function attractLess(c:Cell, attraction:number):boolean {
  return CellFilters.attractLess(c, attraction);
}

export function attractMore(c:Cell, attraction:number):boolean {
  return CellFilters.attractMore(c, attraction);
}

export function attractExact(c:Cell, attraction:number):boolean {
  return CellFilters.attractExact(c, attraction);
}
