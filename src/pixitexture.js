(function(phina){
  phina.define('phina.pixi.PixiTexture', {
    superClass: phina.asset.Asset,

    init: function() {
      this.superInit();
    },

    _load: function(resolve) {
      var self = this;
      var texture = phina.asset.Texture();
      texture.load(this.src).then(function(texture) {
        self.pixiTexture = new PIXI.Texture(texture.domElement);
        self.phinaTexture = texture;
        resolve(self);
      });
    },
    
  });

  phina.asset.AssetManager.register('pixi', function(key, path) {
    return phina.pixi.PixiTexture().load(path);
  });
}(phina));