import { ICollection } from './ICollection';

export abstract class Collection<T> implements ICollection<T> {
  protected readonly collection:T[];

  protected constructor() {
    this.collection = [] as T[];
  }

  public put(value:T):void {
    this.collection.push(value);
  }

  public peek(index?:number):T {
    throw new Error('Unsupported functionality');
  }

  public take(index?:number):T {
    throw new Error('Unsupported functionality');
  }

  public length():number {
    return this.collection.length;
  }

  public clear():void {
    this.collection.length = 0;
  }

  public clone():ICollection<T> {
    throw new Error('Unsupported functionality');
  }

  public toArray():T[] {
    return this.collection.slice();
  }

  public putAll(arr:T[]):void {
    arr.forEach(v => this.put(v));
  }

  public toString():string {
    let str:string = '[';

    this.toArray().forEach((v:T, i:number) => {
      if(i === this.length() - 1) {
        str = str.concat(v.toString());
      } else {
        str = str.concat(`${v.toString()}, `);
      }
    });
    str = str.concat(']');
    return str;
  }

  public isEmpty():boolean {
    return this.length() === 0;
  }

  protected first():T {
    return this.collection[0];
  }

  protected last():T {
    return this.collection[this.collection.length - 1];
  }

  protected index(index:number):T {
    return this.collection[index];
  }
}
