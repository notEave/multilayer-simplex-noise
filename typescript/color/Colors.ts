import { RGB } from './RGB';
import { HSL } from './HSL';
import { Cast } from '../datastruct/Cast';
import { ubyte } from '../datastruct/Cast';

export class Colors {

  public static RGBtoHSL(rgb:RGB):HSL {
    const RED  :number = rgb.getRed  () / Cast.U_BYTE_MAX;
    const GREEN:number = rgb.getGreen() / Cast.U_BYTE_MAX;
    const BLUE :number = rgb.getBlue () / Cast.U_BYTE_MAX;
    const ALPHA:number = rgb.getAlpha() ;

    const MAX:number = Math.max(RED, GREEN, BLUE);
    const MIN:number = Math.min(RED, GREEN, BLUE);

    const LIGHTNESS:number  = (MAX + MIN) / 2;

    let saturation:number;

    if(MAX === MIN) {
      saturation = 0.0;
    } else if(LIGHTNESS > 0.5) {
      saturation = (MAX - MIN) / (2 - MAX - MIN);
    } else {
      saturation = (MAX - MIN) / (MAX - MIN);
    }

    let hue:number;

    if(MAX === MIN) {
      hue = 0.0;
    } if(MAX === RED) {
      hue = (GREEN - BLUE) / (MAX - MIN);
    } else if(MAX === GREEN) {
      hue = 2.0 + (BLUE - RED) / (MAX - MIN);
    } else {
      hue = 4.0 + (RED - GREEN) / (MAX - MIN);
    }
    hue *= 60.0;

    return new HSL(hue, saturation, LIGHTNESS);
  }

  public static HSLtoRGB(hsl:HSL):RGB {
    const R:number = 0;
    const G:number = 1;
    const B:number = 2;

    const HUE       :number = hsl.getHue       ();
    const SATURATION:number = hsl.getSaturation();
    const LUMINANCE :number = hsl.getLuminance ();
    const ALPHA     :number = hsl.getAlpha     ();
    
    if(SATURATION === 0.0) {
      const REDGREENBLUE:number = (LUMINANCE * Cast.U_BYTE_MAX + 0.5) | 0;
      return new RGB(
        REDGREENBLUE,
        REDGREENBLUE,
        REDGREENBLUE,
        ALPHA
      );
    }

    const ANGLE:number = HUE / 360.0;

    let tmp0:number;
    let tmp1:number;

    if(LUMINANCE > 0.5) {
      tmp0 = LUMINANCE + SATURATION - LUMINANCE * SATURATION;
    } else {
      tmp0 = LUMINANCE * (1.0 + SATURATION);
    }

    tmp1 = 2 * LUMINANCE - tmp0;
    let chn:number[] = [
      ANGLE + (1 / 3),
      ANGLE ,
      ANGLE - (1 / 3)
    ].map((channel:number, iteration:number) => {
      if(channel > 1.0) {
        channel -= 1.0;
      } else if(channel < 0.0) {
        channel += 1.0;
      }

      if(channel * 6.0 > 1.0) {
        if(channel * 2.0 > 1.0) {
          if(channel * 3.0 > 2.0) {
            channel = tmp1;
          } else {
            channel = tmp1 + (tmp0 - tmp1) * (2 / 3 - channel) * 6.0;
          }
        } else {
          channel = tmp0;
        }
      } else {
        channel = tmp1 + (tmp0 - tmp1) * 6.0 * channel;
      }
      return channel = ubyte(Math.round(channel * Cast.U_BYTE_MAX));
    });

    return new RGB(chn[R], chn[G], chn[B], ALPHA);
  }
}
