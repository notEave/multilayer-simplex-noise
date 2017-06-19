import { ICollection } from './ICollection';

export class Collections {

  public static reverse(coll:ICollection<Object>):void {
    let arr:Object[] = coll.toArray();
    coll.clear();
    coll.putAll(arr.reverse());
  }
}
