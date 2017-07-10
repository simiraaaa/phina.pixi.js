
var TEST_MAP = {
  Element_defaults: {
    init: function(){
      this.superInit();
      var PixiElement = phina.pixi.PixiElement;
      var defaults = PixiElement.defaults;
      // PixiElementはwidth, heightは常に0なのでSpriteでテスト
      var elm = phina.pixi.PixiSprite();
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

        var elm = phina.pixi.PixiSprite();
        var currentValues = {};
        for(var k2 in changeMap) {
          currentValues[k2] = elm[k2];
        }
        elm[k] = currentValues[k] = changeMap[k]; 
        console.assert(temp = elm[k] === currentValues[k], k + ':' + elm[k]);
        flag = flag || !temp;
        // for(var k2 in changeMap) {
        //   console.assert(temp = elm[k2] === currentValues[k2], k2 + ':' + elm[k2]);
        //   flag = flag || temp;
        // }
      }
      assertMessage(flag);
    },
  },

};
if(location.href.indexOf('index.html') === -1) {
  TEST_MAP.forIn(function(className, properties){
    properties.superClass = properties.superClass || phina.pixi.PixiScene;
    phina.define('TEST_' + className, properties);
  });
  var app;
  phina.main(function(){
    app = phina.pixi.PixiApp({}).run().enableStats();
    replaceSceneByHash();
  });
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
    button.style.width = '100%';
    button.onclick = function() {
      var f = document.getElementById('frame');
      var w = f.contentWindow;
      w.location.hash = this.textContent;
      w.replaceSceneByHash();
    };

    document.getElementById('side').appendChild(button);
  }
}

function testAll(){
  console.log('全てのシーンをテストします。テストとして保証できるのは init のみです。');
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
  if(flag) {
    var title = location.hash.slice(1);
    alert(title + '\nテストに失敗しました。\n開発者ツールを確認して下さい。');
  }
  else {
    console.log(location.hash + ': OK')
  }
}

onerror = function(a,b,c,d,e) {
  alert('エラーが発生しました。\n' + e.stack);
};