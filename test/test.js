
var TEST_MAP = {
  globalize: {
    init: function() {
      this.superInit();
      phina.globalize();
      phina.pixi.globalize();
      var layer = DisplayElement().addChildTo(this);
      Sprite('tomapiko').addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.center());

      Sprite(Texture.fromShape(TriangleShape())).addChildTo(layer)
      .setPosition(this.gridX.center(), this.gridY.center());
    },

    see: true,
  },

  Element_defaults: {
    init: function(){
      this.superInit();
      var PixiElement = phina.pixi.PixiElement;
      var defaults = PixiElement.defaults;
      var elm = PixiElement();
      var flag = false;
      var temp = false;
      for(var k in defaults) {
        console.assert(temp = defaults[k] === elm[k], k);
        flag = flag || !temp;
      }
      assertMessage(flag);
    },
  },
  
  Element_changes: {
    init: function(){
      this.superInit();
      var changeMap = {
        width: 100,
        scaleX: 5,
        scaleY: -5,
        height: 50,
        rotation: 100,
        originX: 0,
        originY: -5,
        x: 10,
        y: -100,

        top: 1,
        left: 10,
        bottom: -10,
        right: 1,

        blendMode: 'lighter',
      };

      var flag = false;
      var temp = false;
      for(var k in changeMap) {

        var elm = phina.pixi.PixiElement();
        var currentValues = {};
        for(var k2 in changeMap) {
          currentValues[k2] = elm[k2];
        }
        elm[k] = currentValues[k] = changeMap[k]; 
        console.assert(temp = elm[k] === currentValues[k], k + ':' + elm[k]);
        flag = flag || !temp;
      }
      assertMessage(flag);
    },
  },

  Sprite_init: {
    init:function() {
      this.superInit();
      phina.pixi.PixiSprite('tomapiko').addChildTo(this).setPosition(300, 400);
    },

    see: true,
  },

  hitTestRect: {
    init: function() {
      this.superInit();
      this.sp = phina.pixi.PixiSprite('tomapiko').addChildTo(this).setPosition(300, 400);
    },

    onenter: function() {
      app._draw();
      console.assert(this.sp.hitTest(300, 400), 'hitTestRect');
      assertMessage(!this.sp.hitTest(300, 400));
    },
  },

  hitTestCircle: {
    init: function() {
      this.superInit();
      this.sp = phina.pixi.PixiSprite('tomapiko').addChildTo(this).setPosition(300, 400);
      this.sp.boundingType = 'circle';
    },
    
    onenter: function() {
      app._draw();
      console.assert(this.sp.hitTest(300, 400), 'hitTestRect');
      assertMessage(!this.sp.hitTest(300, 400));
    },
  },

  hitTestElement: {
    init: function() {
      this.superInit();
      var sprite = this.sprite = Sprite().fromShape(RectangleShape({
        fill: 'orange',
        padding: 0
      })).addChildTo(this);
      Draggable().attachTo(sprite);
      sprite.setPosition(this.gridX.center(), this.gridY.center());
      var shape = this.shape = RectangleShape({
        padding: 0,
      });
      var rect = this.rect = Sprite().fromShape(shape).addChildTo(this);
      rect.setPosition(this.gridX.center(2), this.gridY.center(2));
      Draggable().attachTo(rect);
    },
    control: true,
    update: function(app) {
      if(this.sprite.hitTestElement(this.rect)) {
        this.shape.fill = 'red';
      }
      else {
        this.shape.fill = 'blue';
      }

      if(this.shape._dirtyDraw) {
        this.shape.render(this.shape.canvas);
        this.rect.updateTexture();
      }
    }
  },

  Sprite_interactive: {
    init:function() {
      this.superInit();
      var sprite = phina.pixi.PixiSprite('tomapiko').addChildTo(this).setPosition(300, 400);

      sprite.setInteractive(true);
      sprite.fx = sprite.fy = 0;
      sprite.onpointstart = function() {
        this.fx = this.fy = 0;
        this.setScale(0.5);
      };
      sprite.onpointend = function(e) {
        this.fx = e.pointer.fx;
        this.fy = e.pointer.fy;
        this.setScale(1);
      };
      sprite.onpointmove = function(e) {
        var p = e.pointer;
        if(p.getPointing()) {
          this.x += p.dx;
          this.y += p.dy;
        }
      };
      var self = this;
      sprite.update = function() {
        var x = this.x += this.fx;
        var y = this.y += this.fy;

        if(x < 0 || x > self.width) {
          this.x = Math.clamp(x, 0, self.width);
          this.fx *= -1;
          this.scaleX *= -1;
        }

        if(y < 0 || y > self.height) {
          this.y = Math.clamp(y, 0, self.height);
          this.fy *= -1;
          this.scaleY *= -1;
        }

        this.fx *= 0.95;
        this.fy *= 0.95;
      };
    },

    control: true,
  },

  Sprite_origin: {
    init: function (){
      this.superInit();
      var Sprite = phina.pixi.PixiSprite;
      var topleft = Sprite('tomapiko').addChildTo(this).setOrigin(0, 0);
      var bottomright = Sprite('tomapiko').addChildTo(this).setOrigin(1, 1).setPosition(this.width, this.height);
      var temp = false;
      var flag = false;
      console.assert(temp = this.width === bottomright.right, 'right');
      flag = flag || !temp;
      console.assert(temp = this.height === bottomright.bottom, 'bottom');
      flag = flag || !temp;
      console.assert(temp = 0 === topleft.top, 'top');
      flag = flag || !temp;
      console.assert(temp = 0 === topleft.left, 'left');
      assertMessage(flag);
    }
  },

  Sprite_rect: {
    init: function() {
      this.superInit();
      var Sprite = phina.pixi.PixiSprite;
      var sp = Sprite('tomapiko').addChildTo(this);
      var originStep = 0.5;
      var originStart = -5;
      var originEnd = 5;
      var xStep = this.width / 10;
      var xStart = -this.width;
      var xEnd = this.width * 2;
      
      var yStep = this.height / 10;
      var yStart = -this.height;
      var yEnd = this.height * 2;
      
      var temp = false;
      var flag = false;
      
      var rect = phina.geom.Rect();
      rect.width = sp.width;
      rect.height = sp.height;
      var props = 'left,right,top,bottom,centerX,centerY'.split(',');
      Array.range(originStart, originEnd, originStep).forEach(function(i) {
        sp.setOrigin(i);
        Array.range(xStart, xEnd, xStep).forEach(function(x) {
          sp.x = x;
          rect.x = x - rect.width * i;
          Array.range(yStart, yEnd, yStep).forEach(function(y){
            sp.y = y;
            rect.y = y - rect.height * i;
            props.forEach(function(p){
              // 誤差調整
              var rp = rect[p];
              var spp = sp[p];
              rp = Math.round(rp);
              spp = Math.round(spp);
              console.assert(temp = rp === spp, p + ':' + rp + ', ' + spp);
              flag = flag || !temp;
            });
          });
        });
      });

      assertMessage(flag);
      if(!flag) sp.setPosition(320, 480).setOrigin(0.5);
    }
  },

  visualProperties: {
    init: function() {
      this.superInit();
      var sp = phina.pixi.PixiSprite('tomapiko')
        .addChildTo(this)
        .setPosition(this.gridX.center(1), this.gridY.center(1));
      sp.tweener.to({
        rotation: 720,
        alpha: 0,
        width: 100,
        height: 100,
      }, 2000, 'swing').to({
        alpha: 1,
        scaleX: -2,
        scaleY: 2,
      }, 2000, 'easeInBack').to({
        rotation: 0,
      }).to({
        scaleX: 1,
        scaleY: -1
      }).setLoop(true);
    },
    see: true,
  },

  TextureFromShape: {
    init: function() {
      this.superInit();
      var shape = phina.display.StarShape();
      var texture = phina.pixi.PixiTexture.fromShape(shape);
      var sprite = phina.pixi.PixiSprite(texture).addChildTo(this);
      sprite.setPosition(this.gridX.center(), this.gridY.center());
      sprite.tweener.to({
        rotation: 720
      });
    },

    see: true,
  },

  SpriteFromShape: {
    init: function() {
      this.superInit();
      var shape = phina.display.HeartShape();
      var sprite = phina.pixi.PixiSprite().fromShape(shape).addChildTo(this);
      sprite.setPosition(this.gridX.center(), this.gridY.center());
      sprite.tweener.to({
        rotation: 720
      });
    },

    see: true,
  },

  SpriteFrame: {
    init: function() {
      this.superInit();
      var sprite = phina.pixi.PixiSprite('tomapiko').addChildTo(this);
      sprite.setPosition(this.gridX.center(), this.gridY.center());
      sprite.setFrame(0, 0, sprite.width, sprite.height / 2);
      sprite.setOrigin(0.5, 1);

      var sprite2 = phina.pixi.PixiSprite('tomapiko').addChildTo(this);
      sprite2.setPosition(this.gridX.center(), this.gridY.center());
      sprite2.setFrame(0, sprite2.height / 2, sprite2.width, sprite2.height / 2);
      sprite2.setOrigin(0.5, 0);
      
      var self = this;

      sprite.tweener
      .by({
        y: -100,
      }, 1000, 'swing')
      .by({
        y: 100
      }, 500, 'easeInBack')
      .wait(500)
      .setLoop(true);
      
      sprite2.tweener
      .by({
        y: 100,
      }, 1000, 'swing')
      .by({
        y: -100
      }, 500, 'easeInBack')
      .call(function(){
        phina.pixi.PixiSprite()
        .fromShape(phina.display.StarShape())
        .addChildTo(self)
        .setPosition(sprite2.x, sprite2.y)
        .tweener.to({
          scaleX: 5,
          scaleY: 5,
          alpha: 0,
        }, 500, 'easeOutCirc').call(function() {
          this.target.remove();
        });
      })
      .wait(500)
      .setLoop(true);
    },
    see: true
  },

  PixiLabel: {
    init: function() {
      this.superInit();
      var label = phina.pixi.PixiLabel({
        text: 1234,
        fontSize: 50,
      }).addChildTo(this);
      label.setPosition(this.gridX.center(), this.gridY.center());
      label.update = function(){
        this.text++;
      };
      
      Draggable().attachTo(label);
      
      label.onpointstart = function(){
        this.fill = 'red';
        this.stroke = 'black';
        this.fontSize = 100;
      };
      label.onpointend = function(){
        this.fill = 'black';
        this.stroke = false;
        this.fontSize = 50;
      };
      
    },
    control: true,
  },

};

var ASSETS = {
  pixi: {
    tomapiko: 'https://raw.githubusercontent.com/phinajs/phina.js/develop/assets/images/tomapiko.png',
  }
};

if(location.href.indexOf('index.html') === -1) {
  TEST_MAP.forIn(function(className, properties){
    properties.superClass = properties.superClass || phina.pixi.PixiScene;
    phina.define('TEST_' + className, properties);
  });
  var app;
  var isLoading = true;
  phina.main(function(){
    app = phina.pixi.PixiApp({}).run().enableStats();
    app.pushScene(phina.game.LoadingScene({assets: ASSETS}).on('loaded', function(){
      isLoading = false;
      if(window !== parent) {
        post('loaded');
      }
    }));
  });
  
  onerror = function(e) {
    console.error(e);
    alert('エラーが発生しました。\n' + e);
  };
}
else {

  var button = document.createElement('button');
  button.textContent = 'ALL';
  button.id = 'b_ALL';
  button.style.width = '100%';
  button.onclick = function() {
    var f = document.getElementById('frame');
    var w = f.contentWindow;
    w.testAll();
  };

  document.getElementById('side').appendChild(button);
  for(var k in TEST_MAP) {
    var button = document.createElement('button');
    button.textContent = k;
    button.id = 'b_' + k;
    button.dataset.hash = k;
    button.style.width = '100%';
    if(TEST_MAP[k].see) {
      button.style.backgroundColor = 'navy';
      button.style.color = 'white';
      button.textContent = 'see: ' + k;
    }
    if(TEST_MAP[k].control) {
      button.style.backgroundColor = 'orange';
      button.textContent = 'control: ' + k;
    }
    button.onclick = function() {
      var f = document.getElementById('frame');
      var w = f.contentWindow;
      location.hash = w.location.hash = this.dataset.hash;
      w.replaceSceneByHash();
    };

    document.getElementById('side').appendChild(button);
  }

  onmessage = function(e) {
    var data = e.data;
    var type = data.type;
    var id = data.id;
    var b = document.getElementById('b_' + id);
    if(!b) {
      b = {style: {}, dataset: {}};
    }
    var style = b.style;

    var beforeText = '';
    var afterText = '';

    if(data === 'loaded'){
      hideLoading();
      var f = document.getElementById('frame');
      var w = f.contentWindow;
      document.getElementById('b_ALL').click();
      w.alertFlag = true;

      w.location.hash = location.hash;
      w.replaceSceneByHash();
    }
    else if (type === 'assert'){
      style.backgroundColor = data.success ? 'rgb(180, 245, 240)' : 'pink';
      afterText = data.success ? ' (success)' : '(failure)';
    }

    if(beforeText) {
      b.textContent = beforeText + b.dataset.hash;
    }

    if(afterText) {
      b.textContent = b.dataset.hash + afterText;
    }
  };

  showLoading();
  function hideLoading() {
    document.getElementById('loading').style.display = 'none';
  }
  function showLoading(){
    document.getElementById('loading').style.display = 'flex';
  }
}

function testAll(){
  console.log('全てのシーンをテストします。テストとして保証できるのは init, onenter のみです。');
  TEST_MAP.forIn(function(k, v){
    location.hash = k;
    replaceSceneByHash();
  });
}

function replaceSceneByHash(){
  if(getId() in TEST_MAP) {
    app.replaceScene(phina.using('TEST_' + getId())());
  }
}

var alertFlag = false;

function assertMessage(flag) {
  var title = getId();
  post({
    id: title,
    success: !flag,
    type: 'assert',
  });
  if(flag && alertFlag) {
    alert(title + '\nテストに失敗しました。\n開発者ツールを確認して下さい。');
  }
  else {
    console.log(location.hash + ': OK');
  }
}

function getId() {
  return location.hash.slice(1);
}

function seeMessage() {
  console.log(location.hash + ': このテストは目視で確認してください。');
  post({
    id: getId(),
    type: 'see'
  });
}
function controlMessage() {
  console.log(location.hash + ': このテストは操作して確認してください。');
  post({
    id: getId(),
    type: 'control'
  });
}

function post(data) {
  return parent.postMessage(data, '*');
}