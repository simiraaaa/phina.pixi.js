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