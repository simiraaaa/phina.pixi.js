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