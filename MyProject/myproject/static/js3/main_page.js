var sc;
window.onload = function(){
//sc = new SocketConnection("ws://172.23.142.17:8080/websocket");
sc = new SocketConnection("ws://127.0.0.1:8080/websocket");

sc.socket.onopen = function() {
  console.log("Соединение установлено.");
  this.send(JSON.stringify({'cmd' : ['my_name'], 'name':document.getElementById('login').innerHTML, 'cookie': document.cookie }));
};


sc.socket.onmessage = function(event) {
  var cmd = event.data;
  try{
    cmd = JSON.parse(event.data);
    console.log(cmd);
  }
  catch(err){ 
    console.log(err);
  }
  if (cmd[0].command == "error")
  {
    show_error_message(cmd[1].error_message, 2000);
  }

  if (cmd[0].command == "create_lobby")
  {
      rooms.appendChild(create_room_item(cmd[1].id, cmd[1].name, sc));
  }
  if (cmd[0].command == "in_game")
  {
    //window.location.href += 'game';
    show_game();
  }

  if (cmd[0].command == "update_room_status")
  {
      var room = document.getElementById('rooms_item'+cmd[1].id);
      room.querySelector('#lobby_form_status').innerHTML = cmd[1].status;
  }

  if (cmd[0].command == "update_room")
  {
        var room = document.getElementById('rooms_item'+cmd[1].id);
    set_room_status(room, cmd[1].status);
    set_room_team_name(room, '#lobby_form_team1_name', cmd[1].teams[0].name);
    set_room_team_name(room, '#lobby_form_team2_name', cmd[1].teams[1].name);
    update_room_list(room, 'lobby_form_team1_list', '.lobby_form_team1_slot', cmd[1].teams[0].clients, sc);
    update_room_list(room, 'lobby_form_team2_list', '.lobby_form_team2_slot', cmd[1].teams[1].clients, sc);
    update_room_list(room, 'lobby_form_clients_list', '.lobby_form_clients_slot', cmd[1].clients, sc);
  }
  if (cmd[0].command == "in_team")
  {
    var room = document.getElementById('rooms_item'+cmd[1].id);
    set_room_status(room, cmd[1].status);
    set_room_team_name(room, '#lobby_form_team1_name', cmd[1].teams[0].name);
    set_room_team_name(room, '#lobby_form_team2_name', cmd[1].teams[1].name);
    update_room_list(room, 'lobby_form_team1_list', '.lobby_form_team1_slot', cmd[1].teams[0].clients, sc);
    update_room_list(room, 'lobby_form_team2_list', '.lobby_form_team2_slot', cmd[1].teams[1].clients, sc);
    update_room_list(room, 'lobby_form_clients_list', '.lobby_form_clients_slot', cmd[1].clients, sc);
  }
  if (cmd[0].command == "connected_to_lobby")
  {
    var room = document.getElementById('rooms_item'+cmd[1].id);
    set_room_status(room, cmd[1].status);
    set_room_team_name(room, '#lobby_form_team1_name', cmd[1].teams[0].name);
    set_room_team_name(room, '#lobby_form_team2_name', cmd[1].teams[1].name);
    update_room_list(room, 'lobby_form_team1_list', '.lobby_form_team1_slot', cmd[1].teams[0].clients, sc);
    update_room_list(room, 'lobby_form_team2_list', '.lobby_form_team2_slot', cmd[1].teams[1].clients, sc);
    update_room_list(room, 'lobby_form_clients_list', '.lobby_form_clients_slot', cmd[1].clients, sc);
  }
  if (cmd[0].command == "disconnected_from_lobby")
  {
    var room = document.getElementById('rooms_item'+cmd[1].id);
    set_room_status(room, cmd[1].status);
    set_room_team_name(room, '#lobby_form_team1_name', cmd[1].teams[0].name);
    set_room_team_name(room, '#lobby_form_team2_name', cmd[1].teams[1].name);
    update_room_list(room, 'lobby_form_team1_list', '.lobby_form_team1_slot', cmd[1].teams[0].clients, sc);
    update_room_list(room, 'lobby_form_team2_list', '.lobby_form_team2_slot', cmd[1].teams[1].clients, sc);
    update_room_list(room, 'lobby_form_clients_list', '.lobby_form_clients_slot', cmd[1].clients, sc);
  }
  if (cmd[0].command == "set_status")
  {
    var room = document.getElementById('rooms_item'+cmd[1].id);
    set_room_status(room, cmd[1].status);
    set_room_team_name(room, '#lobby_form_team1_name', cmd[1].teams[0].name);
    set_room_team_name(room, '#lobby_form_team2_name', cmd[1].teams[1].name);
    update_room_list(room, 'lobby_form_team1_list', '.lobby_form_team1_slot', cmd[1].teams[0].clients, sc);
    update_room_list(room, 'lobby_form_team2_list', '.lobby_form_team2_slot', cmd[1].teams[1].clients, sc);
    update_room_list(room, 'lobby_form_clients_list', '.lobby_form_clients_slot', cmd[1].clients, sc);
  }

  if (cmd[0].command == "delete_lobby")
  {
    rooms.removeChild(document.getElementById('rooms_item'+cmd[1].id));
  }
  if (cmd[0].command == "open_lobby")
  {
    $(document.getElementById('collapse'+cmd[1].id)).collapse('show');
  }
  if (cmd[0].command == "close_lobby")
  {
    $(document.getElementById('collapse'+cmd[1].id)).collapse('hide');
  }
  if (cmd[0].command == "game_room")
  {
    //var game_canvas = document.getElementById('game_canvas');
    if (game.canvas.width != cmd[1].world.width){
      game.canvas.width = cmd[1].world.width;
    }
    if (game.canvas.height != cmd[1].world.height){
      game.canvas.height = cmd[1].world.height;
    }
    if (game.texture != cmd[1].world.texture){
      game.texture = cmd[1].world.texture;
    }
    if (game.player1 != cmd[1].player1){
      game.player1 = cmd[1].player1;
    }
    if (game.player2 != cmd[1].player2){
      game.player2 = cmd[1].player2;
    }
    if (game.text != cmd[1].text){
      game.text = cmd[1].text;
    }
    if (game.current_round != cmd[1].current_round){
      game.current_round = cmd[1].current_round;
    }
    if (game.rounds != cmd[1].rounds){
      game.rounds = cmd[1].rounds;
    }
  }
};


//месанджер ошибок
function show_error_message(error_message, time_to_show){
  document.getElementById('error_message').style.display='block';
  document.getElementById('error_message').style.width='100%';
  document.getElementById('error_message').style.background='rgba(255,0,0,0.5)';
  document.getElementById('error_message').innerHTML = error_message;
  setTimeout(hide_error_message, time_to_show);
}
function hide_error_message(){
  document.getElementById('error_message').style.display='none';
}

/////////////////////////////////////////////////
  var rooms =  document.getElementById('rooms');
  var rooms_panel =  document.getElementById('rooms_panel');
  var blur_rooms_panel =  document.getElementById('blur_rooms_panel');
  var menu_panel =  document.getElementById('menu_panel');
  var menu_panel_shadow =  document.getElementById('menu_panel_shadow');

  rooms_panel.style.display= 'inline-block';
  //rooms_panel.style.textAlign = "center";
  rooms_panel.style.overflow = "hidden";
  //////////////////////////////
  ////////////////////////////////
  repalce();


  window.onmousemove= function(e){
    //rooms.style.transform = "translate("+e.pageX+"px,"+e.pageY+"px)";
  }

  window.onresize = function(){
    repalce();
  }

  function repalce(){
    var add_room_button = rooms_panel.querySelector('#show');
    rooms_panel.style.height  = rooms.style.height = window.innerHeight   + "px";
    blur_rooms_panel.style.width = rooms_panel.style.width = rooms.style.width = window.innerWidth*0.5 + "px";
    //rooms_panel.style.transform = "translate("+window.innerWidth*0.37+"px, 0px)";
    rooms_panel.style.margin = "auto "+window.innerWidth*0.37+"px";
    menu_panel.style.transform = "translate("+window.innerWidth*0.01+"px,"+(window.innerHeight*1.0-menu_panel.clientHeight ) +"px)";
    //menu_panel_shadow.style.transform = "translate("+window.innerWidth*0.01+"px,"+(window.innerHeight*1.0-menu_panel.clientHeight ) +"px)";

    menu_panel_shadow.clientHeight = menu_panel.clientHeight;
    menu_panel_shadow.clientWidth = menu_panel.clientWidth;
  }

//////////////////////Форма создания лобби
var create_lobby_form = document.getElementById('create_lobby_form');
document.getElementById('show').onclick = function() {
  create_lobby_form.showModal();
};
document.getElementById('close_lb').onclick = function() {
  create_lobby_form.close("");
};
document.getElementById('submit_lb').onclick = function() {
  var lobby_name = document.getElementById('name_return_value').value;
  var lobby_pass = document.getElementById('password_return_value').value;
    if (lobby_name != ''){
      console.log('senden on server "' + 'create_lobby ' + lobby_name + ' ' + lobby_pass +'"');
      console.log('senden on server "' + 'connected_to_lobby ' + lobby_name + ' lobby_form_clients_list' +'"');
      sc.send(JSON.stringify({'cmd' : ['create_lobby', 'connected_to_lobby'], 'name': lobby_name, 'pass':lobby_pass, 'id':'lobby_form_clients_list'})  );
  }
  create_lobby_form.close('');
};
///////////////////////////////////////////////////////////////////////
///Форма игры
var game_form = document.getElementById('game_form');
var game_canvas = document.getElementById('game_canvas');
game_canvas.width = window.innerWidth * 0.9;
game_canvas.height = window.innerHeight * 0.9;
//game_form.innerHTML = document.cookie;
function show_game(){
  game_form.showModal();
};

document.getElementById('game_form_close').onclick = function() {
  game_form.close("");
};

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
//////////////////////////////
}

function create_room_item(id, lobby_name, sc){
  var room_item = document.createElement('li');
      room_item.setAttribute("class", 'rooms_item');
      room_item.setAttribute("id", 'rooms_item'+id);
      room_item.shown = false;
      room_item.clickable = true;

  var panel = document.createElement('div');
      panel.setAttribute("class", 'panel panel-default');
  var panel_heading = document.createElement('div');
      panel_heading.setAttribute("class", 'panel-heading');
  var panel_title = document.createElement('h4');
      panel_title.setAttribute("class", 'panel-title');
      panel_title.style.overflow = "auto";
///////////////////////То что находится в загаловке
  var lobby_item = create_lobby_item_header(lobby_name);

  var collapse = document.createElement('a');
      collapse.setAttribute("data-toggle", 'collapse');
      collapse.setAttribute("class", 'collapse');
      collapse.style.overflow = "auto";
      collapse.style.display = "block";

      //collapse.setAttribute("href", '#collapse'+id);
    $(collapse).click(function(){
      if(!room_item.clickable)
        return;
        //$(collapse1).collapse('toggle');
      if(room_item.shown == false){
        console.log('senden on server "' + 'connected_to_lobby ' + room_item.querySelector('#lobby_name').innerHTML + ' lobby_form_clients_list' +'"');
        sc.send(JSON.stringify({'cmd' : ['connected_to_lobby'], 'name': id, 'pass':'lobby_pass', 'id':'lobby_form_clients_list'})  );
      }
      else
      {
        console.log('senden on server "' + 'disconnected_from_lobby ' + room_item.querySelector('#lobby_name').innerHTML + ' lobby_form_clients_list' +'"');
        sc.send(JSON.stringify({'cmd' : ['disconnected_from_lobby'], 'name': id, 'pass':'lobby_pass', 'id':'lobby_form_clients_list'})  );
      }

    });

///////////////////////////////////////////////////////////
/////Тело и события
  var collapse1 = document.createElement('div');
      collapse1.setAttribute("id", 'collapse'+id);
      collapse1.setAttribute("class", 'panel-collapse collapse');
      collapse1.appendChild(create_lobby_item_body(sc, id));
    
    $(collapse1).on('shown.bs.collapse', function(){
      //alert('The collapsible content is now fully shown.');
      lobby_item.getElementsByTagName("img")[0].setAttribute('src', 'static/Textures/no_image/hide.png');
      room_item.clickable = true;
      room_item.shown = true;
    });
    $(collapse1).on('show.bs.collapse', function(){
      //alert('The collapsible content is about to be shown.');
      room_item.clickable = false;
    });

    $(collapse1).on('hidden.bs.collapse', function(){
      //alert('The collapsible content is now hidden.');
      lobby_item.getElementsByTagName("img")[0].setAttribute('src', 'static/Textures/no_image/show.png');
      room_item.clickable = true;
      room_item.shown = false;
    });
    $(collapse1).on('hide.bs.collapse', function(){
        //alert('The collapsible content is about to be hidden.');
        room_item.clickable = false;
    });
//////////////////////////////////////////


  var panel_body = document.createElement('div');
      panel_body.setAttribute("class", 'panel-body');
      panel_body.appendChild(document.createTextNode('body '+id))
  var panel_footer = document.createElement('div');
      panel_footer.setAttribute("class", 'panel-footer');
      panel_footer.appendChild(document.createTextNode('footer '+id))

      panel_title.appendChild(collapse);
      collapse.appendChild(lobby_item);
      panel_heading.appendChild(panel_title);
      panel.appendChild(panel_heading);




      panel.appendChild(collapse1);
      room_item.appendChild(panel);

      return room_item;
}


var create_lobby_item_header = function(lobby_name){
  var LobbyItem = document.createElement("div");
      LobbyItem.setAttribute('class', 'LobbyItem');
      LobbyItem.setAttribute('id', 'lobby_id');

  var LobbyItemName = document.createElement("label");
      LobbyItemName.setAttribute('class', 'LobbyItemName');
      LobbyItemName.appendChild(document.createTextNode(lobby_name));
      LobbyItemName.setAttribute('id', 'lobby_name');
      LobbyItemName.style.float = "left";

  var expand_img = document.createElement("img");
      expand_img.setAttribute('src', 'static/Textures/no_image/show.png');
      expand_img.setAttribute('width', '16');
      expand_img.setAttribute('height', '16');
      expand_img.setAttribute('expand', 'expand');
      expand_img.style.float = "right";

  LobbyItem.appendChild(expand_img);
  LobbyItem.appendChild(LobbyItemName);
  return LobbyItem;
}

var create_lobby_item_body = function(sc, id_room){
  var global_div = document.createElement("div");
      global_div.setAttribute('id', 'lobby_id_body');
      global_div.setAttribute('class', 'lobby_form');

  var lobby_form_status_place = document.createElement("div");
      lobby_form_status_place.setAttribute('id', 'lobby_form_status_place');
  var lobby_form_status = document.createElement("label");
      lobby_form_status.setAttribute('id', 'lobby_form_status');

  var lobby_form_teams_place = document.createElement("div");
      lobby_form_teams_place.setAttribute('id', 'lobby_form_teams_place');
  var lobby_form_team1_list = document.createElement("ul");
      lobby_form_team1_list.setAttribute('id', 'lobby_form_team1_list');
  var lobby_form_team1_name = document.createElement("li");
      lobby_form_team1_name.setAttribute('id', 'lobby_form_team1_name');
  var lobby_form_team1_slot = document.createElement("li");
      lobby_form_team1_slot.setAttribute('class', 'lobby_form_team1_slot');
  var lobby_form_team2_list = document.createElement("ul");
      lobby_form_team2_list.setAttribute('id', 'lobby_form_team2_list');
  var lobby_form_team2_name = document.createElement("li");
      lobby_form_team2_name.setAttribute('id', 'lobby_form_team2_name');
  var lobby_form_team2_slot = document.createElement("li");
      lobby_form_team2_slot.setAttribute('class', 'lobby_form_team2_slot');


  var lobby_form_clients_place = document.createElement("div");
      lobby_form_clients_place.setAttribute('id', 'lobby_form_clients_place');
  var lobby_form_clients_list = document.createElement("ul");
      lobby_form_clients_list.setAttribute('id', 'lobby_form_clients_list');
  var lobby_form_clients_name = document.createElement("li");
      lobby_form_clients_name.appendChild(document.createTextNode('In lobby'));
      lobby_form_clients_name.setAttribute('id', 'lobby_form_clients_name');
  var lobby_form_client_slot = document.createElement("li");
      //lobby_form_client_slot.appendChild(document.createTextNode('client'));
      lobby_form_client_slot.setAttribute('id', 'lobby_form_client_slot');

      lobby_form_clients_place.appendChild(lobby_form_clients_list);
      lobby_form_clients_list.appendChild(lobby_form_clients_name);
      lobby_form_clients_list.appendChild(lobby_form_client_slot);



      lobby_form_status.appendChild(document.createTextNode('lobby_status'));
      lobby_form_status_place.appendChild(lobby_form_status);

      lobby_form_teams_place.appendChild(lobby_form_team1_list);
      lobby_form_team1_name.appendChild(document.createTextNode('team1_name'));
      lobby_form_team1_list.appendChild(lobby_form_team1_name);
      //lobby_form_team1_list.appendChild(lobby_form_team1_slot);
      //lobby_form_team1_slot.appendChild(document.createTextNode(owner));
      lobby_form_teams_place.appendChild(lobby_form_team2_list);
      lobby_form_team2_name.appendChild(document.createTextNode('team2_name'));
      lobby_form_team2_list.appendChild(lobby_form_team2_name);
      //lobby_form_team2_list.appendChild(lobby_form_team2_slot);

/////////////////////////////////////////////////////////////////////////////////////////////////
      lobby_form_team1_name.onclick = function() { 
        console.log('sended on server "in_team '+ '1');
        sc.send(JSON.stringify({'cmd' : ['in_team'], 'team': 0, 'room_id':id_room}));
      };
      lobby_form_team2_name.onclick = function() { 
        console.log('sended on server "in_team '+ '2');
        sc.send(JSON.stringify({'cmd' : ['in_team'], 'team': 1, 'room_id':id_room}));
      };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////s
      global_div.appendChild(lobby_form_status_place);
      global_div.appendChild(lobby_form_teams_place);
      global_div.appendChild(lobby_form_clients_place);
      return global_div;
}

function set_room_status(rooms_item, status){
  rooms_item.querySelector('#lobby_form_status').innerHTML = status;
}

function set_room_team_name(rooms_item, team_name_id, name){
  rooms_item.querySelector(team_name_id).innerHTML = name;
}

function update_room_list(rooms_item, list_id, slots_id, new_list, sc){
  remove_clients(rooms_item, slots_id);
  for(var i = 0; i < new_list.length; i++)
    add_client(rooms_item, new_list[i].name, new_list[i].status, list_id, sc);
  
}

function remove_clients(rooms_item, slots_id){
  var team_list = rooms_item.querySelectorAll(slots_id);
  for(var i =0; i < team_list.length; i++){
    team_list[i].remove();
  }
}

function add_client(rooms_item, client_name, client_status, team_id, sc){
  var new_client = document.createElement("li");
  new_client.appendChild(document.createTextNode(client_name));
  new_client.style.overflow = 'auto';
  new_client.style.textAlign = 'left';

  var ready_image = document.createElement("img");
      ready_image.setAttribute('width', '16');
      ready_image.setAttribute('height', '16');
      ready_image.setAttribute('src', 'static/Textures/no_image/status/Not Ready.png');
      ready_image.style.float = "right";
      
      if (client_status == 0){ready_image.setAttribute('src', 'static/Textures/no_image/status/Not Ready.png'); ready_image.status = 0;}
      if (client_status == 1){ready_image.setAttribute('src', 'static/Textures/no_image/status/Ready.png'); ready_image.status = 1;}
      if (client_status == 2){ready_image.setAttribute('src', 'static/Textures/no_image/status/Ready.png'); ready_image.status = 2;}

  $(ready_image).click(function(){
     if(ready_image.status == 1){
      ready_image.status = 0;
      sc.send(JSON.stringify({'cmd' : ['set_status'], 'status': ready_image.status})  );
    }
    else{
      ready_image.status = 1;
      sc.send(JSON.stringify({'cmd' : ['set_status'], 'status': ready_image.status})  );
    }
  });


  if(team_id == 'lobby_form_team1_list'){
    new_client.setAttribute('class', 'lobby_form_team1_slot');
    new_client.appendChild(ready_image);
  }
  if(team_id == 'lobby_form_team2_list'){
    new_client.setAttribute('class', 'lobby_form_team2_slot');
    new_client.appendChild(ready_image);
  }
  if(team_id == 'lobby_form_clients_list')
    new_client.setAttribute('class', 'lobby_form_clients_slot');


  rooms_item.querySelector("#"+team_id).appendChild(new_client);
}


