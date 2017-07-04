(function(phina, PIXI) {

  phina.define('phina.pixi.PixiUtil', {

    init: function() {

    },

    _static: {
      fitScreen: function(domElement, isEver) {
        isEver = isEver === undefined ? true : isEver;

        var _fitFunc = function() {
          var s = domElement.style;
          
          s.position = "absolute";
          s.margin = "auto";
          s.left = "0px";
          s.top  = "0px";
          s.bottom = "0px";
          s.right = "0px";

          var rateWidth = domElement.width/window.innerWidth;
          var rateHeight= domElement.height/window.innerHeight;
          var rate = domElement.height/domElement.width;
          
          if (rateWidth > rateHeight) {
            s.width  = Math.floor(innerWidth)+"px";
            s.height = Math.floor(innerWidth*rate)+"px";
          }
          else {
            s.width  = Math.floor(innerHeight/rate)+"px";
            s.height = Math.floor(innerHeight)+"px";
          }
        };
        
        // 一度実行しておく
        _fitFunc();

        // リサイズ時のリスナとして登録しておく
        if (isEver) {
          phina.global.addEventListener("resize", _fitFunc, false);
        }
        return _fitFunc;
      },
    }

  });

}(phina, PIXI));