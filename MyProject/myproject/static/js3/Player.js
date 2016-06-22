var Player = function(player) {
  this.view = player.view;
  this.player_object = player.player_object;
  this.motion = player.motion;
  this.friendly_motions = player.friendly_motions;
}

var Player = function(view, motion_vector, player_object, move_power) {
  this.view = view;
  this.player_object = player_object;
  this.motion = new Motion();
  this.friendly_motions = [];
}

var To_ang = 180/Math.PI;
var To_rad = Math.PI/180

Player.prototype.Render = function(context) {


  var nv =this.motion.motion_vector.normalize();
  var v = this.view.normalize();
  var angle = (v.angle(nv));
  if(nv.x<0)
    angle*=-1;



  this.player_object.Render(context, angle);
  context.strokeStyle = "rgba(0, 0, 0, 0.5)";
  context.lineWidth = 5;
  new Ray(this.player_object.position,  this.player_object.motion_vector, this.player_object.radius ).Render(context);
  context.lineWidth = 3;
  context.strokeStyle = new Color(this.motion.motion_color).ToStrokeStyleColor();
  new Ray(this.player_object.position,  this.motion.motion_vector, this.player_object.radius / this.motion.move_power).Render(context);

  //new Ray(this.player_object.position,  this.view, this.player_object.radius ).Render(context);

  for(var i = 0; i < this.friendly_motions.length; i++ )
    {
      context.strokeStyle = new Color(this.friendly_motions[i].motion_color).ToStrokeStyleColor();
      new Ray(this.player_object.position,  this.friendly_motions[i].motion_vector, this.player_object.radius / this.motion.move_power).Render(context);
    }
  
  
}

Player.prototype.SetAll = function(c) {
  this.view.SetAll(c.view);
  this.player_object.SetAll(c.player_object);
  this.motion.SetAll(c.motion);
  this.friendly_motions = c.friendly_motions;
}