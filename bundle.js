(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SimplexVisualization_1 = require("./applications/SimplexVisualization");
class Main {
    static main() {
        new SimplexVisualization_1.SimplexVisualization(document.getElementsByTagName('canvas')[0]);
    }
}
Main.main();

},{"./applications/SimplexVisualization":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasWrapper_1 = require("../browser/CanvasWrapper");
const ColorBuffer_1 = require("../browser/ColorBuffer");
const Point2_1 = require("../space/Point2");
const RGB_1 = require("../color/RGB");
const HSL_1 = require("../color/HSL");
const Colors_1 = require("../color/Colors");
class SimplexDraw {
    constructor(canvas) {
        this.canvWrap = new CanvasWrapper_1.CanvasWrapper(canvas);
        this.style = 0;
        this.drawCalls = 0;
    }
    initialize(resolution, logic, style) {
        this.clearCanvas();
        this.setResolution(resolution);
        this.noiseBuffer = new ColorBuffer_1.ColorBuffer(this.canvWrap.context().getImageData(0, 0, resolution, resolution));
        this.setLogic(logic);
        this.setStyle(style);
        this.drawCalls = 0;
    }
    clearCanvas() {
        const X = this.canvWrap.getCanvas().width;
        const Y = this.canvWrap.getCanvas().height;
        this.canvWrap.context().clearRect(0, 0, X, Y);
    }
    draw() {
        if (this.drawCalls === 0) {
            this.fillNoiseBuffer();
        }
        switch (this.style) {
            case 0:
                this.iterationDraw();
                break;
            case 1:
                this.noiseMapDraw();
                break;
            case 2:
                this.edgeDraw();
                break;
        }
        this.drawCalls++;
    }
    iterationDraw() {
        const DRAWABLE = this.logic.getPopulation().getFullArea();
        const ELEMENTS = DRAWABLE.length();
        this.fillNoiseBuffer();
        DRAWABLE.toArray()
            .forEach((v, i) => this.noiseBuffer.writePx(v.getX(), v.getY(), Colors_1.Colors.HSLtoRGB(new HSL_1.HSL(i / (ELEMENTS - 1) * 270, 1.0, 0.5))));
        this.drawNoiseBuffer();
    }
    noiseMapDraw() {
        const DRAWABLE = this.logic.getPopulation().getFullArea();
        this.fillNoiseBuffer();
        DRAWABLE.toArray()
            .forEach(v => this.noiseBuffer.writePx(v.getX(), v.getY(), Colors_1.Colors.HSLtoRGB(new HSL_1.HSL(Math.abs(v.getAttraction() * 270), 1.0, 0.5))));
        this.drawNoiseBuffer();
    }
    edgeDraw() {
        const ACTIVE = this.logic.getPopulation().getActive();
        this.fillNoiseBuffer();
        ACTIVE.toArray()
            .forEach(v => this.noiseBuffer.writePx(v.getX(), v.getY(), Colors_1.Colors.HSLtoRGB(new HSL_1.HSL(v.getAttraction() * 270, 1.0, 0.5))));
        this.drawNoiseBuffer();
    }
    fillNoiseBuffer() {
        let x, y;
        const GRID = this.logic.getGridWrapper().getGrid();
        for (y = 0; y < GRID.getHeight(); y++) {
            for (x = 0; x < GRID.getWidth(); x++) {
                const ATTRACTION = GRID.getCell(x, y).getAttraction() * 255;
                let color = new RGB_1.RGB(ATTRACTION, ATTRACTION, ATTRACTION);
                this.noiseBuffer.writePx(x, y, color);
            }
        }
    }
    drawNoiseBuffer() {
        this.canvWrap.context().putImageData(this.noiseBuffer.getImageData(), 0, 0);
    }
    setResolution(resolution) {
        this.canvWrap.setSize(new Point2_1.Point2(resolution, resolution));
    }
    setStyle(style) {
        this.style = style;
    }
    setLogic(logic) {
        this.logic = logic;
    }
}
exports.SimplexDraw = SimplexDraw;

},{"../browser/CanvasWrapper":6,"../browser/ColorBuffer":7,"../color/Colors":8,"../color/HSL":9,"../color/RGB":10,"../space/Point2":24}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AttractionGrid_1 = require("../maze-generation/AttractionGrid");
const GridWrapper_1 = require("../maze-generation/GridWrapper");
const MultiSimplexWrapper_1 = require("../noise/MultiSimplexWrapper");
const GridPopulation_1 = require("../maze-generation/GridPopulation");
const Random_1 = require("../util/Random");
class SimplexLogic {
    constructor(resolution, compression, noiseAmt) {
        this.complete = false;
        this.gridWrapper = new GridWrapper_1.GridWrapper(new AttractionGrid_1.AttractionGrid(resolution, resolution));
        this.simplex = new MultiSimplexWrapper_1.MultiSimplexWrapper(resolution, noiseAmt, compression);
        const GRID = this.gridWrapper.getGrid();
        const ATTR = this.simplex.normalNoise2D();
        let y, x;
        for (let y = 0; y < GRID.getHeight(); y++) {
            for (let x = 0; x < GRID.getWidth(); x++) {
                GRID.getCell(x, y).setAttraction(ATTR[x][y]);
            }
        }
        this.population = new GridPopulation_1.GridPopulation(this.gridWrapper);
        this.population.startFrom(Random_1.Random.nextInt(resolution), Random_1.Random.nextInt(resolution));
    }
    getPopulation() {
        return this.population;
    }
    getGridWrapper() {
        return this.gridWrapper;
    }
    update() {
        this.population.iterate();
    }
}
exports.SimplexLogic = SimplexLogic;

},{"../maze-generation/AttractionGrid":15,"../maze-generation/GridPopulation":18,"../maze-generation/GridWrapper":19,"../noise/MultiSimplexWrapper":21,"../util/Random":27}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SimplexVisualizationIO_1 = require("./SimplexVisualizationIO");
const SimplexLogic_1 = require("./SimplexLogic");
const SimplexDraw_1 = require("./SimplexDraw");
class SimplexVisualization {
    constructor(canvas) {
        this.drawer = new SimplexDraw_1.SimplexDraw(canvas);
        this.sio = new SimplexVisualizationIO_1.SimplexVisualizationIO(this);
    }
    start(self) {
        self.stop();
        const RESOLUTION = this.sio.getResolution();
        const COMPRESSION = this.sio.getCompression();
        const LAYER_NUM = this.sio.getNoiseLayerAmt();
        const STYLE = this.sio.getColorScheme();
        self.logic = new SimplexLogic_1.SimplexLogic(RESOLUTION, COMPRESSION, LAYER_NUM);
        self.drawer.initialize(RESOLUTION, self.logic, STYLE);
        self.cycle(self, performance.now());
    }
    update() {
        this.logic.update();
    }
    draw() {
        this.drawer.draw();
    }
    cycle(self, time) {
        do {
            self.update();
        } while (performance.now() - time < SimplexVisualization.PHYSICS_BUDGET);
        self.draw();
        self.requestID = requestAnimationFrame(function (time) {
            self.cycle(self, time);
        });
    }
    stop() {
        cancelAnimationFrame(this.requestID);
    }
}
SimplexVisualization.FRAME_BUDGET = 1000 / 30;
SimplexVisualization.RENDER_BUDGET = 1000 / 200;
SimplexVisualization.PHYSICS_BUDGET = (SimplexVisualization.FRAME_BUDGET - SimplexVisualization.RENDER_BUDGET);
exports.SimplexVisualization = SimplexVisualization;

},{"./SimplexDraw":2,"./SimplexLogic":3,"./SimplexVisualizationIO":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SimplexVisualizationIO {
    constructor(simplexVisualization) {
        this.start = $('start');
        this.seed = $('seed');
        this.resolution = $('resolution');
        this.compression = $('compression-level');
        this.noiseLayerAmt = $('noise-layer-amount');
        this.colorScheme = $('color-scheme');
        this.addStartEvent(simplexVisualization);
    }
    addStartEvent(simplexVisualization) {
        this.start.addEventListener('mousedown', function () {
            simplexVisualization.start(simplexVisualization);
        });
    }
    getSeed() {
        return Number.parseInt(this.seed.value, 10) | 0;
    }
    getResolution() {
        return Number.parseInt(this.resolution.value, 10) | 0;
    }
    getCompression() {
        return Number.parseInt(this.compression.value, 10) | 0;
    }
    getNoiseLayerAmt() {
        return Number.parseInt(this.noiseLayerAmt.value, 10) | 0;
    }
    getColorScheme() {
        if (this.colorScheme.value === 'iteration-based') {
            return 0;
        }
        else if (this.colorScheme.value === 'noisemap-based') {
            return 1;
        }
        else {
            return 2;
        }
    }
}
exports.SimplexVisualizationIO = SimplexVisualizationIO;
function $(id) {
    return document.getElementById(id);
}

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CanvasWrapper {
    constructor(canvas) {
        this.canvas = canvas;
        const CTX = this.canvas.getContext('2d');
        if (CTX === null)
            throw new Error('Canvas rendering context passed in ' + typeof this + ' is null');
        this.context2D = CTX;
    }
    setSize(size) {
        this.canvas.width = size.getX();
        this.canvas.height = size.getY();
        return this;
    }
    context() {
        return this.context2D;
    }
    getCanvas() {
        return this.canvas;
    }
}
exports.CanvasWrapper = CanvasWrapper;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RGB_1 = require("../color/RGB");
const Cast_1 = require("../datastruct/Cast");
class ColorBuffer {
    constructor(img) {
        this.img = img;
    }
    writePx(x, y, color) {
        const OFFSET = 4 * this.img.width * y + x * 4;
        this.img.data[OFFSET] = color.getRed();
        this.img.data[OFFSET + 1] = color.getGreen();
        this.img.data[OFFSET + 2] = color.getBlue();
        this.img.data[OFFSET + 3] = Cast_1.uint(color.getAlpha() * 255);
    }
    readPx(x, y) {
        const OFFSET = 4 * this.img.width * y + 4 * x;
        const R = this.img.data[OFFSET];
        const G = this.img.data[OFFSET + 1];
        const B = this.img.data[OFFSET + 2];
        const A = this.img.data[OFFSET + 3];
        return new RGB_1.RGB(R, G, B, A);
    }
    getImageData() {
        return this.img;
    }
    getWidth() {
        return this.img.width;
    }
    getHeight() {
        return this.img.height;
    }
}
exports.ColorBuffer = ColorBuffer;

},{"../color/RGB":10,"../datastruct/Cast":11}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RGB_1 = require("./RGB");
const HSL_1 = require("./HSL");
const Cast_1 = require("../datastruct/Cast");
const Cast_2 = require("../datastruct/Cast");
class Colors {
    static RGBtoHSL(rgb) {
        const RED = rgb.getRed() / Cast_1.Cast.U_BYTE_MAX;
        const GREEN = rgb.getGreen() / Cast_1.Cast.U_BYTE_MAX;
        const BLUE = rgb.getBlue() / Cast_1.Cast.U_BYTE_MAX;
        const ALPHA = rgb.getAlpha();
        const MAX = Math.max(RED, GREEN, BLUE);
        const MIN = Math.min(RED, GREEN, BLUE);
        const LIGHTNESS = (MAX + MIN) / 2;
        let saturation;
        if (MAX === MIN) {
            saturation = 0.0;
        }
        else if (LIGHTNESS > 0.5) {
            saturation = (MAX - MIN) / (2 - MAX - MIN);
        }
        else {
            saturation = (MAX - MIN) / (MAX - MIN);
        }
        let hue;
        if (MAX === MIN) {
            hue = 0.0;
        }
        if (MAX === RED) {
            hue = (GREEN - BLUE) / (MAX - MIN);
        }
        else if (MAX === GREEN) {
            hue = 2.0 + (BLUE - RED) / (MAX - MIN);
        }
        else {
            hue = 4.0 + (RED - GREEN) / (MAX - MIN);
        }
        hue *= 60.0;
        return new HSL_1.HSL(hue, saturation, LIGHTNESS);
    }
    static HSLtoRGB(hsl) {
        const R = 0;
        const G = 1;
        const B = 2;
        const HUE = hsl.getHue();
        const SATURATION = hsl.getSaturation();
        const LUMINANCE = hsl.getLuminance();
        const ALPHA = hsl.getAlpha();
        if (SATURATION === 0.0) {
            const REDGREENBLUE = (LUMINANCE * Cast_1.Cast.U_BYTE_MAX + 0.5) | 0;
            return new RGB_1.RGB(REDGREENBLUE, REDGREENBLUE, REDGREENBLUE, ALPHA);
        }
        const ANGLE = HUE / 360.0;
        let tmp0;
        let tmp1;
        if (LUMINANCE > 0.5) {
            tmp0 = LUMINANCE + SATURATION - LUMINANCE * SATURATION;
        }
        else {
            tmp0 = LUMINANCE * (1.0 + SATURATION);
        }
        tmp1 = 2 * LUMINANCE - tmp0;
        let chn = [
            ANGLE + (1 / 3),
            ANGLE,
            ANGLE - (1 / 3)
        ].map((channel, iteration) => {
            if (channel > 1.0) {
                channel -= 1.0;
            }
            else if (channel < 0.0) {
                channel += 1.0;
            }
            if (channel * 6.0 > 1.0) {
                if (channel * 2.0 > 1.0) {
                    if (channel * 3.0 > 2.0) {
                        channel = tmp1;
                    }
                    else {
                        channel = tmp1 + (tmp0 - tmp1) * (2 / 3 - channel) * 6.0;
                    }
                }
                else {
                    channel = tmp0;
                }
            }
            else {
                channel = tmp1 + (tmp0 - tmp1) * 6.0 * channel;
            }
            return channel = Cast_2.ubyte(Math.round(channel * Cast_1.Cast.U_BYTE_MAX));
        });
        return new RGB_1.RGB(chn[R], chn[G], chn[B], ALPHA);
    }
}
exports.Colors = Colors;

},{"../datastruct/Cast":11,"./HSL":9,"./RGB":10}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cast_1 = require("../datastruct/Cast");
const Cast_2 = require("../datastruct/Cast");
class HSL {
    constructor(hue, saturation, lightness, alpha) {
        this.hue = Cast_1.double(hue) % 360.0;
        this.saturation = Cast_2.normal(saturation);
        this.luminance = Cast_2.normal(lightness);
        if (alpha === undefined) {
            this.alpha = 1.0;
        }
        else {
            this.alpha = alpha;
        }
    }
    toString() {
        return 'HSLA(' + (this.hue) + ',' +
            (this.saturation * 100) + '%,' +
            (this.luminance * 100) + '%,' +
            (this.alpha) + ')';
    }
    setHue(hue) {
        this.hue = Cast_1.double(hue);
    }
    setSaturation(saturation) {
        this.saturation = Cast_2.normal(saturation);
    }
    setLuminance(luminance) {
        this.luminance = Cast_2.normal(luminance);
    }
    setAlpha(alpha) {
        this.alpha = Cast_2.normal(alpha);
    }
    getHue() {
        return this.hue;
    }
    getSaturation() {
        return this.saturation;
    }
    getLuminance() {
        return this.luminance;
    }
    getAlpha() {
        return this.alpha;
    }
}
exports.HSL = HSL;

},{"../datastruct/Cast":11}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cast_1 = require("../datastruct/Cast");
const Cast_2 = require("../datastruct/Cast");
class RGB {
    constructor(red, green, blue, alpha) {
        this.red = Cast_1.ubyte(red);
        this.green = Cast_1.ubyte(green);
        this.blue = Cast_1.ubyte(blue);
        if (alpha === undefined) {
            this.alpha = 1.0;
        }
        else {
            this.alpha = alpha;
        }
    }
    toString() {
        return 'RGBA(' +
            (this.red) + ',' +
            (this.green) + ',' +
            (this.blue) + ',' +
            (this.alpha) + ')';
    }
    setRed(red) {
        this.red = Cast_1.ubyte(red);
    }
    setGreen(green) {
        this.green = Cast_1.ubyte(green);
    }
    setBlue(blue) {
        this.blue = Cast_1.ubyte(blue);
    }
    setAlpha(alpha) {
        this.alpha = Cast_2.normal(alpha);
    }
    getRed() {
        return this.red;
    }
    getGreen() {
        return this.green;
    }
    getBlue() {
        return this.blue;
    }
    getAlpha() {
        return this.alpha;
    }
}
exports.RGB = RGB;

},{"../datastruct/Cast":11}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cast {
    static ubyte(v) {
        return v & Cast.U_BYTE_MAX;
    }
    static ushort(v) {
        return v & Cast.U_SHORT_MAX;
    }
    static uint(v) {
        return v >>> 0;
    }
    static byte(v) {
        return Cast.ubyte(v) << 24 >> 24;
    }
    static short(v) {
        return Cast.ushort(v) << 16 >> 16;
    }
    static int(v) {
        return v | 0;
    }
    static double(v) {
        return isFinite(v) ? v : 0;
    }
    static float(v) {
        return Math.fround(Cast.double(v));
    }
    static normal(v) {
        if (Cast.double(v) > 1.0)
            return 1.0;
        if (Cast.double(v) < 0.0)
            return 0.0;
        return double(v);
    }
}
Cast.U_BYTE_MIN = 0;
Cast.U_BYTE_MAX = 255;
Cast.S_BYTE_MIN = -128;
Cast.S_BYTE_MAX = 127;
Cast.U_SHORT_MIN = 0;
Cast.U_SHORT_MAX = 65535;
Cast.S_SHORT_MIN = -32768;
Cast.S_SHORT_MAX = 32767;
Cast.U_INT_MIN = 0;
Cast.U_INT_MAX = 4294967295;
Cast.S_INT_MIN = -2147483648;
Cast.S_INT_MAX = 2147483647;
exports.Cast = Cast;
function ubyte(v) {
    return Cast.ubyte(v);
}
exports.ubyte = ubyte;
function ushort(v) {
    return Cast.ushort(v);
}
exports.ushort = ushort;
function uint(v) {
    return Cast.uint(v);
}
exports.uint = uint;
function byte(v) {
    return Cast.byte(v);
}
exports.byte = byte;
function short(v) {
    return Cast.short(v);
}
exports.short = short;
function int(v) {
    return Cast.int(v);
}
exports.int = int;
function double(v) {
    return Cast.double(v);
}
exports.double = double;
function float(v) {
    return Cast.float(v);
}
exports.float = float;
function normal(v) {
    return Cast.normal(v);
}
exports.normal = normal;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Collection {
    constructor() {
        this.collection = [];
    }
    put(value) {
        this.collection.push(value);
    }
    peek(index) {
        throw new Error('Unsupported functionality');
    }
    take(index) {
        throw new Error('Unsupported functionality');
    }
    length() {
        return this.collection.length;
    }
    clear() {
        this.collection.length = 0;
    }
    clone() {
        throw new Error('Unsupported functionality');
    }
    toArray() {
        return this.collection.slice();
    }
    putAll(arr) {
        arr.forEach(v => this.put(v));
    }
    toString() {
        let str = '[';
        this.toArray().forEach((v, i) => {
            if (i === this.length() - 1) {
                str = str.concat(v.toString());
            }
            else {
                str = str.concat(`${v.toString()}, `);
            }
        });
        str = str.concat(']');
        return str;
    }
    isEmpty() {
        return this.length() === 0;
    }
    first() {
        return this.collection[0];
    }
    last() {
        return this.collection[this.collection.length - 1];
    }
    index(index) {
        return this.collection[index];
    }
}
exports.Collection = Collection;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collection_1 = require("./Collection");
class List extends Collection_1.Collection {
    constructor() {
        super();
    }
    peek(index) {
        return super.index(index);
    }
    take(index) {
        const value = this.peek(index);
        this.collection.splice(index, 1);
        return value;
    }
    clone() {
        const collection = new List();
        super.toArray().forEach(v => collection.put(v));
        return collection;
    }
}
exports.List = List;

},{"./Collection":12}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collection_1 = require("./Collection");
class Stack extends Collection_1.Collection {
    constructor() {
        super();
    }
    peek() {
        return super.last();
    }
    take() {
        const value = this.peek();
        this.collection.pop();
        return value;
    }
    clone() {
        const collection = new Stack();
        super.toArray().forEach(v => collection.put(v));
        return collection;
    }
}
exports.Stack = Stack;

},{"./Collection":12}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cast_1 = require("../datastruct/Cast");
const Cell_1 = require("./Cell");
class AttractionGrid {
    constructor(width, height) {
        const WIDTH = Cast_1.int(width);
        const HEIGHT = Cast_1.int(height);
        const MIN_SIZE = 1;
        if (WIDTH < MIN_SIZE || HEIGHT < MIN_SIZE) {
            throw new Error('Tried to set Maze dimension to less than ' + MIN_SIZE);
        }
        this.width = WIDTH;
        this.height = HEIGHT;
        this.table = this.createTable();
    }
    containsCell(c) {
        let x, y;
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                return this.table[x][y] === c;
            }
        }
        return false;
    }
    isGridCoordinate(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return false;
        }
        return true;
    }
    sizeOf() {
        return this.width * this.height;
    }
    createTable() {
        let x, y;
        const TABLE = [];
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                if (y === 0) {
                    TABLE[x] = [];
                }
                TABLE[x][y] = new Cell_1.Cell(x, y);
            }
        }
        return TABLE;
    }
    getCell(x, y) {
        if (this.isGridCoordinate(x, y)) {
            return this.table[x][y];
        }
        else {
            throw new Error('Tried to access cell outside of grid bounds');
        }
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
}
exports.AttractionGrid = AttractionGrid;

},{"../datastruct/Cast":11,"./Cell":16}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cast_1 = require("../datastruct/Cast");
class Cell {
    constructor(x, y, attraction) {
        this.x = Cast_1.int(x);
        this.y = Cast_1.int(y);
        this.traversed = false;
        this.attraction = Cast_1.normal(attraction || 0.0);
    }
    equals(c) {
        return this.x === c.x &&
            this.y === c.y &&
            this.attraction === c.attraction;
    }
    setAttraction(attraction) {
        this.attraction = Cast_1.normal(attraction);
    }
    setTraversed(state) {
        this.traversed = state;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getAttraction() {
        return this.attraction;
    }
    isTraversed() {
        return this.traversed;
    }
    toString() {
        return `${this.x}, ${this.y}, attraction: ${this.attraction}`;
    }
}
exports.Cell = Cell;

},{"../datastruct/Cast":11}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CellFilters {
    static traversed(c) {
        return c.isTraversed();
    }
    static notTraversed(c) {
        return !c.isTraversed();
    }
    static attractLess(c, attraction) {
        return c.getAttraction() < attraction;
    }
    static attractMore(c, attraction) {
        return c.getAttraction() > attraction;
    }
    static attractExact(c, attraction) {
        return c.getAttraction() === attraction;
    }
}
exports.CellFilters = CellFilters;
function traversed(c) {
    return CellFilters.traversed(c);
}
exports.traversed = traversed;
function attractLess(c, attraction) {
    return CellFilters.attractLess(c, attraction);
}
exports.attractLess = attractLess;
function attractMore(c, attraction) {
    return CellFilters.attractMore(c, attraction);
}
exports.attractMore = attractMore;
function attractExact(c, attraction) {
    return CellFilters.attractExact(c, attraction);
}
exports.attractExact = attractExact;

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = require("../datastruct/List");
const Stack_1 = require("../datastruct/Stack");
const Cast_1 = require("../datastruct/Cast");
const CellFilters_1 = require("./CellFilters");
class GridPopulation {
    constructor(grid) {
        this.grid = grid;
        this.active = new List_1.List();
        this.fullArea = new Stack_1.Stack();
    }
    iterate() {
        if (this.fullArea.isEmpty()) {
            throw new Error('Path start not defined');
        }
        if (this.freeNeighbors().length > 0) {
            this.moveToNeighbor();
            this.cleanActiveList();
        }
    }
    cleanActiveList() {
        for (let i = 0; i < this.active.length(); i++) {
            if (this.grid.neighborsOf(this.active.peek(i)).every(c => c.isTraversed())) {
                this.active.take(i);
                i--;
            }
        }
    }
    freeNeighbors() {
        const NON_TRAVERSED = [];
        this.active.toArray().forEach((c) => {
            let free = this.grid.cellFilter(this.grid.neighborsOf(c), CellFilters_1.CellFilters.notTraversed);
            free.forEach(c => NON_TRAVERSED.push(c));
        });
        return NON_TRAVERSED;
    }
    moveToNeighbor() {
        const FREE_NEIGHBORS = this.freeNeighbors();
        const ATTRACTIONS = FREE_NEIGHBORS.map(c => c.getAttraction());
        const MAX = Math.max(...ATTRACTIONS);
        const MAX_ATTRACTION = FREE_NEIGHBORS.filter(c => c.getAttraction() === MAX);
        const INDEX = 0;
        this.traverseTo(MAX_ATTRACTION[INDEX]);
    }
    traverseTo(cell) {
        cell.setTraversed(true);
        this.active.put(cell);
        this.fullArea.put(cell);
    }
    startFrom(x, y) {
        if (!this.fullArea.isEmpty()) {
            throw new Error('Area is not empty');
        }
        const S_X = Cast_1.int(x);
        const S_Y = Cast_1.int(y);
        const WIDTH = this.grid.getGrid().getWidth();
        const HEIGHT = this.grid.getGrid().getHeight();
        if (S_X < 0 || S_Y < 0 || S_X >= WIDTH || S_Y >= HEIGHT) {
            throw new Error('Tried to set start of path outside of grid bounds');
        }
        this.traverseTo(this.grid.getGrid().getCell(S_X, S_Y));
    }
    getActive() {
        return this.active;
    }
    getFullArea() {
        return this.fullArea;
    }
}
exports.GridPopulation = GridPopulation;

},{"../datastruct/Cast":11,"../datastruct/List":13,"../datastruct/Stack":14,"./CellFilters":17}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GridWrapper {
    constructor(grid) {
        this.grid = grid;
    }
    neighborsOf(cell) {
        const NEIGHBORS = [];
        const X = cell.getX();
        const Y = cell.getY();
        if (this.getGrid().isGridCoordinate(X, Y - 1)) {
            NEIGHBORS.push(this.grid.getCell(X, Y - 1));
        }
        if (this.getGrid().isGridCoordinate(X, Y + 1)) {
            NEIGHBORS.push(this.grid.getCell(X, Y + 1));
        }
        if (this.getGrid().isGridCoordinate(X - 1, Y)) {
            NEIGHBORS.push(this.grid.getCell(X - 1, Y));
        }
        if (this.getGrid().isGridCoordinate(X + 1, Y)) {
            NEIGHBORS.push(this.grid.getCell(X + 1, Y));
        }
        return NEIGHBORS;
    }
    cellFilter(cells, filt, arg) {
        return cells.filter((c) => {
            return filt.call(undefined, c, arg || 0);
        });
    }
    getGrid() {
        return this.grid;
    }
}
exports.GridWrapper = GridWrapper;

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = require("../datastruct/List");
const Cast_1 = require("../datastruct/Cast");
const SimplexWrapper_1 = require("./SimplexWrapper");
class MultiSimplex {
    constructor() {
        this.coll = new List_1.List();
    }
    addLayer(origin, amplitude, frequency) {
        this.coll.put(new SimplexWrapper_1.SimplexWrapper(origin, amplitude, frequency));
    }
    noise2D(sx, sy) {
        if (this.coll.length() === 0) {
            throw new Error('Multisimplex is empty');
        }
        const ARR = this.coll.peek(0).positiveNoise2D(Cast_1.uint(sx), Cast_1.uint(sy));
        let noise;
        let y, x;
        for (let i = 1; i < this.coll.length(); i++) {
            noise = this.coll.peek(i).positiveNoise2D(Cast_1.uint(sx), Cast_1.uint(sy));
            for (y = 0; y < sy; y++) {
                for (x = 0; x < sx; x++) {
                    ARR[x][y] += noise[x][y];
                }
            }
        }
        return ARR;
    }
    normalNoise2D(sx, sy) {
        const ARR = this.noise2D(sx, sy);
        let x, y;
        let max = 0;
        let min = Number.MAX_SAFE_INTEGER;
        for (y = 0; y < sy; y++) {
            for (x = 0; x < sx; x++) {
                if (ARR[x][y] > max)
                    max = ARR[x][y];
                if (ARR[x][y] < min)
                    min = ARR[x][y];
            }
        }
        for (y = 0; y < sy; y++) {
            for (x = 0; x < sx; x++) {
                ARR[x][y] = (ARR[x][y] - min) / (max - min);
            }
        }
        return ARR;
    }
    noise1D(length) {
        if (this.coll.length() === 0) {
            throw new Error('Multisimplex is empty');
        }
        const ARR = this.coll.peek(0).positiveNoise1D(Cast_1.uint(length));
        for (let i = 1; i < this.coll.length(); i++) {
            this.coll.peek(i).positiveNoise1D(Cast_1.uint(length)).forEach((v, j) => {
                ARR[j] += v;
            });
        }
        return ARR;
    }
    normalNoise1D(length) {
        const ARR = this.noise1D(length);
        const MAX = Math.max(...ARR);
        const MIN = Math.min(...ARR);
        return ARR.map(v => v = (v - MIN) / (MAX - MIN));
    }
    getSimplexWrappers() {
        return this.coll.toArray();
    }
}
exports.MultiSimplex = MultiSimplex;

},{"../datastruct/Cast":11,"../datastruct/List":13,"./SimplexWrapper":23}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cast_1 = require("../datastruct/Cast");
const Vec2_1 = require("../space/Vec2");
const Random_1 = require("../util/Random");
const MathC_1 = require("../util/MathC");
const MultiSimplex_1 = require("./MultiSimplex");
class MultiSimplexWrapper {
    constructor(resolution, layers, compression) {
        this.resolution = Cast_1.int(resolution);
        this.layers = Cast_1.int(layers);
        this.compression = Cast_1.int(compression);
        this.multiSimplex = new MultiSimplex_1.MultiSimplex();
        this.createLayers();
    }
    createLayers() {
        for (let i = 1; i <= this.layers; i++) {
            this.multiSimplex.addLayer(new Vec2_1.Vec2(Random_1.Random.rangeDouble(-100, 100), Random_1.Random.rangeDouble(-100, 100)), 1 / i, Math.pow(5, i / 2));
        }
    }
    normalNoise2D() {
        return this.multiSimplex.normalNoise2D(this.resolution, this.resolution).map(v => v.map(k => MathC_1.MathC.round(k, this.compression / 10)));
    }
}
exports.MultiSimplexWrapper = MultiSimplexWrapper;

},{"../datastruct/Cast":11,"../space/Vec2":25,"../util/MathC":26,"../util/Random":27,"./MultiSimplex":20}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cast_1 = require("../datastruct/Cast");
class Simplex {
    static noise(x, y) {
        let corner = new Array(3);
        const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
        let s = (x + y) * F2;
        let i = Math.floor(x + s);
        let j = Math.floor(y + s);
        const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
        let t = (i + j) * G2;
        let X0 = i - t;
        let Y0 = j - t;
        let x0 = x - X0;
        let y0 = y - Y0;
        let i1, j1;
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        }
        else {
            i1 = 0;
            j1 = 1;
        }
        let x1 = x0 - i1 + G2;
        let y1 = y0 - j1 + G2;
        let x2 = x0 - 1.0 + 2.0 * G2;
        let y2 = y0 - 1.0 + 2.0 * G2;
        let ii = Cast_1.ubyte(i);
        let jj = Cast_1.ubyte(j);
        let gi0 = Simplex.perm[ii + Simplex.perm[jj]] % 12;
        let gi1 = Simplex.perm[ii + i1 + Simplex.perm[jj + j1]] % 12;
        let gi2 = Simplex.perm[ii + 1 + Simplex.perm[jj + 1]] % 12;
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0.0) {
            corner[0] = 0.0;
        }
        else {
            t0 = t0 * t0;
            corner[0] = t0 * t0 * Simplex.dot(Simplex.gradient3[gi0], x0, y0);
        }
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0.0) {
            corner[1] = 0.0;
        }
        else {
            t1 = t1 * t1;
            corner[1] = t1 * t1 * Simplex.dot(Simplex.gradient3[gi1], x1, y1);
        }
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0.0) {
            corner[2] = 0.0;
        }
        else {
            t2 = t2 * t2;
            corner[2] = t2 * t2 * Simplex.dot(Simplex.gradient3[gi2], x2, y2);
        }
        return 70.0 * (corner[0] + corner[1] + corner[2]);
    }
    static dot(g, x, y) {
        return g[0] * x + g[1] * y;
    }
}
Simplex.gradient3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
];
Simplex.p = [151, 160, 137, 91, 90, 15,
    131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69,
    142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75,
    0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165,
    71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60,
    211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
    65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18,
    169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186,
    3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255,
    82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
    223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101,
    155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113,
    224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238,
    210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
    49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50,
    45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72,
    243, 141, 128, 195, 78, 66, 215, 61, 156, 180
];
Simplex.perm = Simplex.p.concat(Simplex.p);
exports.Simplex = Simplex;

},{"../datastruct/Cast":11}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Simplex_1 = require("./Simplex");
const Cast_1 = require("../datastruct/Cast");
class SimplexWrapper {
    constructor(origin, amplitude, frequency) {
        this.origin = origin;
        this.amplitude = Cast_1.double(amplitude);
        this.frequency = Cast_1.double(frequency);
    }
    noise2D(sx, sy) {
        const STEP_X = this.frequency / sx;
        const STEP_Y = this.frequency / sy;
        const START_X = this.origin.getX() - STEP_X * sx / 2;
        const START_Y = this.origin.getY() - STEP_Y * sy / 2;
        return (new Array(Cast_1.uint(sx)).fill([])
            .map((v, x) => {
            return new Array(Cast_1.uint(sy)).fill(0).map((n, y) => {
                const X = START_X + x * STEP_X;
                const Y = START_Y + y * STEP_Y;
                return Simplex_1.Simplex.noise(X, Y) * this.amplitude;
            });
        }));
    }
    positiveNoise2D(sx, sy) {
        return this.noise2D(sx, sy).map((n) => {
            return n.map((v) => {
                return this.limitRange(v);
            });
        });
    }
    noise1D(length) {
        const STEP = this.frequency / length;
        const START = this.origin.getX() - STEP * length / 2;
        return new Array(Cast_1.uint(length)).fill(0).map((v, x) => {
            const X = START + x * STEP;
            const Y = this.origin.getY();
            return Simplex_1.Simplex.noise(X, Y) * this.amplitude;
        });
    }
    positiveNoise1D(length) {
        return this.noise1D(length).map((v) => {
            return this.limitRange(v);
        });
    }
    limitRange(v) {
        return (v + this.amplitude) / 2;
    }
    setOrigin(origin) {
        this.origin = origin;
    }
    setFrequency(frequency) {
        this.frequency = Cast_1.double(frequency);
    }
    getFrequency() {
        return this.frequency;
    }
    getOrigin() {
        return this.origin;
    }
}
exports.SimplexWrapper = SimplexWrapper;

},{"../datastruct/Cast":11,"./Simplex":22}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cast_1 = require("../datastruct/Cast");
class Point2 {
    constructor(x, y) {
        this.x = Cast_1.int(x);
        this.y = Cast_1.int(y);
    }
    distance(p) {
        return Math.hypot(this.x - p.x, this.y - p.y);
    }
    setX(x) {
        this.x = Cast_1.int(x);
    }
    setY(y) {
        this.y = Cast_1.int(y);
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
}
exports.Point2 = Point2;

},{"../datastruct/Cast":11}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cast_1 = require("../datastruct/Cast");
class Vec2 {
    constructor(x, y) {
        this.x = Cast_1.double(x);
        this.y = Cast_1.double(y);
    }
    distance(p) {
        return Math.hypot(this.x - p.x, this.y - p.y);
    }
    setX(x) {
        this.x = Cast_1.double(x);
    }
    setY(y) {
        this.y = Cast_1.double(y);
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
}
exports.Vec2 = Vec2;

},{"../datastruct/Cast":11}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cast_1 = require("../datastruct/Cast");
class MathC {
    static inRange(min, max, v) {
        return v >= min && v <= max;
    }
    static average(numbers) {
        let total;
        if (numbers.length === 0)
            throw new Error("Supplied array is empty");
        total = 0;
        numbers.forEach(v => {
            total += Cast_1.double(v);
        });
        return total / numbers.length;
    }
    static round(value, precision) {
        const DEFAULT_PRECISION = 0;
        const PRECISION_MULT = 10;
        let valueMult;
        let raisedValue;
        if (precision === undefined)
            precision = DEFAULT_PRECISION;
        valueMult = Math.pow(PRECISION_MULT, precision);
        return Math.round(Cast_1.double(value) * valueMult) / valueMult;
    }
    static floor(value, precision) {
        const DEFAULT_PRECISION = 0;
        const PRECISION_MULT = 10;
        let valueMult;
        let raisedValue;
        if (precision === undefined)
            precision = DEFAULT_PRECISION;
        valueMult = Math.pow(PRECISION_MULT, Cast_1.int(precision));
        return Math.floor(Cast_1.double(value) * valueMult) / valueMult;
    }
    static ceil(value, precision) {
        const DEFAULT_PRECISION = 0;
        const PRECISION_MULT = 10;
        let valueMult;
        let raisedValue;
        if (precision === undefined)
            precision = DEFAULT_PRECISION;
        valueMult = Math.pow(PRECISION_MULT, Cast_1.int(precision));
        return Math.ceil(Cast_1.double(value) * valueMult) / valueMult;
    }
}
exports.MathC = MathC;

},{"../datastruct/Cast":11}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cast_1 = require("../datastruct/Cast");
const Time_1 = require("./Time");
class Random {
    static normal(seed) {
        const NEXT = Random.sine(seed);
        return NEXT - Math.floor(NEXT);
    }
    static nextDouble(max, seed) {
        return Math.floor(Random.normal(seed) * Cast_1.double(max));
    }
    static nextInt(max, seed) {
        return Cast_1.int(Random.nextDouble(max, seed));
    }
    static rangeDouble(min, max, seed) {
        const NORMAL = Random.normal(seed);
        const MIN = Cast_1.double(min);
        const MAX = Cast_1.double(max);
        return NORMAL * (MAX - MIN) + MIN;
    }
    static rangeInt(min, max, seed) {
        return Cast_1.int(Random.rangeDouble(min, max, seed));
    }
    static sine(seed) {
        if (seed === undefined) {
            seed = Time_1.time() + Random.increment++;
        }
        return Math.sin(Cast_1.double(seed) * Random.SINE_MULTIPLIER);
    }
}
Random.SINE_MULTIPLIER = 100000;
Random.increment = 0;
exports.Random = Random;

},{"../datastruct/Cast":11,"./Time":28}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Time {
    constructor() {
        this.start = Time.time();
        this.currentFrame = 0;
    }
    static time() {
        return window.performance.now();
    }
    static timeSinceUnixEpoch() {
        return window.performance.timing.navigationStart + Time.time();
    }
    deltaFrame() {
        return this.frameEnd - this.frameStart;
    }
    deltaPhysics() {
        return this.physicsEnd - this.physicsStart;
    }
    deltaDraw() {
        return this.drawEnd - this.drawStart;
    }
    setFrameStart() {
        this.frameStart = Time.time();
    }
    setFrameEnd() {
        this.frameEnd = Time.time();
    }
    setPhysicsStart() {
        this.physicsStart = Time.time();
    }
    setPhysicsEnd() {
        this.physicsEnd = Time.time();
    }
    setDrawStart() {
        this.drawStart = Time.time();
    }
    setDrawEnd() {
        this.drawEnd = Time.time();
    }
    getCurrentFrame() {
        return this.currentFrame;
    }
    iterateCurrentFrame() {
        this.currentFrame++;
    }
}
exports.Time = Time;
function time() {
    return Time.time();
}
exports.time = time;

},{}]},{},[1]);
