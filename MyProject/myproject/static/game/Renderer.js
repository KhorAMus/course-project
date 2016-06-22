 var Renderer = function() {
  this.ff = 0;
}


Renderer.prototype.WorldRender = function(context, world) {
  var img = new Image();
  img.onload = function () {
      context.drawImage(img, 0, 0, world.canvas.width, world.canvas.height);
    }
  img.src = world.texture;
}

Renderer.prototype.ShooterRender = function(context, shooter) {
  var img = new Image();

  img.onload = function () {
    context.save();
    context.translate(shooter.position.x , shooter.position.y);
    context.scale(-1,1);
    context.drawImage(img, -shooter.size.x/2, -shooter.size.y/2, shooter.size.x, shooter.size.y);
    context.restore();
  }
  img.src = shooter.texture;
}

Renderer.prototype.RoundsRender = function(context, roundsCount, rounrdSize) {
  var img = new Image();
  img.onload = function () {
    for(var i =0; i < roundsCount; i++)
    {
      context.save();
      context.translate(i*rounrdSize.x,0);
      context.drawImage(img, 0, 0, rounrdSize.x, rounrdSize.y);
      context.restore();
    }
  }
  img.src = "../static/Textures/sheriff-badgestressball-superextralarge-224553.png";
}

Renderer.prototype.TextRender = function(ctx, text) {
ctx.font = "bold 120px Chibola";
ctx.fillStyle = "white";
ctx.textAlign = "center";
ctx.shadowColor= "black";
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;
ctx.shadowBlur = 10;
ctx.fillText(text, canvas.width/2, canvas.height/2); 
}

Renderer.prototype.MasterRenderer = function(context, world, shooter1, shooter2, roundsCount, rounrdSize, text) {
  var world_img = new Image();
  world_img.onload = function () {

          var shooter1_img = new Image();
          shooter1_img.onload = function () {


                      var shooter2_img = new Image();
                      shooter2_img.onload = function () {


                                   var rounds_img = new Image();
                                   rounds_img.onload = function () {
                                                context.font = "bold 120px Chibola";
                                                context.fillStyle = "white";
                                                context.textAlign = "center";
                                                context.shadowColor= "black";
                                                context.shadowOffsetX = 0;
                                                context.shadowOffsetY = 0;
                                                context.shadowBlur = 10;
                                                context.fillText(text, canvas.width/2, canvas.height/2); 
                                       context.save();
                                       context.translate(-rounrdSize.x,0);
                                     for(var i =0; i < roundsCount; i++)
                                     {
                                       context.translate(rounrdSize.x,0);
                                       context.drawImage(rounds_img, 0, 0, rounrdSize.x, rounrdSize.y);
                                     }
                                       context.restore();

                                   }
                                   rounds_img.src = "../static/Textures/sheriff-badgestressball-superextralarge-224553.png";


                        context.save();
                        context.translate(shooter2.position.x , shooter2.position.y);
                        context.scale(-1,1);
                        context.drawImage(shooter2_img, -shooter2.size.x/2, -shooter2.size.y/2, shooter2.size.x, shooter2.size.y);
                        context.restore();
                        }
                      shooter2_img.src = shooter2.texture;
                      context.save();
                      context.translate(shooter1.position.x , shooter1.position.y);
                      context.scale(-1,1);
                      context.drawImage(shooter1_img, -shooter1.size.x/2, -shooter1.size.y/2, shooter1.size.x, shooter1.size.y);
                      context.restore();
          }
          shooter1_img.src = shooter1.texture;
      context.drawImage(world_img, 0, 0, world.canvas.width, world.canvas.height);

    }
  world_img.src = world.texture;
}


Renderer.prototype.MasterRenderer2 = function(context, world, shooter1, shooter2, roundsCount, rounrdSize, text) {
  var world_img = new Image();
  world_img.is_loaded = false;
  world_img.onload = function () {
    world_img.is_loaded = true;
  }
  world_img.src = world.texture;


  var shooter1_img = new Image();
  shooter1_img.is_loaded = false;
  shooter1_img.onload = function () {
    shooter1_img.is_loaded = true;             
  }
  shooter1_img.src = shooter1.texture;

  var shooter2_img = new Image();
  shooter2_img.is_loaded = false;
  shooter2_img.onload = function () {
    shooter2_img.is_loaded = true;                         
  }
  shooter2_img.src = shooter2.texture;

  var rounds_img = new Image();
  rounds_img.is_loaded = false;
  rounds_img.onload = function () {
    rounds_img.is_loaded = true;
  }
  rounds_img.src = "../static/Textures/sheriff-badgestressball-superextralarge-224553.png";

  if (world_img.is_loaded )
  {
    context.drawImage(world_img, 0, 0, world.canvas.width, world.canvas.height);
  }

  if(shooter1_img.is_loaded){
    context.save();
    context.translate(shooter1.position.x , shooter1.position.y);
    context.scale(-1,1);
    context.drawImage(shooter1_img, -shooter1.size.x/2, -shooter1.size.y/2, shooter1.size.x, shooter1.size.y);
    context.restore();
  }

  if(shooter2_img.is_loaded){
    context.save();
    context.translate(shooter2.position.x , shooter2.position.y);
    context.scale(-1,1);
    context.drawImage(shooter2_img, -shooter2.size.x/2, -shooter2.size.y/2, shooter2.size.x, shooter2.size.y);
    context.restore();
  }

  if(rounds_img.is_loaded){
    context.save();
    context.translate(-rounrdSize.x,0);
    for(var i =0; i < roundsCount; i++)
    {
      context.translate(rounrdSize.x,0);
      context.drawImage(rounds_img, 0, 0, rounrdSize.x, rounrdSize.y);
    }
    context.restore();
  }

  context.font = "bold 120px Chibola";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.shadowColor= "black";
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 10;
  context.fillText(text, canvas.width/2, canvas.height/2);          
      
}

Renderer.prototype.MasterRenderer3 = function(context, world, shooter1, shooter2, roundsCount, rounrdSize, text) {

    context.drawImage(world.town_texture, 0, 0, world.canvas.width, world.canvas.height);

    var shooter1_texture;
    var shooter2_texture;

    switch(shooter1.texture)
    {
      case("../static/Textures/Cowboy1.png"): shooter1_texture = world.cowboy1_texture; break;
      case("../static/Textures/CowboyDamage1.png"): shooter1_texture = world.cowboy1_damage_texture; break;
      case("../static/Textures/CowboyDead1.png"): shooter1_texture = world.cowboy1_dead_texture; break;
      case("../static/Textures/CowboyShooting1.png"): shooter1_texture = world.cowboy1_shooting_texture; break;
    }

    switch(shooter2.texture)
    {
      case("../static/Textures/Cowboy2.png"): shooter2_texture = world.cowboy2_texture; break;
      case("../static/Textures/CowboyDamage2.png"): shooter2_texture = world.cowboy2_damage_texture; break;
      case("../static/Textures/CowboyDead2.png"): shooter2_texture = world.cowboy2_dead_texture; break;
      case("../static/Textures/CowboyShooting2.png"): shooter2_texture = world.cowboy2_shooting_texture; break;
    }

    context.save();
    context.translate(shooter1.position.x , shooter1.position.y);
    context.scale(-1,1);
    context.drawImage(shooter1_texture, -shooter1.size.x/2, -shooter1.size.y/2, shooter1.size.x, shooter1.size.y);
    context.restore();

    context.save();
    context.translate(shooter2.position.x , shooter2.position.y);
    context.scale(-1,1);
    context.drawImage(shooter2_texture, -shooter2.size.x/2, -shooter2.size.y/2, shooter2.size.x, shooter2.size.y);
    context.restore();

    context.save();
    context.translate(-rounrdSize.x,0);
    for(var i =0; i < roundsCount; i++)
    {
      context.translate(rounrdSize.x,0);
      context.drawImage(world.round_texture, 0, 0, rounrdSize.x, rounrdSize.y);
    }
    context.restore();

  context.font = "bold 100px Chibola";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.shadowColor= "black";
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 10;
  context.fillText(text, canvas.width/2, canvas.height/2);    
}