 var GameCanvas = function(x,y, canvas) {
  this.x = x;
  this.y = y;
  canvas.width  = x;
  canvas.height = y;

  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");

  this.player1 = new Shooter(new Vector2(this.canvas.width - this.canvas.width / 4, this.canvas.height - this.canvas.height / 5)
    , new Vector2(this.canvas.height / 3, this.canvas.height / 3), new Vector2(1,0), "../static/Textures/Cowboy1.png");


  this.player2 = new Shooter(new Vector2(0,0),new Vector2(0,0),new Vector2(0,0), "../static/Textures/Cowboy2.png");
  this.text = "";
  this.renderer = new Renderer();
  this.texture = "../static/Textures/town.jpg";
  this.rounds = 5;
  this.current_round = 0;


  this.cowboy1_texture = new Image();
  this.cowboy1_texture.src = "../static/Textures/Cowboy1.png";

  this.cowboy2_texture = new Image();
  this.cowboy2_texture.src = "../static/Textures/Cowboy2.png";

  this.cowboy1_damage_texture = new Image();
  this.cowboy1_damage_texture.src = "../static/Textures/CowboyDamage1.png";

  this.cowboy2_damage_texture = new Image();
  this.cowboy2_damage_texture.src = "../static/Textures/CowboyDamage2.png";

  this.cowboy1_dead_texture = new Image();
  this.cowboy1_dead_texture.src = "../static/Textures/CowboyDead1.png";

  this.cowboy2_dead_texture = new Image();
  this.cowboy2_dead_texture.src = "../static/Textures/CowboyDead2.png";

  this.cowboy1_shooting_texture = new Image();
  this.cowboy1_shooting_texture.src = "../static/Textures/CowboyShooting1.png";

  this.cowboy2_shooting_texture = new Image();
  this.cowboy2_shooting_texture.src = "../static/Textures/CowboyShooting2.png";

  this.round_texture = new Image();
  this.round_texture.src = "../static/Textures/sheriff-badgestressball-superextralarge-224553.png";

  this.town_texture = new Image();
  this.town_texture.src = "../static/Textures/town.jpg";
}

GameCanvas.prototype.Render = function() {

  //this.renderer.WorldRender(this.ctx, this);
  //this.renderer.ShooterRender(this.ctx, this.player1);
  //this.renderer.ShooterRender(this.ctx, this.player2);
  //this.renderer.RoundsRender(this.ctx, this.rounds - this.current_round, new Vector2(this.canvas.height/15 , this.canvas.height/15));
  //this.renderer.TextRender(this.ctx, this.text);

  this.renderer.MasterRenderer3(this.ctx, this, this.player1, this.player2, this.rounds - this.current_round, new Vector2(this.canvas.height/15 , this.canvas.height/15), this.text);

}

GameCanvas.prototype.JsonEncode = function(c) {
  return JSON.stringify(this.x) + ' ' + JSON.stringify(this.y);
}
