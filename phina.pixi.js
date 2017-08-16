/*
MIT License

Copyright (c) 2017 simiraaaa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

@version 0.0.1
*/

if (typeof phina === 'undefined') {
  throw new Error('phina.jsを先に読み込んでください。 Load phina.js before.');
}

if (typeof PIXI === 'undefined') {
  throw new Error('pixi.jsを先に読み込んでください。 Load pixi.js before.');
}

if (PIXI.VERSION[0] !== '3') {
  console.warn('pixi.js は v3 を使用してください。')
}

phina.pixi = {
  VERSION: '0.0.1',
  globalMap: {
    PixiElement: 'DisplayElement',
    PixiSprite: 'Sprite',
    PixiTexture: 'Texture',
    PixiScene: 'DisplayScene',
    PixiRenderer: 'Renderer',
    PixiApp: 'App',
    PixiUtil: 'Util',
    PixiLabel: 'Label',
  },
  globalize: function() {
    var global = phina.global;
    var pixi = phina.pixi;
    
    pixi.globalMap.forIn(function(name, globalName) {
      global[globalName] = pixi[name];
    });
  }
};


(function(phina, PIXI) {

  /**
   * @class phina.pixi.PixiUtil
   */
  var PixiUtil = phina.define('phina.pixi.PixiUtil', {

    init: function() {

    },

    _static: {
      fitScreen: function(domElement, isEver) {
        isEver = isEver === undefined ? true : isEver;

        var _fitFunc = function() {
          var s = domElement.style;
          
          s.position = "absolute";
          s.margin = "auto";
          s.left = "0px";
          s.top  = "0px";
          s.bottom = "0px";
          s.right = "0px";

          var rateWidth = domElement.width/window.innerWidth;
          var rateHeight= domElement.height/window.innerHeight;
          var rate = domElement.height/domElement.width;
          
          if (rateWidth > rateHeight) {
            s.width  = Math.floor(innerWidth)+"px";
            s.height = Math.floor(innerWidth*rate)+"px";
          }
          else {
            s.width  = Math.floor(innerHeight/rate)+"px";
            s.height = Math.floor(innerHeight)+"px";
          }
        };
        
        // 一度実行しておく
        _fitFunc();

        // リサイズ時のリスナとして登録しておく
        if (isEver) {
          phina.global.addEventListener("resize", _fitFunc, false);
        }
        return _fitFunc;
      },

      mulMatVec2: function(mat, vec2) {
        var vx = mat.a*vec2.x + mat.b*vec2.y + mat.tx;
        var vy = mat.c*vec2.x + mat.d*vec2.y + mat.ty;
        
        return phina.geom.Vector2(vx, vy);
      },

      hslToNumber: function (h, s, l) {
        var r, g, b, max, min;
        if (l <= 49) {
          max = 2.55 * (l + l * (s / 100));
          min = 2.55 * (l - l * (s / 100));
        }
        else {
          max = 2.55 * (l + (100 - l) * (s / 100));
          min = 2.55 * (l - (100 - l) * (s / 100));
        }
        h %= 360;
        while (h < 0) h += 360;
        if (h < 60) {
          r = max;
          g = (h / 60) * (max - min) + min;
          b = min;
        }
        else if (h < 120) {
          r = ((120 - h) / 60) * (max - min) + min;
          g = max;
          b = min;
        }
        else if (h < 180) {
          r = min;
          g = max;
          b = ((h - 120) / 60) * (max - min) + min;
        }
        else if (h < 240) {
          r = min;
          g = ((240 - h) / 60) * (max - min) + min;
          b = max;
        }
        else if (h < 300) {
          r = ((h - 240) / 60) * (max - min) + min;
          g = min;
          b = max;
        }
        else {
          r = max;
          g = min;
          b = ((360 - h) / 60) * (max - min) + min;
        }
        return (r << 16) | (g << 8) | b;
      },

      colorStringToNumber: function (str) {
        if (str[0] === '#') {
          if (str.length === 4) {
            var r = str[1];
            var g = str[2];
            var b = str[3];
            return parseInt(r + r + g + g + b + b, 16);
          }
          return parseInt(str.substr(1), 16);
        }
        if (/rgb/.test(str)) {
          var rgb = str.match(/\d+/g);
          return (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
        }
        if (/hsl/.test(str)) {
          var hsl = str.match(/\d+/g);
          return PixiUtil.hslToNumber(hsl[0] | 0, hsl[1] | 0, hsl[2] | 0);
        }
        return PixiUtil.COLOR_MAP[str] || 0;
      },

      COLOR_MAP: {
        "black": 0,
        "silver": 12632256,
        "gray": 8421504,
        "white": 16777215,
        "maroon": 8388608,
        "red": 16711680,
        "purple": 8388736,
        "fuchsia": 16711935,
        "green": 32768,
        "lime": 65280,
        "olive": 8421376,
        "yellow": 16776960,
        "navy": 128,
        "blue": 255,
        "teal": 32896,
        "aqua": 65535,
        "orange": 16753920,
        "aliceblue": 15792383,
        "antiquewhite": 16444375,
        "aquamarine": 8388564,
        "azure": 15794175,
        "beige": 16119260,
        "bisque": 16770244,
        "blanchedalmond": 16772045,
        "blueviolet": 9055202,
        "brown": 10824234,
        "burlywood": 14596231,
        "cadetblue": 6266528,
        "chartreuse": 8388352,
        "chocolate": 13789470,
        "coral": 16744272,
        "cornflowerblue": 6591981,
        "cornsilk": 16775388,
        "crimson": 14423100,
        "cyan": 65535,
        "darkblue": 139,
        "darkcyan": 35723,
        "darkgoldenrod": 12092939,
        "darkgray": 11119017,
        "darkgreen": 25600,
        "darkgrey": 11119017,
        "darkkhaki": 12433259,
        "darkmagenta": 9109643,
        "darkolivegreen": 5597999,
        "darkorange": 16747520,
        "darkorchid": 10040012,
        "darkred": 9109504,
        "darksalmon": 15308410,
        "darkseagreen": 9419919,
        "darkslateblue": 4734347,
        "darkslategray": 3100495,
        "darkslategrey": 3100495,
        "darkturquoise": 52945,
        "darkviolet": 9699539,
        "deeppink": 16716947,
        "deepskyblue": 49151,
        "dimgray": 6908265,
        "dimgrey": 6908265,
        "dodgerblue": 2003199,
        "firebrick": 11674146,
        "floralwhite": 16775920,
        "forestgreen": 2263842,
        "gainsboro": 14474460,
        "ghostwhite": 16316671,
        "gold": 16766720,
        "goldenrod": 14329120,
        "greenyellow": 11403055,
        "grey": 8421504,
        "honeydew": 15794160,
        "hotpink": 16738740,
        "indianred": 13458524,
        "indigo": 4915330,
        "ivory": 16777200,
        "khaki": 15787660,
        "lavender": 15132410,
        "lavenderblush": 16773365,
        "lawngreen": 8190976,
        "lemonchiffon": 16775885,
        "lightblue": 11393254,
        "lightcoral": 15761536,
        "lightcyan": 14745599,
        "lightgoldenrodyellow": 16448210,
        "lightgray": 13882323,
        "lightgreen": 9498256,
        "lightgrey": 13882323,
        "lightpink": 16758465,
        "lightsalmon": 16752762,
        "lightseagreen": 2142890,
        "lightskyblue": 8900346,
        "lightslategray": 7833753,
        "lightslategrey": 7833753,
        "lightsteelblue": 11584734,
        "lightyellow": 16777184,
        "limegreen": 3329330,
        "linen": 16445670,
        "mediumaquamarine": 6737322,
        "mediumblue": 205,
        "mediumorchid": 12211667,
        "mediumpurple": 9662683,
        "mediumseagreen": 3978097,
        "mediumslateblue": 8087790,
        "mediumspringgreen": 64154,
        "mediumturquoise": 4772300,
        "mediumvioletred": 13047173,
        "midnightblue": 1644912,
        "mintcream": 16121850,
        "mistyrose": 16770273,
        "moccasin": 16770229,
        "navajowhite": 16768685,
        "oldlace": 16643558,
        "olivedrab": 7048739,
        "orangered": 16729344,
        "orchid": 14315734,
        "palegoldenrod": 15657130,
        "palegreen": 10025880,
        "paleturquoise": 11529966,
        "palevioletred": 14381203,
        "papayawhip": 16773077,
        "peachpuff": 16767673,
        "peru": 13468991,
        "pink": 16761035,
        "plum": 14524637,
        "powderblue": 11591910,
        "rosybrown": 12357519,
        "royalblue": 4286945,
        "saddlebrown": 9127187,
        "salmon": 16416882,
        "sandybrown": 16032864,
        "seagreen": 3050327,
        "seashell": 16774638,
        "sienna": 10506797,
        "skyblue": 8900331,
        "slateblue": 6970061,
        "slategray": 7372944,
        "slategrey": 7372944,
        "snow": 16775930,
        "springgreen": 65407,
        "steelblue": 4620980,
        "tan": 13808780,
        "thistle": 14204888,
        "tomato": 16737095,
        "turquoise": 4251856,
        "violet": 15631086,
        "wheat": 16113331,
        "whitesmoke": 16119285,
        "yellowgreen": 10145074,
        "rebeccapurple": 6697881
      },

    }
  });

}(phina, PIXI));
(function(phina, PIXI) {

  /**
   * @class phina.pixi.PixiRenderer
   * {@link http://pixijs.download/release/docs/PIXI.html#.autoDetectRenderer}
   * @param {Object} (optional) options
   * @param {Number} options.width = 640 幅
   * @param {Number} options.height = 960 高さ
   * @param {HTMLCanvasElement} options.view 描画対象のHTMLCanvasElement
   * @param {Boolean} options.transparent = true 背景色を描画するか(透明にしたい場合true)
   * @param {Boolean} options.antialias = false
   * @param {Boolean} options.preserveDrawingBuffer = false
   * @param {Object} options.backgroundColor = 0x000000 transparent が false の時に描画する背景色
   * @param {Boolean} options.clearBeforeRender = true 描画をする際に現在の描画内容をクリアするか
   * @param {Number} options.resolution = 1
   * @param {Boolean} options.forceCanvas = false
   * @param {Boolean} options.roundPixels = false
   * @param {Boolean} options.forceFXAA = false
   * @param {Boolean} options.legacy = false
   */
  phina.define('phina.pixi.PixiRenderer', {
    pixiRenderer: null,
    init: function(options) {
      options = (options || {}).$safe(phina.pixi.PixiRenderer.defaults);
      this.pixiRenderer = PIXI.autoDetectRenderer(options.width, options.height, options);
    },

    /**
     * @param {phina.pixi.PixiElement} pixiElement
     * @chainable
     */
    render: function(pixiElement) {
      this.pixiRenderer.render(pixiElement.pixiObject);
      return this;
    },

    /**
     * @param {Number} (optional) color
     * @deprecated
     */
    clear: function(color) {
      // this.pixiRenderer.clear(color);
      // return this;
    },

    isWebGL: function() {
      return this.pixiRenderer instanceof PIXI.WebGLRenderer;
    },

    renderChildren: function() {
      throw new Error('PixiRenderer は renderChildren を実装していません。 Not implemented renderChildren.');
    },
    renderObject: function() {
      throw new Error('PixiRenderer は renderObject を実装していません。 Not implemented renderObject.');
    },

    _accessor: {
      domElement: {
        get: function() { return this.pixiRenderer.view; },
        set: function(v) { this.pixiRenderer.view = v; }
      },
    },

    _static: {
      defaults: {
        width: 640,
        height: 960,
        
        transparent: true,
        antialias: false,
        preserveDrawingBuffer: false,
        backgroundColor: 0x000000,
        clearBeforeRender: true,
        resolution: 1,
        forceCanvas: false,
        roundPixels: false,
        forceFXAA: false,
        legacy: false,
      }
    }
  });
  
}(phina, PIXI));
(function(phina, PIXI) {
  /**
   * @class phina.pixi.PixiTexture
   * @extends phina.asset.Asset
   */
  phina.define('phina.pixi.PixiTexture', {
    superClass: phina.asset.Asset,

    init: function() {
      this.superInit();
    },

    _load: function(resolve) {
      var self = this;
      PIXI.loader.add(this.key, this.src).load(function(loader, resources) {
        self.pixiTexture = resources[self.key].texture;
        resolve(self);
      });
    },

    createFrame: function(x, y, width, height) {
      if (typeof x === 'object') {
        y = x.y;
        width = x.width;
        height = x.height;
        x = x.x;
      }
      var newTexture = phina.pixi.PixiTexture();
      newTexture.pixiTexture = new PIXI.Texture(this.pixiTexture.baseTexture, new PIXI.math.Rectangle(x, y, width, height));

      return newTexture;
    },
    
    setKey: function(key) {
      this.key = key;
      return this;
    },
    
    /**
     * @param {HTMLCanvasElement} canvas
     */
    fromCanvas: function(canvas) {
      this.pixiTexture = PIXI.Texture.fromCanvas(canvas);
      return this;
    },

    /**
     * @param {phina.display.Shape} shape
     */
    fromShape: function(shape) {
      if(shape._dirtyDraw) {
        shape.render(shape.canvas);
      }
      return this.fromCanvas(shape.canvas.domElement);
    },

    update: function() {
      this.pixiTexture.update();
      return this;
    },

    _accessor: {
      width: {
        get: function() {
          return this.pixiTexture.width;
        },

        set: function(v) {
          this.pixiTexture.width = v;
        }
      },

      height: {
        get: function() {
          return this.pixiTexture.height;
        },

        set: function(v) {
          this.pixiTexture.height = v;
        }
      },
    },

    _static: {
      
      /**
       * @param {HTMLCanvasElement} canvas
       */
      fromCanvas: function(canvas) {
        return phina.pixi.PixiTexture().fromCanvas(canvas);
      },

      /**
       * @param {phina.display.Shape} shape
       */
      fromShape: function(shape) {
        return phina.pixi.PixiTexture().fromShape(shape);
      }
    }
    
  });

  phina.asset.AssetLoader.register('pixi', function(key, path) {
    return phina.pixi.PixiTexture().setKey(key).load(path);
  });

}(phina, PIXI));
(function(phina, PIXI){

  /**
   * @class phina.pixi.PixiElement
   * @extends phina.app.Element
   */ 
  var PixiElement = phina.define('phina.pixi.PixiElement', {
    superClass: phina.app.Element,
    pixiObject: null,
    _blendMode: 'source-over',
    boundingType: 'rect',
    _scale: null,
    _origin: null,
    init: function(options) {
      this.superInit();
      
      options = (options || {}).$safe(PixiElement.defaults);
      
      this.pixiObject = options.pixiObject || new PIXI.Container();
      this.boundingType = options.boundingType;
      
      this._scale = phina.geom.Vector2(1, 1);
      this._origin = phina.geom.Vector2(0.5, 0.5);
    
      this.width = options.width;
      this.height = options.height;
      this.radius = options.radius;

      this.x = options.x;
      this.y = options.y;
      
      this.alpha = options.alpha;
      
      this.scaleX = options.scaleX;
      this.scaleY = options.scaleY;
      this.rotation = options.rotation;
      this.originX = options.originX;
      this.originY = options.originY;
      
      this.blendMode = options.blendMode;
      this.visible = options.visible;
      
      this.interactive = options.interactive;
      this._overFlags = {};
      this._touchFlags = {};
    },
    
    
    /**
     * @method addChild
     * 自身に子要素を追加します。
     *
     * 自身を子要素として引数で指定した要素に追加するには {@link #addChildTo} を使用してください。
     *
     * @param {phina.pixi.PixiElement} child 追加する子要素
     */
    addChild: function(child) {
      if (child.parent) child.parent.removeChild(child);
      this.pixiObject.addChild(child.pixiObject);
      child.parent = this;
      this.children.push(child);
      child.has('added') && child.flare('added');
      return child;
    },
    /**
    * @method addChildAt
    * 自身を、指定した要素の子要素の任意の配列インデックスに追加します。
    * 
    * @param {phina.pixi.PixiElement} child 追加する子要素
    * @param {Number} index インデックス番号
    */
    addChildAt: function(child, index) {
      throw new Error('addChildAt : このメソッドは使用できません。');
      // if (child.parent) child.parent.removeChild(child);

      // child.parent = this;
      // this.children.splice(index, 0, child);

      // child.has('added') && child.flare('added');

      // return child;
    },

    /**
     * @method removeChild
     * @chainable
     * 指定した要素を自身の子要素から削除します。
     *
     * @param {phina.pixi.PixiElement} child 要素
     */
    removeChild: function(child) {
      var index = this.children.indexOf(child);
      if (index !== -1) {
        this.children.splice(index, 1);
        this.pixiObject.removeChild(child.pixiObject);
        child.parent = null;
        child.has('removed') && child.flare('removed');
      }
      return this;
    },
    
    /**
     * 点と衝突しているかを判定
     * @param {Number} x
     * @param {Number} y
     */
    hitTest: function(x, y) {
      if (this.boundingType === 'rect') {
        return this.hitTestRect(x, y);
      }
      else if (this.boundingType === 'circle') {
        return this.hitTestCircle(x, y);
      }
      else {
        // none の場合
        return true;
      }
    },

    hitTestRect: function(x, y) {
      var p = this.globalToLocal(phina.geom.Vector2(x, y));

      var left   = -this.width*this.originX;
      var right  = +this.width*(1-this.originX);
      var top    = -this.height*this.originY;
      var bottom = +this.height*(1-this.originY);

      return ( left < p.x && p.x < right ) && ( top  < p.y && p.y < bottom );
    },

    hitTestCircle: function(x, y) {
      // 円判定
      var p = this.globalToLocal(phina.geom.Vector2(x, y));
      if (((p.x)*(p.x)+(p.y)*(p.y)) < (this.radius*this.radius)) {
          return true;
      }
      return false;
    },

    /**
     * 要素と衝突しているかを判定
     * @param {Object} elm
     */
    hitTestElement: function(elm) {
      var rect0 = this;
      var rect1 = elm;
      return (rect0.left < rect1.right) && (rect0.right > rect1.left) &&
             (rect0.top < rect1.bottom) && (rect0.bottom > rect1.top);
    },


    globalToLocal: function(p) {
      var matrix = this.pixiObject.worldTransform.clone();
      matrix.invert();
      return phina.pixi.PixiUtil.mulMatVec2(matrix, p);
    },

    setInteractive: function(flag, type) {
      this.interactive = flag;
      if (type) {
        this.boundingType = type;
      }

      return this;
    },

    /**
     * X 座標値をセット
     * @param {Number} x
     */
    setX: function(x) {
      this.pixiObject.position.x = x;
      return this;
    },
    
    /**
     * Y 座標値をセット
     * @param {Number} y
     */
    setY: function(y) {
      this.pixiObject.position.y = y;
      return this;
    },
    
    /**
     * XY 座標をセット
     * @param {Number} x
     * @param {Number} y
     */
    setPosition: function(x, y) {
      this.pixiObject.position.x = x;
      this.pixiObject.position.y = y;
      return this;
    },

    /**
     * 回転をセット
     * @param {Number} rotation
     */
    setRotation: function(rotation) {
      this.rotation = rotation;
      return this;
    },

    /**
     * スケールをセット
     * @param {Number} x
     * @param {Number} y
     */
    setScale: function(x, y) {
      this.scaleX = x;
      if (arguments.length <= 1) {
        this.scaleY = x;
      } else {
        this.scaleY = y;
      }
      return this;
    },
    
    /**
     * 基準点をセット
     * @param {Number} x
     * @param {Number} y
     */
    setOrigin: function(x, y) {
      this.pixiObject.pivot.x = (x - 0.5) * this.width;
      if (arguments.length <= 1) {
        y = x;
      }
      this.pixiObject.pivot.y = (y - 0.5) * this.height;
      return this;
    },
    
    /**
     * 幅をセット
     * @param {Number} width
     */
    setWidth: function(width) {
      this.width = width;
      return this;
    },
    
    /**
     * 高さをセット
     * @param {Number} height
     */
    setHeight: function(height) {
      this.height = height;
      return this;
    },
    
    /**
     * サイズ(幅, 高さ)をセット
     * @param {Number} width
     * @param {Number} height
     */
    setSize: function(width, height) {
      this.width  = width;
      this.height = height;
      return this;
    },

    setBoundingType: function(type) {
      this.boundingType = type;
      return this;
    },

    moveTo: function(x, y) {
      return this.setPosition(x, y);
    },

    moveBy: function(x, y) {
      this.pixiObject.position.x += x;
      this.pixiObject.position.y += y;
      return this;
    },

    _calcWorldMatrix: function() {
      if (!this.parent) return ;

      // cache check
      if (this.rotation != this._cachedRotation) {
        this._cachedRotation = this.rotation;

        var r = this.rotation*(Math.PI/180);
        this._sr = Math.sin(r);
        this._cr = Math.cos(r);
      }

      var local = this._matrix;
      var parent = this.parent._worldMatrix || phina.geom.Matrix33.IDENTITY;
      var world = this._worldMatrix;

      // ローカルの行列を計算
      local.m00 = this._cr * this._scale.x;
      local.m01 =-this._sr * this._scale.y;
      local.m10 = this._sr * this._scale.x;
      local.m11 = this._cr * this._scale.y;
      local.m02 = this.x;
      local.m12 = this.y;

      // cache
      var a00 = local.m00; var a01 = local.m01; var a02 = local.m02;
      var a10 = local.m10; var a11 = local.m11; var a12 = local.m12;
      var b00 = parent.m00; var b01 = parent.m01; var b02 = parent.m02;
      var b10 = parent.m10; var b11 = parent.m11; var b12 = parent.m12;

      // 親の行列と掛け合わせる
      world.m00 = b00 * a00 + b01 * a10;
      world.m01 = b00 * a01 + b01 * a11;
      world.m02 = b00 * a02 + b01 * a12 + b02;

      world.m10 = b10 * a00 + b11 * a10;
      world.m11 = b10 * a01 + b11 * a11;
      world.m12 = b10 * a02 + b11 * a12 + b12;

      return this;
    },

    /**
     * 表示/非表示をセット
     */
    setVisible: function(flag) {
      this.pixiObject.visible = flag;
      return this;
    },

    /**
     * 表示
     */
    show: function() {
      this.pixiObject.visible = true;
      return this;
    },

    /**
     * 非表示
     */
    hide: function() {
      this.pixiObject.visible = false;
      return this;
    },

    /**
     * @private
     */
    _calcWorldAlpha: function() {
      if (this.alpha < 0) {
        this._worldAlpha = 0;
        return;
      }
      if (!this.parent) {
        this._worldAlpha = this.alpha;
        return ;
      }
      else {
        var worldAlpha = (this.parent._worldAlpha !== undefined) ? this.parent._worldAlpha : 1.0; 
        // alpha
        this._worldAlpha = worldAlpha * this.alpha;
      }
    },
    
    _accessor: {
      
      
      position: {
        get: function() { return this.pixiObject.position; },
        set: function(p) {
          this.pixiObject.position = p;
        },
      },
      
      rotation: {
        get: function() { return this.pixiObject.rotation.toDegree(); },
        set: function(r) { this.pixiObject.rotation = r.toRadian(); },
      },
      
      // position: {
      //   get: function() {
      //     var p = this.pixiObject.position;
      //     return new phina.geom.Vector2(p.x, p.y);
      //   },
        
      //   set: function(p) {
          
      //   }
      // },
      
      /**
       * @property    x
       * x座標値
       */
      x: {
        get: function() { return this.pixiObject.position.x; },
        set: function(v) { this.pixiObject.position.x = v; }
      },
      /**
       * @property    y
       * y座標値
       */
      y: {
        get: function() { return this.pixiObject.position.y; },
        set: function(v) { this.pixiObject.position.y = v; }
      },
      
      pivot: {
        get: function() { return this.pixiObject.pivot; },
        set: function(v) { this.pixiObject.pivot = v; },
      },

      anchor: {
        get: function() { return this.pixiObject.anchor; },
        set: function(v) { this.pixiObject.anchor = v; },
      },

      origin: {
        get: function() {
          console.warn('PixiElement では origin は非推奨です。originX, originYを使用してください。');
          return this._origin;
        },
        set: function(v) {
          console.warn('PixiElement では origin は非推奨です。originX, originY, もしくは setOrigin() を使用してください。');
          this.originX = v.x;
          this.originY = v.y;
        },
      },

      /**
       * @property    originX
       * x座標値
       */
      originX: {
        get: function() {
          return this._origin.x;
        },
        set: function(v) {
          this._origin.x = v;
          this.pixiObject.pivot.x = (v - 0.5) * this.width;
        }
      },
      
      /**
       * @property    originY
       * y座標値
       */
      originY: {
        get: function() {
          return this._origin.y;
        },
        set: function(v) {
          this._origin.y = v;
          this.pixiObject.pivot.y = (v - 0.5) * this.height;
        }
      },
      
      scale: {
        get: function() {
          console.warn('scale プロパティは非推奨です。')
          return this._scale;
          
        },
        set: function(s) {
          console.warn('scale プロパティは非推奨です。setScale()を使用してください')
          this.setScale(s.x, s.y);
        },
      },
      
      /**
       * @property    scaleX
       * スケールX値
       */
      scaleX: {
        get: function() {
          return this._scale.x;
        },
        set: function(v) {
          var prev = this.width;
          this._scale.x = v;
          this.width = prev;
        }
      },
      
      /**
       * @property    scaleY
       * スケールY値
       */
      scaleY: {
        get: function() {
          return this._scale.y;
        },
        set: function(v) {
          var prev = this.height;
          this._scale.y = v;
          this.height = prev;
        }
      },
      
      /**
       * @property    width
       * width
       */
      width: {
        get: function() {
          return (this.boundingType === 'rect') ?
            this.pixiObject._width / this._scale.x : this._diameter;
        },
        set: function(v) {
          this.pixiObject.width = v * this._scale.x;
          this.pixiObject.pivot.x = (this._origin.x - 0.5) * v;
        }
      },
      
      /**
       * @property    height
       * height
       */
      height: {
        get: function() {
          return (this.boundingType === 'rect') ?
            this.pixiObject._height / this._scale.y : this._diameter;
        },
        set: function(v) {
          this.pixiObject.height = v * this._scale.y;
          this.pixiObject.pivot.y = (this._origin.y - 0.5) * v;
        },
      },

      /**
       * @property    radius
       * 半径
       */
      radius: {
        get: function() {
          return (this.boundingType === 'rect') ?
            (this.width+this.height)/4 : this._radius;
        },
        set: function(v) {
          this._radius = v;
          this._diameter = v*2;
          if(this.boundingType === 'circle') {
            this.pixiObject.width = this._diameter * this._scale.x;
            this.pixiObject.height = this._diameter * this._scale.y;
          }
        },
      },
      
      /**
       * @property    top
       * 左
       */
      top: {
        get: function() {
          var pixiObject = this.pixiObject;
          return pixiObject.position.y - pixiObject.pivot.y - this.height/2 ;
        },
        set: function(v) {
          var pixiObject = this.pixiObject;
          pixiObject.position.y = v + pixiObject.pivot.y + this.height/2;
        },
      },
   
      /**
       * @property    right
       * 左
       */
      right: {
        get: function() {
          var pixiObject = this.pixiObject;
          return pixiObject.position.x - pixiObject.pivot.x + this.width/2;
        },
        set: function(v) {
          var pixiObject = this.pixiObject;
          pixiObject.position.x = v + pixiObject.pivot.x - this.width/2;
          
        },
      },
   
      /**
       * @property    bottom
       * 左
       */
      bottom: {
        get: function() {
          var pixiObject = this.pixiObject;
          return pixiObject.position.y - pixiObject.pivot.y + this.height/2;
        },
        set: function(v) {
          var pixiObject = this.pixiObject;
          pixiObject.position.y = v + pixiObject.pivot.y - this.height/2;
        },
      },
   
      /**
       * @property    left
       * 左
       */
      left: {
        get: function() {
          var pixiObject = this.pixiObject;
          return pixiObject.position.x - pixiObject.pivot.x - this.width / 2;
        },
        set: function(v) {
          var pixiObject = this.pixiObject;
          pixiObject.position.x = v + pixiObject.pivot.x + this.width / 2;
        },
      },

      /**
       * @property    centerX
       * centerX
       */
      centerX: {
        get: function() {
          var pixiObject = this.pixiObject;
          return pixiObject.position.x - pixiObject.pivot.x;
        },
        set: function(v) {
          // TODO: どうしようかな??
        }
      },
   
      /**
       * @property    centerY
       * centerY
       */
      centerY: {
        get: function() {
          var pixiObject = this.pixiObject;
          return pixiObject.position.y - pixiObject.pivot.y;
        },
        set: function(v) {
          // TODO: どうしようかな??
        }
      },
      
      blendMode: {
        get: function() {
          return this._blendMode;
        },
        
        set: function(v) {
          if (!(v in PixiElement.BLEND_MODES)) {
            v = 'source-over';
          }
          this.pixiObject.blendMode = PixiElement.BLEND_MODES[v];
          this._blendMode = v;
        }
      },
      
      alpha: {
        get: function() {
          return this.pixiObject.alpha;
        },
        
        set: function(v) {
          this.pixiObject.alpha = v;
        }
      },

      visible: {
        get: function() { return this.pixiObject.visible; },
        set: function(v) { this.pixiObject.visible = v; },
      }
    },
    
    _static: {
      defaults: {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        originX: 0.5,
        originY: 0.5,
        
        width: 64,
        height: 64,
        radius: 32,
        boundingType: 'rect',
        blendMode: 'source-over',
        visible: true,
        alpha: 1,
        interactive: false,
      },
      
      BLEND_MODES: {
        'source-over': PIXI.BLEND_MODES.NORMAL,
        'screen': PIXI.BLEND_MODES.SCREEN,
        'lighter': PIXI.BLEND_MODES.ADD,
        'multiply': PIXI.BLEND_MODES.MULTIPLY,
      }
    },

  });
  
}(phina, PIXI));
(function(phina, PIXI) {

  /**
   * @class phina.pixi.PixiScene
   * @extends phina.pixi.PixiElement
   */
  phina.define('phina.pixi.PixiScene', {
    superClass: phina.pixi.PixiElement,
    init: function(options) {
      this.superInit(options = (options || {}).$safe(phina.pixi.PixiScene.defaults));

      // this.backgroundColor = (options.backgroundColor) ? options.backgroundColor : null;

      this.gridX = phina.util.Grid(options.width, 16);
      this.gridY = phina.util.Grid(options.height, 16);

      this.interactive = true;
      this._overFlags = {};
      this._touchFlags = {};
    },


    exit: function(nextLabel, nextArguments) {
      if (!this.app) return ;

      if (arguments.length > 0) {
        if (typeof arguments[0] === 'object') {
          nextLabel = arguments[0].nextLabel || this.nextLabel;
          nextArguments = arguments[0];
        }

        this.nextLabel = nextLabel;
        this.nextArguments = nextArguments;
      }

      this.app.popScene();

      return this;
    },

    _update: function() {
      if (this.update) {
        this.update();
      }
    },

    _render: function() {
    },

    _static: {
      defaults: {
        width: 640,
        height: 960,
        boundingType: 'none',
      },
    },

    _accessor: {
      width: {
        get: function() {
          return this.pixiObject._width / this._scale.x;
        },
        set: function(v) {
          this.pixiObject.width = v * this._scale.x;
        },
      },

      height: {
        get: function() {
          return this.pixiObject._height / this._scale.y;
        },
        set: function(v) {
          this.pixiObject.height = v * this._scale.y;
        }
      },
    },

    
  });
  
}(phina, PIXI));
(function(phina, PIXI) {
  /**
   * @class phina.pixi.PixiSprite
   * @extends phina.pixi.PixiElement
   */
  phina.define('phina.pixi.PixiSprite', {
    superClass: phina.pixi.PixiElement,

    init: function(image, x, y, width, height) {
      this.superInit({
        pixiObject: new PIXI.Sprite(),
      });

      if (image) {
        this.setImage(image, x, y, width, height);
      }
    },

    setImage: function(image, x, y, width, height) {
      if (typeof image === 'string') {
        image = phina.asset.AssetManager.get('pixi', image);
      }
      if (typeof x === 'number') {
        image = image.createFrame(x, y, width, height);
      }
      this._image = image;

      this.pixiObject.texture = image.pixiTexture;
      this.pixiObject.anchor.set(0.5, 0.5);
      this.width = image.pixiTexture.width;
      this.height = image.pixiTexture.height;
      return this;
    },

    setFrame: function(x, y, width, height) {
      return this.setImage(this.image, x, y, width, height);
    },
    /**
     * @param {HTMLCanvasElement} canvas
     */
    fromCanvas: function(canvas, x, y, width, height) {
      return this.setImage(phina.pixi.PixiTexture().fromCanvas(canvas), x, y, width, height);
    },
    /**
     * @param {phina.display.Shape} shape
     */
    fromShape: function(shape, x, y, width, height) {
      return this.setImage(phina.pixi.PixiTexture().fromShape(shape), x, y, width, height);
    },

    updateTexture: function() {
      this.image.update();
      return this;
    },
    
    _accessor: {
      image: {
        get: function() { return this._image; },
        set: function(v) {
          this.setImage(v);
        }
      },
    },

    _static: {
      fromCanvas: function(canvas, x, y, width, height) {
        return phina.pixi.PixiSprite().fromCanvas(canvas, x, y, width, height);
      },

      fromShape: function(shape, x, y, width, height) {
        return phina.pixi.PixiSprite().fromShape(shape, x, y, width, height);
      },
    }
  });

}(phina, PIXI));
(function(phina, PIXI){

  /**
   * @class phina.pixi.PixiLabel
   * @extends phina.app.PixiSprite
   */ 
  var PixiLabel = phina.define('phina.pixi.PixiLabel', {
    superClass: phina.pixi.PixiSprite,
    init: function(options){
      var labelOpts = {};
      options = options || {};
      options.forIn(function(k, v){
        if(PixiLabel.labelProperties.indexOf(k) !== -1) {
          labelOpts[k] = v;
        }
      });
      this.label = phina.display.Label(labelOpts);
      this.superInit(phina.pixi.PixiTexture.fromShape(this.label));
      
      this.on('enterframe', this._labelUpdate);
    },
    
    _labelUpdate: function(e){
      var label = this.label;
      if(label._dirtyDraw) {
        label._dirtyDraw = false;
        label.render(label.canvas);
        this.updateTexture();
      }
    },
    _static: {
      labelProperties: [
        'width',
        'height',
        'radius',
        'padding',
        'backgroundColor',
        'fill',
        'stroke',
        'strokeWidth',
        'shadow',
        'shadowBlur',
        'text',
        'fontSize',
        'fontWeight',
        'fontFamily',
        'align',
        'baseline',
        'lineHeight'
      ]
    },
    
    _defined: function(){
      var self = this;
      this.labelProperties.forEach(function(p){
        self.prototype.accessor(p, {
          get: function(){
            return this.label[p];
          },
          set: function(v){
            this.label[p] = v;
          }
        });
      });
    }
  });
}(phina, PIXI));
(function(phina, PIXI) {

  /**
   * @class phina.pixi.PixiApp
   * @extends phina.display.DomApp
   */
  phina.define('phina.pixi.PixiApp', {
    superClass: phina.display.DomApp,
    init: function(options) {
      options = (options || {}).$safe(phina.pixi.PixiApp.defaults);

      if (!options.query && !options.domElement) {
        options.domElement = document.createElement('canvas');
        if (options.append) {
          document.body.appendChild(options.domElement);
        }
      }
      if(!options.runner && phina.isAndroid()) {
        options.runner = phina.global.requestAnimationFrame;
      }
      this.superInit(options);

      this.gridX = phina.util.Grid({
        width: options.width,
        columns: options.columns,
      });
      this.gridY = phina.util.Grid({
        width: options.height,
        columns: options.columns,
      });

      this.renderer = phina.pixi.PixiRenderer({
        view: this.domElement,
        width: options.width,
        height: options.height
      });
      

      // this.backgroundColor = (options.backgroundColor !== undefined) ? options.backgroundColor : 'white';

      this.replaceScene(phina.pixi.PixiScene({
        width: options.width,
        height: options.height,
      }));

      if (options.fit) {
        this.fitScreen();
      }

      if (options.pixelated) {
        // チラつき防止
        // https://drafts.csswg.org/css-images/#the-image-rendering
        this.domElement.style.imageRendering = 'pixelated';
      }
    },

    _draw: function() {
      var renderer = this.renderer;
      renderer.clearBeforeRender = true;
      // this.renderer.clear(/* this.backgroundColor */);
      this._scenes.forEach(function(scene, i) {
        scene.pixiObject && renderer.render(scene);
        if (i === 0) {
          renderer.clearBeforeRender = false;
        }
      });
    },

    fitScreen: function() {
      phina.pixi.PixiUtil.fitScreen(this.domElement);
    },

    _static: {
      defaults: {
        width: 640,
        height: 960,
        columns: 12,
        fit: true,
        append: true,
      },
    },


    
  });
  
}(phina, PIXI));