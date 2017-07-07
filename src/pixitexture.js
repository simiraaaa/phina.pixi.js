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
        self.pixiTexture = new PIXI.Texture(texture.domElement);
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

  phina.asset.AssetLoader.assetLoadFunctions.pixi = function(key, path) {
    return phina.pixi.PixiTexture().load(path);
  };

}(phina, PIXI));