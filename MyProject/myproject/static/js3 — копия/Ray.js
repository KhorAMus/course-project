var Ray = function(start, end, upScale) {
  this.start = start;
  this.end = end;
  this.upScale = upScale;
}

Ray.prototype.Render = function(context) {
  context.beginPath();
  context.moveTo(this.start.x, this.start.y);
  context.lineTo(this.start.x + this.end.x * this.upScale, this.start.y + this.end.y * this.upScale);
  context.stroke();
} 