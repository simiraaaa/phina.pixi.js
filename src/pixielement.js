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