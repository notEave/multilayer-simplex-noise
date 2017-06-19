import { List } from '../datastruct/List';
import { Canvas } from '../browser/Canvas';
import { Point } from '../util/Point';
import { Mouse } from '../browser/Mouse';
import { float } from '../datastruct/Cast';

import { Option } from './Option';

export class ContextMenu {
  private readonly options:List<Option>;
  private readonly canvas:Canvas;
  private readonly position:Point;
  private readonly mouse:Mouse;

  public constructor(position:Point, canvas:Canvas, mouse:Mouse) {
    this.options = new List<Option>();
    this.canvas = canvas;
    this.position = position;
    this.mouse = mouse;
  }

  public addOption(option:Option):void {
    this.options.put(option);
  }

  public length():number {
    return this.options.length();
  }

  public width():number {
    let i:number;
    let longest:number = 0;

    for(i = 0; i < this.options.length(); i++) {
      if(this.options.peek(i).length() > longest) {
        longest = this.options.peek(i).length();
      }
    }

    return longest;
  }

  public height():number {
    return 200;
  }

  private localMousePosition():Point {
    let x:number = float(this.mouse.getLocalPosition().getX() - this.position.getX());
    let y:number = float(this.mouse.getLocalPosition().getY() - this.position.getY());

    return new Point(x, y);
  }

  public mouseInsideMenu():boolean {
    let mousePosition:Point = this.localMousePosition();
    return mousePosition.getX() >= 0 &&
           mousePosition.getY() >= 0 &&
           mousePosition.getX() < this .width() &&
           mousePosition.getY() < this.height();
  }

  public draw():void {
    if(this.mouseInsideMenu()) {
      this.canvas.getContext().fillStyle = 'rgb(255,0,0)';
    } else {
      this.canvas.getContext().fillStyle = 'rgb(200,0,0)';
    }
    this.canvas.getContext().fillRect(this.position.getX(), this.position.getY(), this.width() - 1, this.height()- 1);
    this.canvas.getContext().strokeRect(this.position.getX() - 0.5, this.position.getY() - 0.5, this.width(), this.height());

    this.canvas.getContext().strokeRect(this.mouse.getLocalPosition().getX() -1.5, this.mouse.getLocalPosition().getY() -1.5, 3, 3);
    this.canvas.getContext().fillStyle = 'white';

    this.canvas.getContext().fillRect(this.mouse.getLocalPosition().getX(), this.mouse.getLocalPosition().getY(), 1, 1);
    console.log(this.options.peek(0));
    this.options.peek(0).draw();
  }
}
