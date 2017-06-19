import { ICollection } from './ICollection';
import { Collection } from './Collection';

export class Queue<T> extends Collection<T> {

  public constructor() {
    super();
  }

  public peek():T {
    return super.first();
  }

  public take():T {
    const value:T = this.peek();
    this.collection.shift();
    return value;
  }

  public clone():ICollection<T> {
    const collection:ICollection<T> = new Queue<T>();
    super.toArray().forEach(v => collection.put(v));
    return collection;
  }
}
