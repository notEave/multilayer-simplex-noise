import { double } from '../datastruct/Cast';
import { normal } from '../datastruct/Cast';
import { Cast } from '../datastruct/Cast';
import { RGB } from './RGB';

export class HSL {
  private hue       :number;
  private saturation:number;
  private luminance :number;
  private alpha     :number;

  public constructor(hue:number, saturation:number, lightness:number, alpha?:number) {
    this.hue        = double(hue) % 360.0;
    this.saturation = normal(saturation) ;
    this.luminance  = normal(lightness ) ;

    if(alpha === undefined) {
      this.alpha = 1.0;
    } else {
      this.alpha = alpha;
    }
  }

  public toString():string {
    return 'HSLA(' + (this.hue) + ','  +
      (this.saturation   * 100) + '%,' +
      (this.luminance    * 100) + '%,' +
      (this.alpha             ) + ')'  ;
  }

  public setHue(hue:number):void {
    this.hue = double(hue);
  }

  public setSaturation(saturation:number):void {
    this.saturation = normal(saturation);
  }

  public setLuminance(luminance:number):void {
    this.luminance = normal(luminance);
  }

  public setAlpha(alpha:number):void {
    this.alpha = normal(alpha);
  }

  public getHue():number {
    return this.hue;
  }

  public getSaturation():number {
    return this.saturation;
  }

  public getLuminance():number {
    return this.luminance;
  }

  public getAlpha():number {
    return this.alpha;
  }
}
