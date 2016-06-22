var Ship = function(img) {
  this.angle = 0;
  this.size = new Vector2(1,1);
  this.position = new Vector2(0,0)
  this.img = new Image();
  this.img.src = img;
}



var To_ang = 180/Math.PI;
var To_rad = Math.PI/180;

Ship.prototype.Render = function(context) {
  context.save();
  context.translate(this.position.x , this.position.y);
  context.rotate(this.angle );
  //console.log(this.angle*To_ang);
  this.Draw(context);
  context.restore();
}

Ship.prototype.Draw = function(context){
  //context.fillStyle = 'green';
  //context.fillRect( -this.size.x/2, -this.size.y/2, this.size.x, this.size.y);
  //context.lineWidth = 5;
  //context.strokeStyle = '#003300';
  //context.stroke();

  context.drawImage(this.img, -this.size.x/2, -this.size.y/2, this.size.x, this.size.y);
}

Ship.prototype.Decode_json = function(c) {
  this.angle = c.angle;
  this.size.Decode_json(c.size);
  this.position.Decode_json(c.position);
}



function Resize(img, newsizex, newsizey){
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width=newsizex;
    canvas.height=newsizey;
    ctx.drawImage(img, 0, 0, newsizex, newsizey);
    return canvas;
  }