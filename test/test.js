
var TEST_MAP = {
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
      seeMessage();
    }
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
      controllMessage();
    }
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
        parent.postMessage('loaded', '*');
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
    button.style.width = '100%';
    button.onclick = function() {
      var f = document.getElementById('frame');
      var w = f.contentWindow;
      location.hash = w.location.hash = this.textContent;
      w.replaceSceneByHash();
    };

    document.getElementById('side').appendChild(button);
  }

  onmessage = function(e) {
    if(e.data === 'loaded'){
      hideLoading();
      var f = document.getElementById('frame');
      var w = f.contentWindow;
      w.location.hash = location.hash;
      w.replaceSceneByHash();
    }
    else if (e.data.id){
      var b = document.getElementById('b_' + e.data.id);
      if(b) {
        b.style.backgroundColor = e.data.success ? 'rgb(180, 245, 240)' : 'pink';
      }
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
  if((location.hash.slice(1)) in TEST_MAP) {
    app.replaceScene(phina.using('TEST_' + location.hash.slice(1))());
  }
}
function assertMessage(flag) {
  var title = location.hash.slice(1);
  parent.postMessage({id: title, success: !flag}, '*');
  if(flag) {
    alert(title + '\nテストに失敗しました。\n開発者ツールを確認して下さい。');
  }
  else {
    console.log(location.hash + ': OK');
  }
}

function seeMessage() {
  console.log(location.hash + ': このテストは目視で確認してください。');
}
function controllMessage() {
  console.log(location.hash + ': このテストは操作して確認してください。');
}