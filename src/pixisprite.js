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