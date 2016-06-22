 var Renderer = function() {
  this.ships = [];
  this.clients = [];
  this.planets = [];
}


Renderer.prototype.SetShips = function(ships) {
  this.ships = ships;
}

Renderer.prototype.SetClients = function(clients) {
  this.clients = clients;
}

Renderer.prototype.SetPlanets = function(planets) {
  this.planets = planets;
}

Renderer.prototype.ShipRender = function(context, ship) {
  context.save();
  context.translate(ship.position.x , ship.position.y);
  //console.log(ship.angle);
  context.rotate(ship.angle );
  var r = new Image();
  r.src = ship.model;
  context.drawImage(r, -ship.size.x/2, -ship.size.y/2, ship.size.x, ship.size.y);
  context.restore();

  //draw_BB(ship.bounding_box, context);

  context.beginPath();
  context.moveTo(ship.position.x,ship.position.y);
  context.lineTo(ship.position.x + ship.start_view.x*40,ship.position.y + ship.start_view.y* 40);

  context.moveTo(ship.position.x,ship.position.y);
  context.lineTo(ship.position.x + ship.view.x,ship.position.y + ship.view.y  );
  context.stroke();
}

Renderer.prototype.ClientRender = function(context, client) {

}

Renderer.prototype.PlanetRenderer = function(context, planet) {
  context.save();
  context.translate(planet.position.x , planet.position.y);
  //console.log(planet.angle);
  context.rotate(planet.angle );
  //var r = new Image();
  //r.src = "../static/Textures/Planets/Virtual Planets Ice Earth-Like Planet 04.png";
  //context.drawImage(r, -planet.size.x/2, -planet.size.y/2, planet.size.x, planet.size.y);
  context.restore();


  //draw_BB(planet.bounding_box, context);
}

function draw_BB(bounding_box, context){
  var p1 = bounding_box.p1;
  var p2 = bounding_box.p2;
  var p3 = bounding_box.p3;
  var p4 = bounding_box.p4;
  context.strokeStyle="red";

  context.beginPath();
  context.moveTo(p1.x,p1.y);
  context.lineTo(p2.x,p2.y);
  context.lineTo(p3.x,p3.y);
  context.lineTo(p4.x,p4.y);
  context.lineTo(p1.x,p1.y);
  context.stroke();
}

Renderer.prototype.MasterRenderer = function(context) {
  for(var i =0; i < this.planets.length; i++){
    this.PlanetRenderer(context, this.planets[i]);
  }
  for(var i =0; i < this.ships.length; i++){
    this.ShipRender(context, this.ships[i]);
  }

  //for(var i =0; i < this.clients.length; i++){
  //  this.ClientRender(context, this.clients[i]);
  //}
}

Renderer.prototype.Decode_json = function(c) {
  this.x = c.x;
  this.y = c.y;
}
