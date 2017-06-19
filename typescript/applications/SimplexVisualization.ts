import { SimplexVisualizationIO } from './SimplexVisualizationIO';
import { SimplexLogic } from './SimplexLogic';
import { SimplexDraw } from './SimplexDraw';
import { SimplexDrawStyle } from './SimplexDrawStyle';

import { Cell } from '../maze-generation/Cell';

import { Point2 } from '../space/Point2';

export class SimplexVisualization {
  private static readonly   FRAME_BUDGET = 1000 /  30; // 30 fps 33.333ms
  private static readonly  RENDER_BUDGET = 1000 / 200; // 5 ms
  private static readonly PHYSICS_BUDGET = (
    SimplexVisualization.FRAME_BUDGET - SimplexVisualization.RENDER_BUDGET
  );

  private readonly sio      :SimplexVisualizationIO;
  private          logic    :SimplexLogic;
  private          drawer   :SimplexDraw;
  private          requestID:number;

  public constructor(canvas:HTMLCanvasElement) {
    this.drawer = new SimplexDraw(canvas);
    this.sio = new SimplexVisualizationIO(this);
  }

  public start(self:SimplexVisualization):void {
    self.stop();
    const RESOLUTION :number = this.sio.getResolution();
    const COMPRESSION:number = this.sio.getCompression();
    const LAYER_NUM  :number = this.sio.getNoiseLayerAmt();
    const STYLE      :SimplexDrawStyle = this.sio.getColorScheme();

    self.logic = new SimplexLogic(RESOLUTION, COMPRESSION, LAYER_NUM);
    self.drawer.initialize(RESOLUTION, self.logic, STYLE);
    self.cycle(self, performance.now());
  }

  public update():void {
    this.logic.update();
  }

  public draw():void {
    this.drawer.draw();
  }

  public cycle(self:SimplexVisualization, time:number):void {
    do {
      self.update();
    } while(performance.now() - time < SimplexVisualization.PHYSICS_BUDGET);

    self.draw();

    self.requestID = requestAnimationFrame(function(time:number):void {
      self.cycle(self, time);
    });
  }

  public stop():void {
    cancelAnimationFrame(this.requestID);
  }
}
