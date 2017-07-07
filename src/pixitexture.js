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
        var canvas = document.createElement('canvas');
        self.context = canvas.getContext('2d');
        self.canvas = canvas;
        canvas.width = texture.domElement.naturalWidth;
        canvas.height = texture.domElement.naturalHeight;
        self.context.drawImage(texture.domElement, 0, 0, canvas.width, canvas.height);
        self.pixiTexture = PIXI.Texture.fromCanvas(canvas);
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

  phina.asset.AssetLoader.register('pixi', function(key, path) {
    return phina.pixi.PixiTexture().load(path);
  });

}(phina, PIXI));