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
};


(function(phina, PIXI) {

  phina.define('phina.pixi.PixiUtil', {

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
      this.pixiRenderer = PIXI.autoDetectRenderer({}.$extend(phina.pixi.PixiRenderer.defaults, options || {}));
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
  phina.define('phina.pixi.PixiTexture', {
    superClass: phina.asset.Asset,

    init: function() {
      this.superInit();
    },

    _load: function(resolve) {
      var self = this;
      var texture = phina.asset.Texture();
      texture.load(this.src).then(function(texture) {
        // var canvas = document.createElement('canvas');
        // self.context = canvas.getContext('2d');
        // self.canvas = canvas;
        // canvas.width = texture.domElement.naturalWidth;
        // canvas.height = texture.domElement.naturalHeight;
        // self.context.drawImage(texture.domElement, 0, 0, canvas.width, canvas.height);
        self.pixiTexture = new PIXI.Texture(new PIXI.BaseTexture(texture.domElement));
        self.phinaTexture = texture;
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
      newTexture.phinaTexture = this.phinaTexture;
      newTexture.pixiTexture = new PIXI.Texture(this.pixiTexture.baseTexture, new PIXI.math.Rectangle(x, y, width, height));

      return newTexture;
    }
    
  });

  phina.asset.AssetLoader.register('pixi', function(key, path) {
    return phina.pixi.PixiTexture().load(path);
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
    init: function(options) {
      this.superInit();
      
      this.pixiObject = options.pixiObject || new PIXI.Container();
      this.$extend((options || {}).$safe(PixiElement.defaults));
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
      var matrix = this._worldMatrix.clone();
      matrix.invert();
      // matrix.transpose();

      var temp = matrix.multiplyVector2(p);

      return temp;
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
      this.pixiObject.scale.x = x;
      if (arguments.length <= 1) {
          this.pixiObject.scale.y = x;
      } else {
          this.pixiObject.scale.y = y;
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
      local.m00 = this._cr * this.scale.x;
      local.m01 =-this._sr * this.scale.y;
      local.m10 = this._sr * this.scale.x;
      local.m11 = this._cr * this.scale.y;
      local.m02 = this.position.x;
      local.m12 = this.position.y;

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

    // /**
    //  * 表示/非表示をセット
    //  */
    // setVisible: function(flag) {
    //   throw new Error('visible は未実装です。');
    //   this.visible = flag;
    //   return this;
    // },

    // /**
    //  * 表示
    //  */
    // show: function() {
    //   throw new Error('visible は未実装です。');
    //   this.visible = true;
    //   return this;
    // },

    // /**
    //  * 非表示
    //  */
    // hide: function() {
    //   throw new Error('visible は未実装です。');
    //   this.visible = false;
    //   return this;
    // },

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
        get: function()   { return this.pixiObject.position.x; },
        set: function(v)  { this.pixiObject.position.x = v; }
      },
      /**
       * @property    y
       * y座標値
       */
      y: {
        get: function()   { return this.pixiObject.position.y; },
        set: function(v)  { this.pixiObject.position.y = v; }
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
          return phina.geom.Vector2(this.originX, this.originY);
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
        get: function()   { return this.pixiObject.pivot.x / this.width + 0.5; },
        set: function(v)  { this.pixiObject.pivot.x = (v - 0.5) * this.width; }
      },
      
      /**
       * @property    originY
       * y座標値
       */
      originY: {
        get: function()   { return this.pixiObject.pivot.y / this.height + 0.5; },
        set: function(v)  { this.pixiObject.pivot.y = (v - 0.5) * this.height; }
      },
      
      scale: {
        get: function() { return this.pixiObject.scale; },
        set: function(s) { this.pixiObject.scale = s; },
      },
      
      /**
       * @property    scaleX
       * スケールX値
       */
      scaleX: {
        get: function()   { return this.pixiObject.scale.x; },
        set: function(v)  { this.pixiObject.scale.x = v; }
      },
      
      /**
       * @property    scaleY
       * スケールY値
       */
      scaleY: {
        get: function()   { return this.pixiObject.scale.y; },
        set: function(v)  { this.pixiObject.scale.y = v; }
      },
      
      /**
       * @property    width
       * width
       */
      width: {
        get: function()   {
          return (this.boundingType === 'rect') ?
            this.pixiObject.width : this._diameter;
        },
        set: function(v)  { this.pixiObject.width = v; }
      },
      /**
       * @property    height
       * height
       */
      height: {
        get: function()   {
          return (this.boundingType === 'rect') ?
            this.pixiObject.height : this._diameter;
        },
        set: function(v)  { this.pixiObject.height = v; }
      },

      /**
       * @property    radius
       * 半径
       */
      radius: {
        get: function()   {
          return (this.boundingType === 'rect') ?
            (this.width+this.height)/4 : this._radius;
        },
        set: function(v)  {
          this._radius = v;
          this._diameter = this.pixiObject.width = this.pixiObject.height = v*2;
        },
      },
      
      /**
       * @property    top
       * 左
       */
      top: {
        get: function()   {
          var pixiObject = this.pixiObject;
          return pixiObject.position.y - pixiObject.pivot.y - this.height/2 ;
        },
        set: function(v)  {
          var pixi = this.pixiObject;
          pixiObject.position.y = v + pixiObject.pivot.y + this.height/2;
        },
      },
   
      /**
       * @property    right
       * 左
       */
      right: {
        get: function()   {
          var pixiObject = this.pixiObject;
          return pixiObject.position.x + pixiObject.pivot.x + this.width/2;
        },
        set: function(v)  {
          var pixiObject = this.pixiObject;
          pixiObject.position.x = v - pixiObject.pivot.x - this.width/2;
          
        },
      },
   
      /**
       * @property    bottom
       * 左
       */
      bottom: {
        get: function()   {
          var pixiObject = this.pixiObject;
          return pixiObject.position.y + pixiObject.pivot.y + this.height/2;
        },
        set: function(v)  {
          var pixiObject = this.pixiObject;
          pixiObject.position.y = v - pixiObject.pivot.y - this.height/2;
        },
      },
   
      /**
       * @property    left
       * 左
       */
      left: {
        get: function()   {
          var pixiObject = this.pixiObject;
          return pixiObject.position.x + pixiObject.pivot.x - this.width / 2;
        },
        set: function(v)  {
          var pixiObject = this.pixiObject;
          pixiObject.position.x = v - pixiObject.pivot.x + this.width / 2;
        },
      },

      /**
       * @property    centerX
       * centerX
       */
      centerX: {
        get: function()   {
          var pixiObject = this.pixiObject;
          return pixiObject.position.x + pixiObject.pivot.x;
        },
        set: function(v)  {
          // TODO: どうしようかな??
        }
      },
   
      /**
       * @property    centerY
       * centerY
       */
      centerY: {
        get: function()   {
          var pixiObject = this.pixiObject;
          return pixiObject.position.y + pixiObject.pivot.y;
        },
        set: function(v)  {
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
   * 
   */
  phina.define('phina.pixi.PixiScene', {
    superClass: phina.pixi.PixiElement,
    init: function(options) {
      this.superInit(options = (options || {}).$safe(phina.pixi.PixiScene.defaults));

      // this.backgroundColor = (options.backgroundColor) ? options.backgroundColor : null;
      
      this.width = options.width;
      this.height = options.height;
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

    hitTest: function() {
      return true;
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
      },
    }

    
  });
  
}(phina, PIXI));
(function(phina, PIXI) {
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
      return this;
    },

    setFrame: function(x, y, width, height) {
      this._image = this._image.createFrame(x, y, width, height);
      return this;
    },

    _accessor: {
      image: {
        get: function() { return this._image; },
        set: function(v) {
          this.setImage(v);
        }
      },
    }
  });

}(phina, PIXI));
(function(phina, PIXI) {

  /**
   * @class phina.pixi.PixiApp
   * 
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