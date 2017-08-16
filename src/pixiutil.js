(function(phina, PIXI) {

  var PixiUtil = phina.define('phina.pixi.PixiUtil', {

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

      mulMatVec2: function(mat, vec2) {
        var vx = mat.a*vec2.x + mat.b*vec2.y + mat.tx;
        var vy = mat.c*vec2.x + mat.d*vec2.y + mat.ty;
        
        return phina.geom.Vector2(vx, vy);
      },

      hslToNumber: function (h, s, l) {
        var r, g, b, max, min;
        if (l <= 49) {
          max = 2.55 * (l + l * (s / 100));
          min = 2.55 * (l - l * (s / 100));
        }
        else {
          max = 2.55 * (l + (100 - l) * (s / 100));
          min = 2.55 * (l - (100 - l) * (s / 100));
        }
        h %= 360;
        while (h < 0) h += 360;
        if (h < 60) {
          r = max;
          g = (h / 60) * (max - min) + min;
          b = min;
        }
        else if (h < 120) {
          r = ((120 - h) / 60) * (max - min) + min;
          g = max;
          b = min;
        }
        else if (h < 180) {
          r = min;
          g = max;
          b = ((h - 120) / 60) * (max - min) + min;
        }
        else if (h < 240) {
          r = min;
          g = ((240 - h) / 60) * (max - min) + min;
          b = max;
        }
        else if (h < 300) {
          r = ((h - 240) / 60) * (max - min) + min;
          g = min;
          b = max;
        }
        else {
          r = max;
          g = min;
          b = ((360 - h) / 60) * (max - min) + min;
        }
        return (r << 16) | (g << 8) | b;
      },

      colorStringToNumber: function (str) {
        if (str[0] === '#') {
          if (str.length === 4) {
            var r = str[1];
            var g = str[2];
            var b = str[3];
            return parseInt(r + r + g + g + b + b, 16);
          }
          return parseInt(str.substr(1), 16);
        }
        if (/rgb/.test(str)) {
          var rgb = str.match(/\d+/g);
          return (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
        }
        if (/hsl/.test(str)) {
          var hsl = str.match(/\d+/g);
          return PixiUtil.hslToNumber(hsl[0] | 0, hsl[1] | 0, hsl[2] | 0);
        }
        return PixiUtil.COLOR_MAP[str] || 0;
      },

      COLOR_MAP: {
        "black": 0,
        "silver": 12632256,
        "gray": 8421504,
        "white": 16777215,
        "maroon": 8388608,
        "red": 16711680,
        "purple": 8388736,
        "fuchsia": 16711935,
        "green": 32768,
        "lime": 65280,
        "olive": 8421376,
        "yellow": 16776960,
        "navy": 128,
        "blue": 255,
        "teal": 32896,
        "aqua": 65535,
        "orange": 16753920,
        "aliceblue": 15792383,
        "antiquewhite": 16444375,
        "aquamarine": 8388564,
        "azure": 15794175,
        "beige": 16119260,
        "bisque": 16770244,
        "blanchedalmond": 16772045,
        "blueviolet": 9055202,
        "brown": 10824234,
        "burlywood": 14596231,
        "cadetblue": 6266528,
        "chartreuse": 8388352,
        "chocolate": 13789470,
        "coral": 16744272,
        "cornflowerblue": 6591981,
        "cornsilk": 16775388,
        "crimson": 14423100,
        "cyan": 65535,
        "darkblue": 139,
        "darkcyan": 35723,
        "darkgoldenrod": 12092939,
        "darkgray": 11119017,
        "darkgreen": 25600,
        "darkgrey": 11119017,
        "darkkhaki": 12433259,
        "darkmagenta": 9109643,
        "darkolivegreen": 5597999,
        "darkorange": 16747520,
        "darkorchid": 10040012,
        "darkred": 9109504,
        "darksalmon": 15308410,
        "darkseagreen": 9419919,
        "darkslateblue": 4734347,
        "darkslategray": 3100495,
        "darkslategrey": 3100495,
        "darkturquoise": 52945,
        "darkviolet": 9699539,
        "deeppink": 16716947,
        "deepskyblue": 49151,
        "dimgray": 6908265,
        "dimgrey": 6908265,
        "dodgerblue": 2003199,
        "firebrick": 11674146,
        "floralwhite": 16775920,
        "forestgreen": 2263842,
        "gainsboro": 14474460,
        "ghostwhite": 16316671,
        "gold": 16766720,
        "goldenrod": 14329120,
        "greenyellow": 11403055,
        "grey": 8421504,
        "honeydew": 15794160,
        "hotpink": 16738740,
        "indianred": 13458524,
        "indigo": 4915330,
        "ivory": 16777200,
        "khaki": 15787660,
        "lavender": 15132410,
        "lavenderblush": 16773365,
        "lawngreen": 8190976,
        "lemonchiffon": 16775885,
        "lightblue": 11393254,
        "lightcoral": 15761536,
        "lightcyan": 14745599,
        "lightgoldenrodyellow": 16448210,
        "lightgray": 13882323,
        "lightgreen": 9498256,
        "lightgrey": 13882323,
        "lightpink": 16758465,
        "lightsalmon": 16752762,
        "lightseagreen": 2142890,
        "lightskyblue": 8900346,
        "lightslategray": 7833753,
        "lightslategrey": 7833753,
        "lightsteelblue": 11584734,
        "lightyellow": 16777184,
        "limegreen": 3329330,
        "linen": 16445670,
        "mediumaquamarine": 6737322,
        "mediumblue": 205,
        "mediumorchid": 12211667,
        "mediumpurple": 9662683,
        "mediumseagreen": 3978097,
        "mediumslateblue": 8087790,
        "mediumspringgreen": 64154,
        "mediumturquoise": 4772300,
        "mediumvioletred": 13047173,
        "midnightblue": 1644912,
        "mintcream": 16121850,
        "mistyrose": 16770273,
        "moccasin": 16770229,
        "navajowhite": 16768685,
        "oldlace": 16643558,
        "olivedrab": 7048739,
        "orangered": 16729344,
        "orchid": 14315734,
        "palegoldenrod": 15657130,
        "palegreen": 10025880,
        "paleturquoise": 11529966,
        "palevioletred": 14381203,
        "papayawhip": 16773077,
        "peachpuff": 16767673,
        "peru": 13468991,
        "pink": 16761035,
        "plum": 14524637,
        "powderblue": 11591910,
        "rosybrown": 12357519,
        "royalblue": 4286945,
        "saddlebrown": 9127187,
        "salmon": 16416882,
        "sandybrown": 16032864,
        "seagreen": 3050327,
        "seashell": 16774638,
        "sienna": 10506797,
        "skyblue": 8900331,
        "slateblue": 6970061,
        "slategray": 7372944,
        "slategrey": 7372944,
        "snow": 16775930,
        "springgreen": 65407,
        "steelblue": 4620980,
        "tan": 13808780,
        "thistle": 14204888,
        "tomato": 16737095,
        "turquoise": 4251856,
        "violet": 15631086,
        "wheat": 16113331,
        "whitesmoke": 16119285,
        "yellowgreen": 10145074,
        "rebeccapurple": 6697881
      },

    }
  });

}(phina, PIXI));