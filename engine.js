let programStart = Date.now();
let time = 0;
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(funct) {
  if ((Date.now() - programStart) - time >= 60) {
    time = Date.now() - programStart;
    funct(time);
  } else {
    setTimeout(window.requestAnimationFrame, 59 - ((Date.now() - programStart) - lastFrame), funct);
  }
};
var KEYS = {
  pressed: new Set(),
  events: {
    held: [],
    pressed: [],
    released: []
  },
  bindKeyHold: (keys, cb) => {
    if (Array.isArray(keys))
      for (let key of keys)
        KEYS.events.held.push({
          key: key,
          callback: cb
        })
    else
      KEYS.events.held.push({
        key: keys,
        callback: cb
      })
  },
  bindKeyPressed: (keys, cb) => {
    if (Array.isArray(keys))
      for (let key of keys)
        KEYS.events.pressed.push({
          key: key,
          callback: cb
        })
    else
      KEYS.events.pressed.push({
        key: keys,
        callback: cb
      })
  },
  bindKeyReleased: (keys, cb) => {
    if (Array.isArray(keys))
      for (let key of keys)
        KEYS.events.released.push({
          key: key,
          callback: cb
        })
    else
      KEYS.events.released.push({
        key: keys,
        callback: cb
      })
  },
  combination: (args) => {return { type: "combination", keys: args }}

}

const allChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
var Random = {
  random: Math.random,
  range: (min, max) => (Math.random() * (max - min) + min),
  choice: (choices) => {
    if (choices instanceof Object) choices = Object.values(choices);
    return choices[Math.floor(Math.random() * choices.length)];
  },
  choices: (choices, k) => {
    let ret = [];
    while (ret.length <= k) {
      ret.push(this.choice(choices));
    }
    return ret;
  },
  string: function(leng, chars) {
    leng = leng || 12;
    chars = chars || allChars;
    let string = '';
    for (let i = 0; i < leng; i++) {
      string += chars[Math.floor(Math.random() * (chars.length - 1))];
    }
    return string;
  },
  permutation: function(leng, amt, start = 1) {
    let rets = [];
    for (let i = 0; i < amt; i++) {
      rets.push(this.choice(Math.range(start, leng)));
    }
    return rets;
  },
  bits: function(k) {
    let bits = '';
    while (bits.length <= k) {
      bits += this.choice(['0', '1'])
    }
    return bits;
  }
}
Math.range = (start, end) =>{
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

document.addEventListener('keydown', (e) => {
  if (e.repeat) { return }
  KEYS.pressed.add(e.key);
  for (let ev of KEYS.events.pressed) {
    if (ev.key === e.key) {
      ev.callback()
    }
    //add combination support
  }
});
document.addEventListener('keyup', (e) => {
  if (e.repeat) { return }
  KEYS.pressed.delete(e.key);
  for (let ev of KEYS.events.released) {
    if (ev.key === e.key) {
      ev.callback()
    }
    //add combination support
  }
});
let FPSel = document.getElementById('FPS');
/*
Sources for Ideas:
https://stackoverflow.com/questions/26661909/setting-a-correct-angular-velocity-to-a-canvas-object
https://stackoverflow.com/questions/1616448/broad-phase-collision-detection-methods
*/
/*
Things to add:
- [ ] More Shapes and better shape/size customization.
- [ ] Rotating of Things, Text (and other classes), and Camera.
- [ ] A Game.fade(ms, color=black, targetOpacity=1), slowly fades to $color over the course of $ms milliseconds. Add after draw, as a rect over the canvas, slowly increase the opacity until it reaches $targetOpacity
- [ ] UI Engine
- [ ] Thing/Container/Text click events
- [ ] Finish Containers
- [ ] Gradients
- [ ] Isometric View
- [ ] Scenes
- [ ] Animations
- [ ] New Gamepad API
- [ ] Touch Controls and Thing/Container/Text touch and drag events.
- [ ] Auto collision handling
- [ ] Auto Gravity
- [ ] Better Image Support
- [x] A way to make Text act like a Thing (movable, center coords)
 */


const SHAPES = {

  rect: function(ctx, thing) {

    ctx.beginPath();

    ctx.rect(thing._real.left, thing._real.top, thing.width, thing.height);

  },

  circle: function(ctx, thing) {

    ctx.beginPath();

    ctx.arc(thing._real.x, thing._real.y, thing.radius, 2 * Math.PI, false);

  },

  Rect() {

    return (ctx, thing) => {

      ctx.beginPath();

      ctx.rect(thing._real.left, thing._real.top, thing.width, thing.height);

    }

  },

  Ellipse(startAngle = 0, endAngle = 2 * Math.PI) {

    return (ctx, thing) => {

      ctx.beginPath();

      ctx.ellipse(thing._real.x, thing._real.y, thing.width, thing.height, thing.rotation, startAngle, endAngle)

    }

  },

  Circle() {

    return (ctx, thing) => {

      ctx.beginPath();

      ctx.arc(thing._real.x, thing._real.y, thing.radius, 2 * Math.PI, false);

    }

  },

}

function Sprite(name, clip = {}, fillRule = "nonzero") {

  //allow cliping a shape



  let sprite = game._sprites[name];

  function draw(ctx, thing) {

    //throw new Error('Here');

    //WORKS NOW

    if (!sprite) sprite = game._sprites[name];

    if (sprite) {

      ctx.clip(fillRule);

		  ctx.drawImage(sprite.img, thing._real.left, thing._real.top, thing.width, thing.height);

		  ctx.closePath();

    } else {

      ctx.fillStyle = 'darkgrey';

      ctx.fillRect(thing._real.left, thing._real.top, thing.width, thing.height);

    }

		// bruh

  //Yes, shape-color has shape in the name. So, it has colorSheme and shapes... I feel like its decently organized for the amount and complexity of code we have.

  } // no you made something that already does this in thing.js, see what I mean

  return draw;

}

/*

ctx.save();

ctx.beginPath();

ctx.arc(50, 50, 20, 2 * Math.PI, false);

ctx.clip('nonzero');

ctx.drawImage(sprite.img, 0, 0, 40, 40);

ctx.restore();

 */

class ColorScheme {

  constructor({

    background,

    border,

    fillRule,

    fill,

    ...opts

  } = {}) {

    /*

    background: color, image, etc, default: black

  border:

        width: in px, default: 0

        style: the border's color or image, default: black

        opacity: the border's opacity, default: 1

  backgroundOpacity: the background's opacity, default: 1

    */

    fill = fill || {};

    border = border || {};

    this.fill = {

      style: background || fill.style || 'black',

      rule: fillRule || fill.rule || 'nonzero',

      //opacity: Math.max(backgroundOpacity, 0) || Math.max(fill.opacity, 0) || 1,

    }//People will have to handle opacity themselves, its so hard to add.

    this.border = {

      width: Math.max(border.width, 0) || 0,

      style: border.style || 'black',

    };//People will have to handle opacity themselves, its so hard to add.

  }

  get background() {

    return this.fill.style;

  }

  set background(val) {

    this.fill.style = val;

  }

  draw(context) {

    context.closePath();

    context.strokeStyle = this.border.style;

    context.lineWidth = this.border.width;

    if (this.border.width > 0)

      context.stroke();



    context.fillStyle = this.fill.style;

    context.fill(this.fill.rule);

    //yes, the thing runs it on its.draw after it runs the shape. Shape makes the path, ColorScheme colors it in.

    //Its currently only a very basic implementation. but its all working, and you can use game.Pattern to get an image.

    //^^^^^^^^^^^^^^^^^^^^^^^^^^^^.

    // Will you make a game with the engine for kajam?

    //Yes.

    //And I may later on port the engine over to some other languages.

    //Why, I can just use Thing, like I have been doing since I made my very first video game engine last Kajam. without even referencing any other game engine.

    //And we have containers now tooo. I needed those in the first place for cars/vehicles, and make the wheels a thing and the car's body a thing.

    // Well if you are planning on using it for kajam we need to add sprites.

    //Images already work.

    //game.Pattern('img.png', {repeat: 'repeat-x', other settings...})

    //It was image, but then I wanted it to make patterns too... so, I renamed it

    //script.js

    // Where is game.Pattern defined?

  }

}
class Camera {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 1;
        this.rotation = 0;
        this.centerOfRot = (0, 0);
        // We need to add camera rotation and zooming
        //add methods for world to screen and vice versa
    }
    rotateRad(rad) {
        this.rotation += rad;
    }
    rotateDeg(deg) {
        this.rotation += deg * Math.PI / 180;
    }
    setRotationCenter(x, y) {
        this.centerOfRot = (x, y);
    }
}
//COMPILE.PY turns the above into the contents of that file.
function isIterable(obj) {
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}
function rectCollide(t1, t2) {
  return (t1.left <= t2.right &&
    t1.right >= t2.left &&
    t1.top <= t2.bottom &&
    t1.bottom >= t2.top);
};

function lineLineCollide(x1, y1, x2, y2, x3, y3, x4, y4) {
  const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
  const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    const intersectionX = x1 + (uA * (x2 - x1));
    const intersectionY = y1 + (uA * (y2 - y1));
    return {
      collision: true,
      x: intersectionX,
      y: intersectionY
    };
  }
  return {
    collision: false
  };
}

function rectLineCollide(rect, line) {
  const left = lineLineCollide(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y, rect.x, rect.y + rect.height)
  if (left.collision)
    return {
      collision: true,
      x: left.x,
      y: left.y
    }

  const right = lineLineCollide(line.x1, line.y1, line.x2, line.y2, rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + rect.height)
  if (right.collision)
    return {
      collision: true,
      x: right.x,
      y: right.y
    }

  const top = lineLineCollide(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y, rect.x + rect.width, rect.y)
  if (top.collision)
    return {
      collision: true,
      x: top.x,
      y: top.y
    }

  const bottom = lineLineCollide(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y + rect.height, rect.x + rect.width, rect.y + rect.height)
  if (bottom.collision)
    return {
      collision: true,
      x: bottom.x,
      y: bottom.y
    }

  return {
    collision: false
  };
}
class Game {
  constructor(opts = {}) {
    this.custom = opts.custom || {}; //for people to store custom values
    this.camera = new Camera();
    this.FPS = 0;
    this.deltaTime = 0;
    this.timestamp = 0;
    this.viewmode = opts.viewmode || '2d'; //1d, 2d, isometric, 3d
    this.rendering = opts.rendering || '2d'; //if we add webgl support
    this.background = opts.background || "white";
    this.canvas = document.querySelector(opts.canvas || "canvas");
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      document.body.appendChild(this.canvas);
    }
    this.context = this.canvas.getContext(this.rendering);
    this.canvas.width = opts.width || this.canvas.style.width || document.body.offsetWidth;
    this.canvas.height = opts.height || this.canvas.style.height || document.body.offsetHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.left = -this.width / 2;
    this.right = this.width / 2;
    this.top = -this.height / 2;
    this.bottom = this.height / 2;
    this.friction = opts.friction || 1;
    this.hooks = [];
    this._sprites = {};
    this.all = {
      all:[],
      things:[],
      texts:[],
      containers:[]
    }
    this.running = false;
    const game = this;
    //MAYBE Containers were a bad idea.
    this.Container = class {
      constructor(parent, {
        x,
        y,
        width,
        height,
        overhead,
        left,
        right,
        top,
        bottom,
        background,
        shape,
        border,
        borderWidth,
        colorScheme,
        colourScheme,
        custom,
        ...opts
      } = {}) {
        if (!parent) {
          throw new Error("Parent not supplied");
        }
        this.parent = parent;
        try {parent.appendChild(this);}
        catch {}
        game.all.all.push(this);
        game.all.containers.push(this);
        //Later on, make the entire game a container, and allow nested containers. 
        //.draw on a container will draw everything it contains.
        //Make the x, y and everything relative to its container.
        //Make a screen coords to game coords function and vice versa, and make sure to calculate all the container's position and the relative pos.
        this.custom = custom || {}; //for people to store custom values
        this.background = background;
        this.overhead = overhead;
        if (typeof shape == 'string')
          shape = SHAPES[shape];
        this.shape = shape || SHAPES.rect;
        width = width || null;
        if (!width && ((left && right) || (left && x) || (right && x))) {
          width = game.numberDistance(right, left) || game.numberDistance(x, left) * 2 || game.numberDistance(right, x) * 2;
        } else if (!width) width = 20;
        height = height || null;
        if (!width && ((top && bottom) || (top && y) || (bottom && y))) {
          height = game.numberDistance(top, bottom) || game.numberDistance(y, top) * 2 || game.numberDistance(bottom, y) * 2;
        } else if (!height) height = 20;
        x = x || (left + width / 2) || (right - width / 2) || 0;
        y = y || (top + height / 2) || (bottom - height / 2) || 0;
        top = y - height / 2;
        left = x - width / 2;
        bottom = y + height / 2;
        right = x + width / 2;
        this._data = {
          width,
          height,
          x,
          y,
          top,
          left,
          bottom,
          right,
        }
        //When drawing, make sure to take the parent's posisition into account.
        this.children = [];
        this.events = [];
        background = background || 'transparent';
        this.colorScheme = colorScheme ?? colourScheme ?? new ColorScheme({background, border: {
            style: border,
            width: borderWidth
          }
        });
        this.calculatePositions();
      }
      get x() {
        return this._data.x;
      }
      set x(val) {
        this._data.x = val;
        this._data.left = val - this._data.width / 2;
        this._data.right = val + this._data.width / 2;
      }
      get y() {
        return this._data.y;
      }
      set y(val) {
        this._data.y = val;
        this._data.top = val - this._data.height / 2;
        this._data.bottom = val + this._data.height / 2;
      }
      get left() {
        return this._data.left;
      }
      set left(val) {
        this._data.left = val;
        this._data.x = val + this._data.width / 2;
        this._data.right = val + this._data.width;
      }
      get top() {
        return this._data.top;
      }
      set top(val) {
        this._data.top = val;
        this._data.y = val + this._data.height / 2;
        this._data.bottom = val + this._data.height;
      }
      get right() {
        return this._data.right;
      }
      set right(val) {
        this._data.right = val;
        this._data.x = val - this._data.width / 2;
        this._data.left = val - this._data.width;
      }
      get bottom() {
        return this._data.bottom;
      }
      set bottom(val) {
        this._data.bottom = val;
        this._data.y = val - this._data.height / 2;
        this._data.top = val - this._data.height;
      }
      get width() {
        return this._data.width;
      }
      set width(val) {
        this._data.width = val;
        this._data.left = this._data.x - val / 2;
        this._data.right = this._data.x + val / 2;
      }
      get height() {
        return this._data.height;
      }
      set height(val) {
        this._data.height = val;
        this._data.top = this._data.y - val / 2;
        this._data.bottom = this._data.y + val / 2;
      }
      newThing(opts) {
        this.appendChild(new game.Thing(opts), this);
      }
      newText(opts) {
        this.appendChild(new game.Text(opts), this);
      }
      newContainer(opts) {
        this.appendChild(new game.Container(this, opts));
      }
      appendChild(child) {
        if (!this.children.includes(child)) {
          this.children.push(child);
          child.parent = this;
        }
      }
      appendChildren(...children) {
        for (let child of children) {
          if (Array.isArray(child))
            appendChildren(...child);
          else {
            if (!this.children.includes(child)) {
              this.children.push(child);
              child.parent = this;
            }
          }
        }
      }
      removeChild(child) {
        this.children = this.children.filter(x => x !== child);
      }
      when(evt, cb) {
        if (!this.events[evt]) this.events[evt] = []
        this.events[evt].push(cb)
      }
    
      triggerEvent(name) {
        if (this.events[name])
          for (let cb of this.events[name]) cb();
      }
      calculatePositions() {
        let leftAbs = parent.absolute ? parent.absolute.left : game.camera.offsetX;
        let topAbs = parent.absolute ? parent.absolute.top : game.camera.offsetY;
        this._real = this.absolute = {
          left: this._data.left + leftAbs,
          top: this._data.top + topAbs,
          right: this._data.right + leftAbs,
          bottom: this._data.bottom + topAbs,
          x: this._data.x + leftAbs,
          y: this._data.y + topAbs,
        }
      }
      draw(elapsed) {
        this.calculatePositions();
        this.triggerEvent('draw');
        if (this.background != 'transparent') {
          game.context.fillStyle = this.background;
          SHAPES.rect(game.context, this);
          this.colorScheme.draw(game.context, this);
        }
        for (let thing of this.children) {
          thing.draw(elapsed);
        }
        this.triggerEvent('afterDraw');
        //Draw the container's children
        //Allow nested containers and use relative positioning
        //Add a attribute for the absolute position of everything Thing and Container.
        //Maybe have a position option to choose relative or absolute.
      }
    }
    this.viewport = new this.Container(this);
    this.Text = class {
        constructor({
            text,
            x,
            y,
            left,
            top,
            right,
            bottom,
            custom,
            ...opts
            } = {}, parent) {
            this.parent = parent || game.viewport;
            this.custom = custom || {}; //for people to store custom values
            this.size = opts.size || 16;
            this.text = text || 'Hello World';
            this.overhead = opts.overhead || false;
            this.color = opts.color || "black";
            this.background = opts.background || 'transparent';
            x = x || (left + this.width / 2) || (right - this.width / 2) || 0;
            y = y || (top + this.height / 2) || (bottom - this.height / 2) || 0;
            top = y - this.height / 2;
            left = x - this.width / 2;
            bottom = y + this.height / 2;
            right = x + this.width / 2;
            this._data = {
                x: x,
                y: y,
                top: top,
                left: left,
                bottom: bottom,
                right: right,
            }
            this.font = opts.font || "Arial";
            this.align = opts.align || "left";
            game.all.all.push(this);
            game.all.texts.push(this);
            this.parent.appendChild(this);
        }
        get text() {
            return this._text;
        }
        set text(text) {
            this._text = text;
            game.context.font = `${this.size}px ${this.font}`;
            this.measure = game.context.measureText(this.text);
            this.width = this.measure.width;
        }
        get size() {
            return this._size;
        }
        set size(val) {
            this._size = val;
            this.height = val;
        }
        get x() {
            return this._data.x;
        } set x(val) {
            this._data.x = val;
            this._data.left = val - this.width / 2;
            this._data.right = val + this.width / 2;
        }
        get y() {
            return this._data.y;
        } set y(val) {
            this._data.y = val;
            this._data.top = val - this.height / 2;
            this._data.bottom = val + this.height / 2;
        }
        get left() {
            return this._data.left;
        } set left(val) {
            this._data.left = val;
            this._data.x = val + this.width / 2;
            this._data.right = val + this.width;
        }
        get right() {
            return this._data.right;
        } set right(val) {
            this._data.right = val;
            this._data.x = val - this.width / 2;
            this._data.left = val - this.width;
        }
        get top() {
            return this._data.top;
        } set top(val) {
            this._data.top = val;
            this._data.y = val + this.height / 2;
            this._data.bottom = val + this.height;
        }
        get bottom() {
            return this._data.bottom;
        } set bottom(val) {
            this._data.bottom = val;
            this._data.y = val - this.height / 2;
            this._data.top = val - this.height;
        }
        draw(elapsed) {
            game.context.textAlign = this.align;
            game.context.font = `${this.size}px ${this.font}`;
            if (this.background && this.background != 'transparent') {
                game.context.fillStyle = this.background;
                game.context.fillRect(game.width/2+this.left, game.height/2+this.top, this.width, this.height);
            }
            game.context.fillStyle = this.color;
            game.context.fillText(this.text, game.width/2+this.left, game.height/2+this.top+this.size);
        }
    };
    this.Thing = class {
      constructor({
        width,
        height,
        x,
        y,
        left,
        right,
        top,
        bottom,
        shape,
        colorScheme,
        colourScheme,
        radius,
        collisions,
        overhead,
        background,
        border,
        borderWidth,
        custom,
        ...opts
      } = {}, parent) {
        //add something to auto keep a Thing within the viewport
        this.parent = parent || game.viewport;
        this.custom = custom || {}; //for people to store custom values
        this._exists = true;
        this.image = opts.image;
        this.overhead = overhead || false;
        this.name = opts.name || 'unidentified';
        if (typeof shape == 'string')
          shape = SHAPES[shape];
        this.shape = shape || SHAPES.Rect();
    
        width = width || radius * 2 || null;
        if (!width && ((left && right) || (left && x) || (right && x))) {
          width = game.numberDistance(right, left) || game.numberDistance(x, left) * 2 || game.numberDistance(right, x) * 2;
        } else if (!width) width = 20;
        height = height || radius * 2 || null;
        if (!width && ((top && bottom) || (top && y) || (bottom && y))) {
          height = game.numberDistance(top, bottom) || game.numberDistance(y, top) * 2 || game.numberDistance(bottom, y) * 2;
        } else if (!height) height = 20;
        radius = radius || (width + height) / 4 || 10;
        x = x || (left + width / 2) || (right - width / 2) || 0;
        y = y || (top + height / 2) || (bottom - height / 2) || 0;
        top = y - height / 2;
        left = x - width / 2;
        bottom = y + height / 2;
        right = x + width / 2;
        this._data = {
          width: width,
          height: height,
          radius: radius,
          x: x,
          y: y,
          top: top,
          left: left,
          bottom: bottom,
          right: right,
        }
        this.calculatePositions();
        this.id = Random.string(12) + this.name;
        if (typeof background == 'function') {
          this.colorScheme = { draw: background };
        } else {
          this.colorScheme = colorScheme ?? colourScheme ?? new ColorScheme({
            background, border: {
              style: border,
              width: borderWidth
            }
          });
        }
        //add this.colourScheme alias.
        //this.visible = false;
        this.checkCollisions = collisions ?? true;
        this.collisions = {};
        this.events = {};
        this.prevX = 0;
        this.prevY = 0;
        this.vel = {
          x: 0,
          y: 0,
          //add rotational velocity? (my old engine had it.)
        }
        this._destination = null;
        game.all.all.push(this);
        game.all.things.push(this);
        this.parent.appendChild(this);
      }
      get x() {
        return this._data.x;
      }
      set x(val) {
        this._data.x = val;
        this._data.left = val - this._data.width / 2;
        this._data.right = val + this._data.width / 2;
      }
      get y() {
        return this._data.y;
      }
      set y(val) {
        this._data.y = val;
        this._data.top = val - this._data.height / 2;
        this._data.bottom = val + this._data.height / 2;
      }
      get left() {
        return this._data.left;
      }
      set left(val) {
        this._data.left = val;
        this._data.x = val + this._data.width / 2;
        this._data.right = val + this._data.width;
      }
      get top() {
        return this._data.top;
      }
      set top(val) {
        this._data.top = val;
        this._data.y = val + this._data.height / 2;
        this._data.bottom = val + this._data.height;
      }
      get right() {
        return this._data.right;
      }
      set right(val) {
        this._data.right = val;
        this._data.x = val - this._data.width / 2;
        this._data.left = val - this._data.width;
      }
      get bottom() {
        return this._data.bottom;
      }
      set bottom(val) {
        this._data.bottom = val;
        this._data.y = val - this._data.height / 2;
        this._data.top = val - this._data.height;
      }
      get width() {
        return this._data.width;
      }
      set width(val) {
        this._data.width = val;
        this._data.left = this._data.x - val / 2;
        this._data.right = this._data.x + val / 2;
      }
      get height() {
        return this._data.height;
      }
      set height(val) {
        this._data.height = val;
        this._data.top = this._data.y - val / 2;
        this._data.bottom = this._data.y + val / 2;
      }
      get radius() {
        return this._data.radius;
      }
      set radius(val) {
        this._data.radius = val;
        this._data.width = val * 2;
        this._data.height = val * 2;
        this._data.left = this._data.x - val;
        this._data.right = this._data.x + val;
        this._data.top = this._data.y - val;
        this._data.bottom = this._data.y + val;
      }
    
    
      /*get id() {
          delete this.id;
          return 
      }*/
      delete() {
        game.all.things = game.all.things.filter(i => i !== this);
        game.all.all = game.all.all.filter(i => i !== this);
        this.parent.removeChild(this)
        this.draw = () => null;
        delete this.x, this.y, this.width, this.height, this.radius, this.left, this.right, this.top, this.bottom, this._data, this.triggerEvent;
        for (let thing of game.all.things) {
          thing._removeCollisions(this.id);
        }
        this._exists = false;
        //delete this;
        //if (inst) delete inst;
      }
    
      getCollider() {
        /*let rectCollider = {
            left: this._data.left,
            top: this._data.top,
            right: this._data.right,
            bottom: this._data.bottom,
            width: this._data.width,
            height: this._data.height,
            x: this._data.x,
            y: this._data.y,
            prevX: this.prevX,
            prevY: this.prevY
        }
    
        if (this.shape === SHAPES.circle) {
            rectCollider.width -= 0;
            rectCollider.height -= 0;
        }
    
        return rectCollider;
        //Not needed rn, but we will need it later on. Commented out to save power.
        //Lets later implement something more advanced that can detect any shape, maybe SAT or something*/
        return this;
      }
    
      collided(other, cb) {
        if (!isIterable(other)) {
          if (!this.collisions[other.id]) this.collisions[other.id] = []
          this.collisions[other.id].push(cb)
        } else {
          for (let oth of other) {
            if (!this.collisions[oth.id]) this.collisions[oth.id] = []
            this.collisions[oth.id].push(cb)
          }
        }
      }
      _removeCollisions(otherid) {
        if (this.collisions[otherid]) {
          delete this.collisions[otherid];
        }
      }
    
      when(evt, cb) {
        if (!this.events[evt]) this.events[evt] = []
        this.events[evt].push(cb)
      }
    
      triggerEvent(name) {
        if (this.events[name])
          for (let cb of this.events[name]) cb()
      }
    
      distanceTo(other) {
        return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2)
      }
      touching(other) {
        let rectCollider = other.getCollider();
        let rectCollider2 = this.getCollider();
    
        // I only added the .getCollider() method because we can only check
        // collisions between rectangles for now, we can remove it once we 
        // can check other types or collisions too.
    
        //We use 1/2 width and height a lot, maybe we should just add that as an attribute.
        //That would save us from recalculating it every time.
        let t1HalfW = this._data.width / 2;
        let t1HalfH = this._data.height / 2;
        let t2HalfW = other._data.width / 2;
        let t2HalfH = other._data.height / 2;
    
        // Only check objects that are in range
        if (
          this.distanceTo(other) < rectCollider2._data.width +
          rectCollider._data.width +
          rectCollider2._data.height +
          rectCollider._data.height &&
          rectCollide(rectCollider, rectCollider2)
        ) { //Change ._data.etc to .etc when we change getCollider() again.
    
          let diffX = game.numberDistance(this._data.x, other._data.x);
          let diffY = game.numberDistance(this._data.y, other._data.y);
          if (this._data.x < other._data.x) diffX = -diffX;
          if (this._data.y < other._data.y) diffY = -diffY;
          // Calculate the minimum distance to separate along X and Y
          let minXDist = t1HalfW + t2HalfW;
          let minYDist = t1HalfH + t2HalfH;
    
          // Calculate the depth of collision for both the X and Y axis
          let depthX = diffX > 0 ? minXDist - diffX : -minXDist - diffX;
          let depthY = diffY > 0 ? minYDist - diffY : -minYDist - diffY;
    
          // Now that you have the depth, you can pick the smaller depth and move along that axis.
          let axis, side;
          if (depthX != 0 && depthY != 0) {
            if (Math.abs(depthX) < Math.abs(depthY)) {
              axis = 'x';
              // Collision along the X axis.
              if (depthX > 0) {
                side = 'left';
                // Left side collision
              } else {
                side = 'right';
                // Right side collision
              }
            } else {
              axis = 'y';
              // Collision along the Y axis.
              if (depthY > 0) {
                side = 'top';
                // Top side collision
              } else {
                side = 'bottom';
                // Bottom side collision
              }
            }
            let event = {
              depthX,
              depthY,
              axis,
              side,
              self: this,
              other,
              timestamp: game.timestamp
            }
            return event;
          }
        }
        return false;
      }
      update() {
    
        this.prevX = this.x;
        this.prevY = this.y;
        this.move(this.vel.x * game.deltaTime, this.vel.y * game.deltaTime)
        /*
        Problems with our Collision Detection: 
            1. Its very expensive to check every object against every other object even if they are a thousand pixels away. 
            2. Fast objects are able to go through any other object without the collision being detected.
    
        Potential Solutions:
            1. A broad phase where we decide which ones to check by if their y positions overlap at all. Or some other type of broad phase.
            2. Draw a line between the current position and projected position and check if that line intersects with the object. Or some other solution
        */
        for (let other of game.all.things.filter(x => {
          // Check if the object is not itself
          return x.id !== this.id && x.checkCollisions && x._exists === true
        })) { //if this thing checks another thing, and the other thing checks against this thing, than isn't that re-calculating the same thing? Its a waste of time. So, maybe later we can come up with a better system.
          let event = this.touching(other);
          if (event && this.collisions[other.id])
            this.collisions[other.id].forEach(cb => cb(event));
        }
      }
      calculatePositions() {
        if (this.y === NaN) this.y = 0;
        if (this.x === NaN) this.x = 0;
        this._real = {
          x: this._data.x + game.width / 2 + this.parent.absolute.left,
          y: this._data.y + game.height / 2 + this.parent.absolute.top,
          left: this._data.left + game.width / 2 + this.parent.absolute.left,
          right: this._data.right + game.width / 2 + this.parent.absolute.left,
          top: this._data.top + game.height / 2 + this.parent.absolute.top,
          bottom: this._data.bottom + game.height / 2 + this.parent.absolute.top,
        }
      }
      draw() {
        this.update();
        this.calculatePositions();
        this.triggerEvent("draw");
        game.context.save();
        if (this.image) {
          game.context.drawImage(this.image, this._real.left, this._real.top, this.width, this.height);
        } else {
          this.shape(game.context, this);
          this.colorScheme.draw(game.context, this);
        }
        game.context.restore();
        this.triggerEvent("afterDraw");
        if (this._destination) {
          if ((this._destination[0] == '*' || this._destination[0] == this._data.x) && (this._destination[1] == '*' || this._destination[1] == this._data.y)) {
            this._destination = null;
            return;
          }
          let d = this._destination;
          if (d[0] != '*' && this._data.x + this.vel.x / 1000 >= d[0] && this.vel.x > 0) {
            this.vel.x = 0;
            this.x = d[0];
          } else if (d[0] != '*' && this._data.x + this.vel.x / 1000 <= d[0] && this.vel.x < 0) {
            this.vel.x = 0;
            this.x = d[0];
          }
          if (d[1] != '*' && this._data.y + this.vel.y / 1000 >= d[1] && this.vel.y > 0) {
            this.vel.y = 0;
            this.y = d[1];
          } else if (d[1] != '*' && this._data.y + this.vel.y / 1000 <= d[1] && this.vel.y < 0) {
            this.vel.y = 0;
            this.y = d[1];
          }
        }
      }
      teleport(x, y) {
        this._data.x = x;
        this._data.left = x - this._data.width / 2;
        this._data.right = x + this._data.width / 2;
        this._data.y = y;
        this._data.top = y - this._data.height / 2;
        this._data.bottom = y + this._data.height / 2;
      }
      moveX(amt) {
        this._data.x += amt;
        this._data.left += amt;
        this._data.right += amt;
      }
      moveY(amt) {
        this._data.y += amt;
        this._data.top += amt;
        this._data.bottom += amt;
      }
      move(x, y) {
        this._data.x += x;
        this._data.left += x;
        this._data.right += x;
        this._data.y += y;
        this._data.top += y;
        this._data.bottom += y;
      }
      to(x, y, speedX, speedY) {
        if (x == '*') speedX = 0;
        else if (speedX == 0) x = '*'
        if (y == '*') speedY = 0;
        else if (speedY == 0) y = '*'
    
        this._destination = [x, y];
    
        if (x > this._data.x && x !== '*') this.vel.x = speedX;
        else if (x !== '*')this.vel.x = -speedX;
        if (y > this._data.y && y !== '*') this.vel.y = speedY;
        else if (y !== '*') this.vel.y = -speedY;
      }
      stop() {
        this.vel.x = 0;
        this.vel.y = 0;
        this._destination = null;
      }
      stopX() {
        this.vel.x = 0;
        this._destination[0] = '*';
      }
      stopY() {
        this.vel.y = 0;
        this._destination[1] = '*';
      }
      reflectX() {
        this.vel.x = -this.vel.x;
      }
      reflectY() {
        this.vel.y = -this.vel.y;
      }
    }
  }
  loadSprite(name, src, {
    x,
    y,
    width,
    height
  } = {}) {
    let image = new Image();
    image.src = src;
    let parent = this;
    image.onload = function() {
      width = width || image.naturalWidth;
      height = height || image.naturalHeight;
      x = x || 0;
      y = y || 0;
      parent._sprites[name] = {
        img: image,
        source: {
          x,
          y,
          width,
          height
        }
      };
    }
  }
  Pattern(image, {
    width,
    height,
    ...opts
  } = {}) {
    if (typeof image == 'string') {
      let img = new Image(width, height);
      img.src = image;
      image = img;
    }
    return this.context.createPattern(image, opts.repeat || 'no-repeat');
  }
  hook(for_, hook) {
    if (!this.hooks[for_]) this.hooks[for_] = [];
    this.hooks[for_].push(hook);
  }

  triggerHook(for_, ...params) {
    if (this.hooks[for_])
      for (let i = 0; i < this.hooks[for_].length; i++)
        this.hooks[for_][i](...params);
  }
  getCurrentState() {
    //finish later
    //I didn't know how to implement this without using up a ton of memory trying to save the entire game. Well, hmmm, but how can we save it, just save the position of everything and container and everything including text and the camera?
    //I was planning to save making this until much later on.
    //btw, when can we add it  your UI engine?
    //ok I still need to finish containers.
    //So, with containers, how should we implement that?
    //What if a thing is outside its container? Will it not be drawn?
    //if nothing, then 
    //When things are drawn, their coords should be relative to the center of their container, right?
    //Centered is easier. ok, so we still have a lot to implement there.
    //plus there is still .left, .top
    //The containers, and makeing the game be a big container. BTW, I also implemented automatic width/height/other attribute calcualtion. It takes the other values sucha as x, and y, top, and left, and trys to get enough info to calculate everything else. I thought that was cool.
    //Also, whats with Text? What will we do with that?
    //Can text be put into containers?
    //But, text works weird. It works differently than everything else, but thats mostly because you can't make text work like everything else. 
    //no, i mean the center coords with top left, etc.
    //even containers have top left, and the game, so its just weird that text doesn't.
    //I think we also need to alow people to link their custom collision detection functions
    //text doesnt really need .left, .top etc because its text
    //true... but it would be nice to have.
    //btw, do you like I condensed breakout.js?

  }
  saveState(id) {//for saving the games state to restore it later.
    //Save the current state of the game and everything in it to restore later.
    //game.saveState(0)
    //game.restoreState(0)
    //finish later
    this._states[id] = this.getCurrentState();
  }
  restoreState(id) {
    //finish later
  }
  pointDistance(x1, x2, y1, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }
  numberDistance(a, b) {
    return a > b ? a - b : b - a
  };
  start() {
    if (this.running) return;
    this.running = true;
    let elapsed = 0;
    let lastFrame = 0;

    const self = this;

    function gameLoop(t) {
      self.timestamp = t;
      elapsed = t - lastFrame;
      self.triggerHook("gameloop", elapsed);
      lastFrame = t;

      // NOTE: CHANGED ELAPSED TO BE SECONDS (deltaTime, draw method)
      self.deltaTime = elapsed / 1000;
      self.FPS = 1000 / elapsed;
      self.context.fillStyle = self.background;
      self.context.fillRect(0, 0, self.canvas.width, self.canvas.height);

      for (let ev of KEYS.events.held) {
        if (KEYS.pressed.has(ev.key)) ev.callback(elapsed)
      }
      //Implement camera rotation (text+thing), remember camera can not affect it if overhead is set to true.
      //ctx.translate(camera.cen)
      //ctx.rotate(45 * Math.PI / 180);
      self.viewport.draw(elapsed);
      if (self.running) window.requestAnimationFrame(gameLoop);
    }

    window.requestAnimationFrame(gameLoop);
  }
  stop() {
    if (this.running) this.running = false;
  }
}

// setInterval(() => FPSel.innerText = `FPS: ${game.FPS.toFixed(1)}`, 500);
