import { Point2 } from '../space/Point2';

export class CanvasWrapper {

  // STATIC

  // INSTANCE

  private readonly canvas:HTMLCanvasElement;
  private readonly context2D:CanvasRenderingContext2D;

  // CONSTRUCTOR
  public constructor(canvas:HTMLCanvasElement) {
    this.canvas = canvas;

    const CTX:CanvasRenderingContext2D|null = this.canvas.getContext('2d');

    if(CTX === null)
      throw new Error('Canvas rendering context passed in ' + typeof this + ' is null');

    this.context2D = CTX;
  }

  // PUBLIC

  // PROTECTED

  // PRIVATE

  // SETTER
  public setSize(size:Point2):CanvasWrapper {
    this.canvas.width = size.getX();
    this.canvas.height = size.getY();
    return this;
  }

  // GETTER
  public context():CanvasRenderingContext2D {
    return this.context2D;
  }

  public getCanvas():HTMLCanvasElement {
    return this.canvas;
  }
}
