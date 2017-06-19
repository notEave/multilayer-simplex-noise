import { SimplexVisualization } from './applications/SimplexVisualization';

class Main {
  public static main():void {
    new SimplexVisualization(document.getElementsByTagName('canvas')[0]);
  }
}

Main.main();

/*
import { GridWrapper } from './maze-generation/GridWrapper';
import { SimplexGrid } from './maze-generation/SimplexGrid';
import { GridPopulation } from './maze-generation/GridPopulation';

import { CanvasWrapper } from './browser/CanvasWrapper';
import { Cell } from './maze-generation/Cell';

import { SimplexWrapper } from './noise/SimplexWrapper';
import { MultiSimplex } from './noise/MultiSimplex';
import { HSL } from './color/HSL';
import { RGB } from './color/RGB';
import { Colors } from './color/Colors';

import { ImageDataWrapper } from './browser/ImageDataWrapper';
import { MathC } from './util/MathC';

import { Vec2 } from './space/Vec2';
import { Point2 } from './space/Point2';
import { Random } from './util/Random';

const SIZE:Point2  = new Point2(100, 100);
const C = new CanvasWrapper(document.getElementsByTagName('canvas')[0]).setSize(SIZE);

const ib = new ImageDataWrapper(C.context().getImageData(0, 0, SIZE.getX(), SIZE.getY()));
const MSMP = new MultiSimplex();

for(let i:number = 1; i <= 3; i++) {
  MSMP.addLayer(new Vec2(Random.nextDouble(1000), Random.nextDouble(1000)), 1 / i, Math.pow(5, i / 2));
}

C.context().imageSmoothingEnabled = false;
let attrgrid:SimplexGrid = new SimplexGrid(SIZE.getX(), SIZE.getY(), MSMP);
let gw:GridWrapper = new GridWrapper(attrgrid);
let gp:GridPopulation = new GridPopulation(gw);
gp.startFrom(Random.nextInt(SIZE.getX()), Random.nextInt(SIZE.getY()));

let iter:number = 0;
for(let y:number = 0; y < SIZE.getY(); y++) {
for(let x:number = 0; x < SIZE.getX(); x++) {
  let cc:number = attrgrid.getCell(x, y).getAttraction() * 255;
  let rgb = new RGB(cc, cc, cc);
  ib.writePixel(x, y, rgb);
}}

C.context().putImageData(ib.getImageData(), 0, 0);

class Main {
  public static main():void {
    requestAnimationFrame(Main.update);
  }

  public static update(time:number):void {
    let rep:number = 0;
    do {
      let Cx:Cell = gp.getFullArea().peek();
      C.context().fillStyle = new HSL(iter, 1.0, 0.5, 1.0).toString();
      C.context().fillRect(Cx.getX(), Cx.getY(), 1, 1);
      gp.iterate();
      iter += 0.05;
      rep++;
    } while(performance.now() - time < 1000 / 30 && rep < 5);
    requestAnimationFrame(Main.update);
  }
}

Main.main();
*/
