 var Motion = function(motion_vector, move_power, motion_color) {
  this.motion_vector = motion_vector;
  this.move_power = move_power;
  this.motion_color = motion_color;
}

var Motion = function(motion) {
  this.motion_vector = motion.motion_vector;
  this.move_power = motion.move_power;
  this.motion_color = motion.motion_color;
}

var Motion = function() {
  this.motion_vector = new Vector2(0,0);
  this.move_power = 0;
  this.motion_color = new Color(0,0,0,0);
}

Motion.prototype.SetAll = function(c) {
  this.motion_vector.SetAll(c.motion_vector);
  this.move_power = c.move_power;
  this.motion_color.SetAll(c.motion_color);
}
