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