import { Vec2 } from '../space/Vec2';
import { MouseButton } from './MouseButton';

export class Mouse {

  // STATIC
  private static readonly POSITION_DEFAULT:number = 0.0;

  // INSTANCE
  private readonly element:HTMLElement;
  private contextMenuEnabled:boolean;

  private readonly localPosition:Vec2;
  private readonly globalPosition:Vec2;

  private leftDown:boolean;
  private middleDown:boolean;
  private rightDown:boolean;

  // CONSTRUCTOR
  public constructor(element:HTMLElement, contextMenuEnabled:boolean) {
    if(element === undefined)
      throw new TypeError('html element for mouse is undefined');
    this.element = element;
    this.contextMenuEnabled = contextMenuEnabled;

    this.localPosition  = new Vec2(Mouse.POSITION_DEFAULT, Mouse.POSITION_DEFAULT);
    this.globalPosition = new Vec2(Mouse.POSITION_DEFAULT, Mouse.POSITION_DEFAULT);

    this.leftDown   = false;
    this.middleDown = false;
    this.leftDown   = false;

    this.addEventListeners();
  }

  // PUBLIC

  // PROTECTED

  // PRIVATE
  private addEventListeners():void {
    this.addMouseDownEvent();
    this.addMouseUpEvent();
    this.addMouseMoveEvent();
    if(this.contextMenuEnabled)
      this.addContextMenuEvent();
  }

  private addMouseDownEvent():void {
    let self:Mouse = this;

    this.element.addEventListener('mousedown', function(e:MouseEvent):void {
      self.mouseDownEvent(e);
    });
  }

  private addMouseUpEvent():void {
    let self:Mouse = this;

    this.element.addEventListener('mouseup', function(e:MouseEvent):void {
      self.mouseDownEvent(e);
    });
  }

  private addMouseMoveEvent():void {
    let self:Mouse = this;

    this.element.addEventListener('mousemove', function(e:MouseEvent):void {
      self.mouseMoveEvent(e);
    });
  }

  private addContextMenuEvent():void {
    let self:Mouse = this;

    this.element.addEventListener('contextmenu', function(e:MouseEvent):void {
      self.preventContextMenu(e);
    });
  }

  private mouseDownEvent(e:MouseEvent):void {
    switch(e.which) {
    case MouseButton.LEFT:
      this.leftDown   = true; break;
    case MouseButton.MIDDLE:
      this.middleDown = true; break;
    case MouseButton.RIGHT:
      this.rightDown  = true; break;
    }
  }

  private mouseUpEvent(e:MouseEvent):void {
    switch(e.which) {
    case MouseButton.LEFT:
      this.leftDown   = false; break;
    case MouseButton.MIDDLE:
      this.middleDown = false; break;
    case MouseButton.RIGHT:
      this.rightDown  = false; break;
    }
  }

  private mouseMoveEvent(e:MouseEvent):void {
    this.globalPosition.setX(e.clientX);
    this.globalPosition.setY(e.clientY);

    let browserDimensions:ClientRect = this.element.getBoundingClientRect();

    let localX:number = e.clientX - browserDimensions.left;
    let localY:number = e.clientY - browserDimensions.top;
    this.localPosition.setX(localX);
    this.localPosition.setY(localY);
  }

  /**
  * block the context menu from popping up on right click
  */
  private preventContextMenu(e:MouseEvent):void {
    e.preventDefault();
  }

  // SETTER

  // GETTER
  public isLeftDown():boolean {
    return this.leftDown;
  }

  public isMiddleDown():boolean {
    return this.middleDown;
  }

  public isRightdown():boolean {
    return this.rightDown;
  }

  public getLocalPosition():Vec2 {
    return this.localPosition;
  }

  public getGlobalPosition():Vec2 {
    return this.globalPosition;
  }
}
