import { double, int } from '../datastruct/Cast';
import { time } from './Time';

export class Random {
  private static readonly SINE_MULTIPLIER:number = 100000;
  private static increment:number = 0;

  /**
  * seed?:number
  * ;;
  * Random double between inclusive 0 and exlusive 1. Optional seed.
  */
  public static normal(seed?:number):number {
    const NEXT:number = Random.sine(seed);
    return NEXT - Math.floor(NEXT);
  }

  /**
  * max:number, seed?:number
  * ;;
  * Random double between inclusive 0 and exclusive max. Optional seed.
  */
  public static nextDouble(max:number, seed?:number):number {
    return Math.floor(Random.normal(seed) * double(max));
  }

  /**
  * max:number, seed?:number
  * ;;
  * Random int between inclusive 0 and exclusive max. Optional seed.
  */
  public static nextInt(max:number, seed?:number):number {
    return int(Random.nextDouble(max, seed));
  }

  /**
  * min:number, max:number, seed?:number
  * ;;
  * Random double between inclusive min, exclusive max. Optional seed.
  */
  public static rangeDouble(min:number, max:number, seed?:number):number {
    const NORMAL:number = Random.normal(seed);
    const MIN   :number = double(min);
    const MAX   :number = double(max);
    return NORMAL * (MAX - MIN) + MIN;
  }

  /**
  * min:number, max:number, seed?:number
  * ;;
  * Random int  between inclusive min, exclusive max. Optional seed.
  */
  public static rangeInt(min:number, max:number, seed?:number):number {
    return int(Random.rangeDouble(min, max, seed));
  }

  /**
  * seed?:number
  * ;;
  * Return sine point of seed * Random.SINE_MULTIPLIER.
  * Optional seed, if undefined seed is taken from current time.
  */
  private static sine(seed?:number):number {
    if(seed === undefined) {
      seed = time() + Random.increment++;
    }
    return Math.sin(double(seed) * Random.SINE_MULTIPLIER);
  }
}
