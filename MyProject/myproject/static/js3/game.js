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

$(document).keydown(function (e) {
  keys[e.which] = true;
  socket.send("Command KeyDown " + e.which);
      //console.log("Key Down " + e.which);
    });

$(document).keyup(function (e) {
       // delete keys[e.which];
       keys[e.which] = false;
       socket.send("Command KeyUp " + e.which);
      //console.log("Key Up " + e.which);
    });

var glw = new GL_window(document.getElementById('glgame'));
var tr = 0;

var renderer = new Renderer();
keys = {};
commands = undefined;
canvas = document.getElementById('game');
canvas2 = document.getElementById('game2');
context = canvas.getContext('2d');
context2 = canvas2.getContext('2d');
socket = new SocketConnection();
var img = new Image();
img.src = "../static/Textures/Seamless/tileable-classic-nebula_512_512.jpg";
var client_ship = new Ship("../static/Textures/Ships/ship3.png");

var time = Date.now();
function getFPS(){
  var nowTime = Date.now();
  var fps = 1000.0 / (nowTime - time);
  time = nowTime;
  return fps;
}


window.onload = function () {

}



canvas.addEventListener("mousedown", mouseMove, false);
canvas.addEventListener("mousemove", mouseMove, false);

canvas2.addEventListener("mousedown", mouseMove, false);
canvas2.addEventListener("mousemove", mouseMove, false);

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
  socket.send("Command MousePosition " + new Vector2(mouseX , mouseY).JsonEncode()) ;
  /* do something with mouseX/mouseY */
}

function kbUse(commands, context, canvas) {
  if (commands ){
    canvas.height = commands.area.height;
    canvas.width = commands.area.width;
    client_ship.Decode_json(commands.client.client_ship);
    //ship.Decode_json(commands.ship);
    //for(var i=0; i< commands.ships.length; i++){
      renderer.SetShips(commands.ships);
    //}

    //for(var i=0; i< commands.planets.length; i++){
      renderer.SetPlanets(commands.planets);
    //}

  }
}


animLoop();

function printSineAndCosineForAnAngle(angleInDegrees, n) {
  var angleInRadians = angleInDegrees * Math.PI / 180;
  var s = Math.sin(angleInRadians);
  var c = Math.cos(angleInRadians);
  //console.log("s = " + s + " c = " + c);
        var navigation = {
    scale: [0.5,0.3],
    tratslate : [0, 0],
    rotate: [s, c]
  }
  return navigation;
}

function animLoop() {
  var navigation = printSineAndCosineForAnAngle(tr);
  tr-=1;

  glw.drawScene(navigation);
        //console.log(getFPS());
        kbUse(commands, context, canvas);

        context.clearRect(0,0,canvas.width,canvas.height);


      var ptrn = context.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
      context.fillStyle = ptrn; 
      context.fillRect(0, 0, canvas.width, canvas.height); // context.fillRect(x, y, width, height);

      renderer.MasterRenderer(context);


      context2.clearRect(0,0,canvas.width,canvas.height);
      context2.fillStyle = "rgba(255, 0, 0, 0.4)";
      context2.fillRect(0,0,canvas.width,canvas.height);
      context2.drawImage(canvas, client_ship.position.x - canvas2.width/2, client_ship.position.y - canvas2.height/2, canvas2.width, canvas2.height, 0,0, canvas2.width, canvas2.height);


      requestAnimFrame(animLoop);

    }

  });
