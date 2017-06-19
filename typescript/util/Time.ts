export class Time {
  private readonly start:number;

  private frameStart:number;
  private frameEnd:number;

  private currentFrame:number;

  private physicsStart:number;
  private physicsEnd:number;

  private drawStart:number;
  private drawEnd:number;

  public constructor() {
    this.start = Time.time();
    this.currentFrame = 0;
  }

  public static time():number {
    return window.performance.now();
  }

  public static timeSinceUnixEpoch():number {
    return window.performance.timing.navigationStart + Time.time();
  }

  public deltaFrame():number {
    return this.frameEnd - this.frameStart;
  }

  public deltaPhysics():number {
    return this.physicsEnd - this.physicsStart;
  }

  public deltaDraw():number {
    return this.drawEnd - this.drawStart;
  }

  public setFrameStart():void {
    this.frameStart = Time.time();
  }

  public setFrameEnd():void {
    this.frameEnd = Time.time();
  }

  public setPhysicsStart():void {
    this.physicsStart = Time.time();
  }

  public setPhysicsEnd():void {
    this.physicsEnd = Time.time();
  }

  public setDrawStart():void {
    this.drawStart = Time.time();
  }

  public setDrawEnd():void {
    this.drawEnd = Time.time();
  }

  public getCurrentFrame():number {
    return this.currentFrame;
  }

  public iterateCurrentFrame():void {
    this.currentFrame++;
  }
}

export function time():number {
  return Time.time();
}
