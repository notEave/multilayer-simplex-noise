import { SimplexDrawStyle } from './SimplexDrawStyle';
import { SimplexVisualization } from './SimplexVisualization';

export class SimplexVisualizationIO {

  private readonly start        :HTMLButtonElement;
  private readonly seed         :HTMLInputElement ;
  private readonly resolution   :HTMLInputElement ;
  private readonly compression  :HTMLInputElement ;
  private readonly noiseLayerAmt:HTMLInputElement ;
  private readonly colorScheme  :HTMLSelectElement;

  public constructor(simplexVisualization:SimplexVisualization) {
    this.start         = $('start')              as HTMLButtonElement;
    this.seed          = $('seed')               as HTMLInputElement ;
    this.resolution    = $('resolution')         as HTMLInputElement ;
    this.compression   = $('compression-level')  as HTMLInputElement ;
    this.noiseLayerAmt = $('noise-layer-amount') as HTMLInputElement ;
    this.colorScheme   = $('color-scheme')       as HTMLSelectElement;
    this.addStartEvent(simplexVisualization);
  }

  private addStartEvent(simplexVisualization:SimplexVisualization):void {
    this.start.addEventListener('mousedown', function():void {
      simplexVisualization.start(simplexVisualization);
    });
  }

  public getSeed():number {
    return Number.parseInt(this.seed.value, 10) | 0;
  }

  public getResolution():number {
    return Number.parseInt(this.resolution.value, 10) | 0;
  }

  public getCompression():number {
    return Number.parseInt(this.compression.value, 10) | 0;
  }

  public getNoiseLayerAmt():number {
    return Number.parseInt(this.noiseLayerAmt.value, 10) | 0;
  }

  public getColorScheme():SimplexDrawStyle {
    if(this.colorScheme.value === 'iteration-based') {
      return SimplexDrawStyle.ITERATION;
    } else if(this.colorScheme.value === 'noisemap-based'){
      return SimplexDrawStyle.NOISEMAP;
    } else {
      return SimplexDrawStyle.EDGE;
    }
  }
}

function $(id:string):HTMLElement {
  return document.getElementById(id) as HTMLElement;
}
