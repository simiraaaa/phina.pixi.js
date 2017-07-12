(function(phina, PIXI) {
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