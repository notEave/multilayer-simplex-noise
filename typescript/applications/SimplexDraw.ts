import { CanvasWrapper } from '../browser/CanvasWrapper';

import { ICollection } from '../datastruct/ICollection';

import { SimplexLogic } from './SimplexLogic';
import { SimplexDrawStyle } from './SimplexDrawStyle';

import { ColorBuffer } from '../browser/ColorBuffer';

import { Point2 } from '../space/Point2';

import { AttractionGrid } from '../maze-generation/AttractionGrid';
import { Cell } from '../maze-generation/Cell';

import { RGB } from '../color/RGB';
import { HSL } from '../color/HSL';
import { Colors } from '../color/Colors';

export class SimplexDraw {
  private readonly canvWrap:CanvasWrapper;
  private          logic    :SimplexLogic;
  private          style    :SimplexDrawStyle;
  private          drawCalls:number;
  private          noiseBuffer:ColorBuffer;

  public constructor(canvas:HTMLCanvasElement) {
    this.canvWrap  = new CanvasWrapper(canvas);
    this.style     = SimplexDrawStyle.ITERATION;
    this.drawCalls = 0;
  }

  public initialize(resolution:number, logic:SimplexLogic, style:SimplexDrawStyle):void {
    this.clearCanvas  (          );
    this.setResolution(resolution);

    this.noiseBuffer = new ColorBuffer(
      this.canvWrap.context().getImageData(0, 0, resolution, resolution)
    );

    this.setLogic(logic);
    this.setStyle(style);
    this.drawCalls = 0;
  }


  public clearCanvas():void {
    const X:number = this.canvWrap.getCanvas().width;
    const Y:number = this.canvWrap.getCanvas().height;

    this.canvWrap.context().clearRect(0, 0, X, Y);
  }

  public draw():void {
    if(this.drawCalls === 0) {
      this.fillNoiseBuffer();
    }

    switch(this.style) {
    case SimplexDrawStyle.ITERATION:
      this.iterationDraw();
      break;
    case SimplexDrawStyle.NOISEMAP:
      this.noiseMapDraw();
      break;
    case SimplexDrawStyle.EDGE:
      this.edgeDraw();
      break;
    }
    this.drawCalls++;
  }

  public iterationDraw():void {
    const DRAWABLE:ICollection<Cell> = this.logic.getPopulation().getFullArea();
    const ELEMENTS:number = DRAWABLE.length();
    this.fillNoiseBuffer();
    DRAWABLE.toArray()
      .forEach((v, i) => this.noiseBuffer.writePx(
        v.getX(),
        v.getY(),
        Colors.HSLtoRGB(new HSL(i / (ELEMENTS - 1) * 270, 1.0, 0.5))
    ));
    this.drawNoiseBuffer();
  }

  public noiseMapDraw():void {
    const DRAWABLE:ICollection<Cell> = this.logic.getPopulation().getFullArea();

    this.fillNoiseBuffer();

    DRAWABLE.toArray()
      .forEach(v => this.noiseBuffer.writePx(
        v.getX(),
        v.getY(),
        Colors.HSLtoRGB(new HSL(Math.abs(v.getAttraction() * 270), 1.0, 0.5))
    ));

    this.drawNoiseBuffer();
  }

  public edgeDraw():void {
    const ACTIVE:ICollection<Cell> = this.logic.getPopulation().getActive();

    //  we need to fill the noisebuffer to clear last frames activity
    this.fillNoiseBuffer();
    ACTIVE.toArray()
      .forEach(v => this.noiseBuffer.writePx(
        v.getX(),
        v.getY(),
        Colors.HSLtoRGB(new HSL(v.getAttraction() * 270, 1.0, 0.5))
      )
    );
    this.drawNoiseBuffer();
  }

  public fillNoiseBuffer():void {
    let x:number, y:number;
    const GRID:AttractionGrid = this.logic.getGridWrapper().getGrid();
    for(y = 0; y < GRID.getHeight(); y++) {
    for(x = 0; x < GRID.getWidth();  x++) {
      const ATTRACTION:number = GRID.getCell(x, y).getAttraction() * 255;
      let   color     :RGB    = new RGB(ATTRACTION, ATTRACTION, ATTRACTION);
      this.noiseBuffer.writePx(x, y, color);
    }}
  }

  public drawNoiseBuffer():void {
    this.canvWrap.context().putImageData(this.noiseBuffer.getImageData(), 0, 0);
  }

  public setResolution(resolution:number):void {
    this.canvWrap.setSize(new Point2(resolution, resolution));
  }

  public setStyle(style:SimplexDrawStyle):void {
    this.style = style;
  }

  public setLogic(logic:SimplexLogic):void {
    this.logic = logic;
  }
}
