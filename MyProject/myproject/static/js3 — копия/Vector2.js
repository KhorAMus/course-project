 var Vector2 = function(x,y) {
  this.x = x;
  this.y = y;
}


Vector2.prototype.length = function() {
  return (Math.abs(Math.sqrt(this.x * this.x + this.y * this.y)));
}

Vector2.prototype.normalize = function() {
  if(this.length() != 0)
    return new Vector2(this.x / this.length(), this.y / this.length());
  else
    return new Vector2(0,0);
}

Vector2.prototype.dot_product = function(vec2) {
  return (this.x * vec2.x + this.y * vec2.y);
}

Vector2.prototype.angle = function(vec2) {
  if( this.length() != 0 && vec2.length() != 0)
    return Math.acos((this.dot_product(vec2) / this.length() * vec2.length()));
  else 
    return 0;
}

Vector2.prototype.Render = function(context) {
  context.beginPath();
  context.moveTo(0,0);
  context.lineTo(this.x,this.y);
  context.stroke();
}

Vector2.prototype.Decode_json = function(c) {
  this.x = c.x;
  this.y = c.y;
}

Vector2.prototype.JsonEncode = function(c) {
  return JSON.stringify(this.x) + ' ' + JSON.stringify(this.y);
}
