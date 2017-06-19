export class Option {
  private readonly text:string;
  private readonly action:() => void;
  private readonly ctx:CanvasRenderingContext2D;

  public constructor(text:string, action:() => void, ctx:CanvasRenderingContext2D) {
    this.text = text;
    this.action = action;
    this.ctx = ctx;
  }

  public trigger():void {
    this.action.call(this);
  }

  public length():number {
    return this.ctx.measureText(this.text).width;
  }

  public draw():void {
    console.log('you are here');
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(this.text, 10, 50);
  }
}
