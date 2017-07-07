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