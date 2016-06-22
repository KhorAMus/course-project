var Color = function(r,g,b,a) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
}

var Color = function(color) {
  this.r = color.r;
  this.g = color.g;
  this.b = color.b;
  this.a = color.a;
}
Color.prototype.SetAll = function(c) {
    this.r = c.r;
    this.g = c.g;
    this.b = c.b;
    this.a = c.a;
}

Color.prototype.ToStrokeStyleColor = function() {
  return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")"
}