import { ICollection } from './ICollection';
import { Collection } from './Collection';

export class Stack<T> extends Collection<T> {

  public constructor() {
    super();
  }

  public peek():T {
    return super.last();
  }

  public take():T {
    const value:T = this.peek();
    this.collection.pop();
    return value;
  }

  public clone():ICollection<T> {
    const collection:ICollection<T> = new Stack<T>();
    super.toArray().forEach(v => collection.put(v));
    return collection;
  }
}
