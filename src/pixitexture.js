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
      newTexture.phinaTexture = this.phinaTexture;
      newTexture.pixiTexture = new PIXI.Texture(this.pixiTexture.baseTexture, new PIXI.math.Rectangle(x, y, width, height));

      return newTexture;
    },
    
    setKey: function(key) {
      this.key = key;
      return this;
    }
    
  });

  phina.asset.AssetLoader.register('pixi', function(key, path) {
    return phina.pixi.PixiTexture().setKey(key).load(path);
  });

}(phina, PIXI));