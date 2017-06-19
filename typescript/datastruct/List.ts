import { ICollection } from './ICollection';
import { Collection } from './Collection';

export class List<T> extends Collection<T> {

  public constructor() {
    super();
  }

  public peek(index:number):T {
    return super.index(index);
  }

  public take(index:number):T {
    const value:T = this.peek(index);
    this.collection.splice(index, 1);
    return value;
  }

  public clone():ICollection<T> {
    const collection:ICollection<T> = new List<T>();
    super.toArray().forEach(v => collection.put(v));
    return collection;
  }
}
