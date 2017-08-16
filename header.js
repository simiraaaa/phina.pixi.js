/*
MIT License

Copyright (c) 2017 simiraaaa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

@version <%= VERSION %>
*/

if (typeof phina === 'undefined') {
  throw new Error('phina.jsを先に読み込んでください。 Load phina.js before.');
}

if (typeof PIXI === 'undefined') {
  throw new Error('pixi.jsを先に読み込んでください。 Load pixi.js before.');
}

if (PIXI.VERSION[0] !== '3') {
  console.warn('pixi.js は v3 を使用してください。')
}

phina.pixi = {
  VERSION: '<%= VERSION %>',
  globalMap: {
    PixiElement: 'DisplayElement',
    PixiSprite: 'Sprite',
    PixiTexture: 'Texture',
    PixiScene: 'DisplayScene',
    PixiRenderer: 'Renderer',
    PixiApp: 'App',
    PixiUtil: 'Util',
    PixiLabel: 'Label',
  },
  globalize: function() {
    var global = phina.global;
    var pixi = phina.pixi;
    
    pixi.globalMap.forIn(function(name, globalName) {
      global[globalName] = pixi[name];
    });
  }
};

