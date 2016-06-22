var canvas = document.getElementById('game_canvas');
var game = new GameCanvas(500,500, canvas);

$(function() {

  window.requestAnimFrame = (function(){
    return      function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element){
    window.setTimeout(callback, 1000 / 60)||
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame 
  };
})();

//При нажатии клавишиинформация об этом поступает на сервер
keys = {};
$(document).keydown(function (e) {
      keys[e.which] = true;
      sc.send(JSON.stringify({'cmd' : ['key_down'], 'key':  e.which})  );
    });

$(document).keyup(function (e) {
      keys[e.which] = false;
      sc.send(JSON.stringify({'cmd' : ['key_up'], 'key':  e.which})  );
    });
//////////////////////////////////////////////////////////////////

//При движении курсора по канвасу с игрой, информация поступает на сервер
function mouseMove(e)
{
  var mouseX, mouseY;

  if(e.offsetX) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  }
  else if(e.layerX) {
    mouseX = e.layerX;
    mouseY = e.layerY;
  }
  sc.send(JSON.stringify({'cmd' : ['mouse_position'], 'pos':  new Vector2(mouseX , mouseY).JsonEncode()})  );
}
document.getElementById('game_canvas').addEventListener("mousemove", mouseMove, false);
////////////////////////////////////////////////////////////////////////

animLoop();

function animLoop() {

      requestAnimFrame(animLoop);
      game.Render();
    }

  });
