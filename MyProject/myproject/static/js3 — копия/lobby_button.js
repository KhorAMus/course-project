window.onload=function(){

}
var myAudio = new Audio('static/music/WesternMainTheme.mp3');
myAudio.loop = true;
myAudio.muted = true;
myAudio.play();
myAudio.ontimeupdate = function() { 
  myAudio.currentTime; //= 10;
};
document.getElementById('stop_music').onclick = function(){
  if(myAudio.muted)
    myAudio.muted = false;
  else
    myAudio.muted = true;
}


//var sc = new SocketConnection("ws://192.168.0.122:8080/websocket");
var sc = new SocketConnection("ws://172.23.142.17:8080/websocket");
//var sc = new SocketConnection("ws://192.168.1.34:8080/websocket");

document.getElementById('send_json').onclick = function(){
  sc.send(JSON.stringify({"q":"qqqqq"}));
}

function get_lobby_id(){
  var global_div = document.getElementById('lobby_form').lastChild;
  return global_div.id;
}

var lobby_form = document.getElementById("lobby_form");
lobby_form.addEventListener('close', function() {
  var lobby_id = get_lobby_id();
  sc.send('disconnected_from_lobby ' + lobby_id);
  console.log('loby_form_closed\n' + 'sended on server "disconnected_from_lobby ' +lobby_id+ '"');
  while (lobby_form.hasChildNodes()) {
    console.log('removeChild from form with id ="'+ lobby_id +'"');
    lobby_form.removeChild(lobby_form.lastChild);
  }
});
function set_lobby_form_value(lobby_form, lobby_name, lobby_status){
  var old_lobby_name = lobby_form.querySelector('#'+'lobby_form_name');
  var old_lobby_status = lobby_form.querySelector('#'+'lobby_form_status');
  var new_lobby_name = old_lobby_name;
  var new_lobby_status = old_lobby_status;
  new_lobby_name.innerHTML = lobby_name;
  new_lobby_status.innerHTML = lobby_status;
  lobby_form.replaceChild(new_lobby_name, old_lobby_name);
  lobby_form.replaceChild(new_lobby_status, old_lobby_status);
}

function in_lobby(lobby_name, lobby_status, lobby_id) {
  var new_lobby_form = create_lobby("lobby_form"+lobby_id);
  set_lobby_form_value(new_lobby_form, lobby_name, lobby_status);
  lobby_form.appendChild(new_lobby_form);
  lobby_form.showModal();
  console.log('showed_lobby_form with id "' + get_lobby_id() + '"');
};

document.getElementById('show_lobby_form').onclick = function(){ in_lobby('lobby_name','lobby_status', 'lobby_id'); myAudio.currentTime=5;}


function create_lobby (id){
  var global_div = document.createElement("div");
      global_div.setAttribute('id', id);

  var lobby_form_name_place = document.createElement("div");
      lobby_form_name_place.setAttribute('id', 'lobby_form_name_place');
  var lobby_form_name = document.createElement("label");
      lobby_form_name.setAttribute('id', 'lobby_form_name');

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

  var lobby_form_bottom_place = document.createElement("div");
      lobby_form_bottom_place.setAttribute('id', 'lobby_form_bottom_place');
  var close_lobby_form = document.createElement("button");
      close_lobby_form.setAttribute('id', 'close_lobby_form');


  var lobby_form_clients_place = document.createElement("div");
      lobby_form_clients_place.setAttribute('id', 'lobby_form_clients_place');
  var lobby_form_clients_list = document.createElement("ul");
      lobby_form_clients_list.setAttribute('id', 'lobby_form_clients_list');
  var lobby_form_clients_name = document.createElement("li");
      lobby_form_clients_name.appendChild(document.createTextNode('clients'));
      lobby_form_clients_name.setAttribute('id', 'lobby_form_clients_name');
  var lobby_form_client_slot = document.createElement("li");
      //lobby_form_client_slot.appendChild(document.createTextNode('client'));
      lobby_form_client_slot.setAttribute('id', 'lobby_form_client_slot');

      lobby_form_clients_place.appendChild(lobby_form_clients_list);
      lobby_form_clients_list.appendChild(lobby_form_clients_name);
      lobby_form_clients_list.appendChild(lobby_form_client_slot);


      lobby_form_name.appendChild(document.createTextNode('lobby_name'));
      lobby_form_name_place.appendChild(lobby_form_name);

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

      close_lobby_form.appendChild(document.createTextNode('Close'));
      lobby_form_bottom_place.appendChild(close_lobby_form);
/////////////////////////////////////////////////////////////////////////////////////////////////Закрыть форму лобби
      close_lobby_form.onclick = function() { 
        var lobby_form = document.getElementById('lobby_form');
        lobby_form.close();
        //sc.send('delete_lobby');
      };
      lobby_form_team1_list.onclick = function() { 
        console.log('sended on server "in_team '+ '1');
        sc.send('in_team ' + '1');
      };
      lobby_form_team2_list.onclick = function() { 
        console.log('sended on server "in_team '+ '2');
        sc.send('in_team ' + '2');
      };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////s
      global_div.appendChild(lobby_form_name_place);
      global_div.appendChild(lobby_form_status_place);
      global_div.appendChild(lobby_form_teams_place);
      global_div.appendChild(lobby_form_clients_place);
      global_div.appendChild(lobby_form_bottom_place);
      return global_div;
}

function add_client(client_name, team_id, form, soc){
  var new_client = document.createElement("li");
  if(team_id == 'lobby_form_team1_list')
    new_client.setAttribute('class', 'lobby_form_team1_slot');
  if(team_id == 'lobby_form_team2_list')
    new_client.setAttribute('class', 'lobby_form_team2_slot');
  if(team_id == 'lobby_form_clients_list')
    new_client.setAttribute('class', 'lobby_form_clients_slot');

  new_client.setAttribute('soc', soc);

  new_client.appendChild(document.createTextNode(client_name));
  form.querySelector("#"+team_id).appendChild(new_client);
}
function remove_clients(team_id, form){
  var team_list = form.querySelectorAll(team_id);
  for(var i =0; i < team_list.length; i++){
    team_list[i].remove();
  }

}


function remove_client(client, team_name, team_slot_id, form, soc){
  var slot = form.querySelector("#"+soc);
  var slots = form.querySelector("#"+team_name);
      slots.removeChild(slot);
}


var data;
var lobby_name="";
var lobby_pass="";

var create_lobby_form = document.getElementById('create_lobby_form');
document.getElementById('show').onclick = function() {
  create_lobby_form.showModal();
};
document.getElementById('close_lb').onclick = function() {
  create_lobby_form.close("");
};
document.getElementById('submit_lb').onclick = function() {
  var value = document.getElementById('name_return_value').value;
  var pass = document.getElementById('password_return_value').value;
  set_name_pass(value, pass);
    if (lobby_name != ''){
      console.log('senden on server "' + 'create_lobby ' + lobby_name + ' ' + lobby_pass +'"');
      sc.send('create_lobby ' + lobby_name + ' ' + lobby_pass);
      console.log('senden on server "' + 'join_in_lobby ' + lobby_name + ' lobby_form_clients_list' +'"');
      sc.send('join_in_lobby ' + lobby_name + ' lobby_form_clients_list');
  }
  create_lobby_form.close(value);
};

function set_name_pass (lb_name, lb_pass){
  if (lb_name != ""){
    lobby_name = lb_name;
    lobby_pass = lb_pass;
  }
}

create_lobby_form.addEventListener('close', function() {
  if(this.returnValue == ""){
    return;
  }
});


sc.socket.onmessage = function(event) {
  //console.log("Получены данные с сервера: " + event.data + "    ");
    commands = event.data;//JSON.parse(event.data);
    data = event.data;
    console.log(data);
    var splitted_str = data.split(' ');
    var cmd = event.data;
    try{
      cmd = JSON.parse(event.data);
    }
    catch(err){
      console.log(err);
    }
     
    if (cmd[0].command == "create_lobby")
    {
      var all_lobbys = document.getElementById("lobbys_id");
      var new_lobby = create_lobby_item(cmd[1].owner.connection);
      var name1 = 'Empty Slot';
      var name2 = 'Empty Slot';
      if(cmd[1].teams[0].clients[0] != undefined)
        name1 = cmd[1].teams[0].clients[0].name;
      if(cmd[1].teams[1].clients[0] != undefined)
        name2 = cmd[1].teams[1].clients[0].name;
      set_values_lobby_item(new_lobby, cmd[1].name, name1, name2);
      all_lobbys.appendChild(new_lobby);
      //  lobby_form = create_lobby(cmd[1].owner.connection);
    }
    if (cmd[0].command == "delete_lobby")
    {
      var all_lobbys = document.getElementById("lobbys_id");
      var current_lobby = document.getElementById(cmd[1].owner.connection);
      all_lobbys.removeChild(current_lobby);
    }
    if (cmd[0].command == "connected_to_lobby")
    {
      var current_lobby = document.getElementById(cmd[1].owner.connection);
      var name1 = 'Empty Slot';
      var name2 = 'Empty Slot';
      if(cmd[1].teams[0].clients[0])
        name1 = cmd[1].teams[0].clients[0].name;
      if(cmd[1].teams[1].clients[0])
        name2 = cmd[1].teams[1].clients[0].name;

      set_values_lobby_item(current_lobby, cmd[1].name, name1, name2);
      if(!lobby_form.open){
            in_lobby(cmd[1].name, cmd[1].status, cmd[1].owner.connection);
            for(var i = 0; i < cmd[1].clients.length; i++)
              add_client(cmd[1].clients[i].name, 'lobby_form_clients_list', lobby_form, 'client'+cmd[1].clients[i].connection);
          }
      else
            add_client(cmd[1].clients[cmd[1].clients.length-1].name, 'lobby_form_clients_list', lobby_form, 'client'+cmd[1].clients[cmd[1].clients.length-1].connection);

    }
    if (cmd[0].command == "close_lobby_form")
    {
      var lobby = document.getElementById('lobby_form');
      if(lobby.open)
            lobby.close("");
    }
    if (cmd[0].command == "disconnected_from_lobby")
    {
      var name1 = 'Empty Slot';
      var name2 = 'Empty Slot';
      if(cmd[1].teams[0].clients[0])
        name1 = cmd[1].teams[0].clients[0].name;
      if(cmd[1].teams[1].clients[0])
        name2 = cmd[1].teams[1].clients[0].name;
      var current_lobby = document.getElementById(cmd[1].owner.connection);
      set_values_lobby_item(current_lobby, cmd[1].name, name1, name2)
      if(lobby_form.open){
        remove_clients('.lobby_form_team1_slot', lobby_form);
        remove_clients('.lobby_form_team2_slot', lobby_form);
        for(var i = 0; i < cmd[1].teams[0].clients.length; i++)
              add_client(cmd[1].teams[0].clients[i].name, 'lobby_form_team1_list', lobby_form, 'client'+cmd[1].teams[0].clients[i].connection);
        for(var i = 0; i < cmd[1].teams[1].clients.length; i++)
              add_client(cmd[1].teams[1].clients[i].name, 'lobby_form_team2_list', lobby_form, 'client'+cmd[1].teams[1].clients[i].connection);


        var lobby_form_clients_list = document.querySelector('#' + 'lobby_form_clients_list');
        var list_of_clients = lobby_form_clients_list.querySelectorAll('.'+'lobby_form_clients_slot');
        for(var i = 0; i < list_of_clients.length; i++){
          list_of_clients[i].remove();
        }

        for(var i = 0; i < cmd[1].clients.length; i++)
              add_client(cmd[1].clients[i].name, 'lobby_form_clients_list', lobby_form, 'client'+cmd[1].clients[i].connection);
      }
      //all_lobbys.replaceChild(add_lobby_item(splitted_str[1], splitted_str[2], 'Empty Slot', splitted_str[4]), lobby);
    }

    if (cmd[0].command == "in_team")
    {
      var current_lobby = document.getElementById(cmd[1].owner.connection);
      var name1 = 'Empty Slot';
      var name2 = 'Empty Slot';
      if(cmd[1].teams[0].clients[0])
        name1 = cmd[1].teams[0].clients[0].name;
      if(cmd[1].teams[1].clients[0])
        name2 = cmd[1].teams[1].clients[0].name;

      set_values_lobby_item(current_lobby, cmd[1].name, name1, name2);
      if(lobby_form.open){
        remove_clients('.lobby_form_team1_slot', lobby_form);
        remove_clients('.lobby_form_team2_slot', lobby_form);
            for(var i = 0; i < cmd[1].teams[0].clients.length; i++)
              add_client(cmd[1].teams[0].clients[i].name, 'lobby_form_team1_list', lobby_form, 'client'+cmd[1].teams[0].clients[i].connection);
            for(var i = 0; i < cmd[1].teams[1].clients.length; i++)
              add_client(cmd[1].teams[1].clients[i].name, 'lobby_form_team2_list', lobby_form, 'client'+cmd[1].teams[1].clients[i].connection);
          }
            
    }
    //if (splitted_str[0] == "delete_lobby")
    //{
    //  var all_lobbys = document.getElementById("lobbys_id");
    //  var current_lobby = document.getElementById(splitted_str[1]);
    //  all_lobbys.removeChild(current_lobby);
    //}
    //if (splitted_str[0] == "joined_in_lobby")
    //{
    //  var current_lobby = document.getElementById(splitted_str[4]);
    //  set_values_lobby_item(current_lobby, 'te', 'pl1', 'pl2');
    //  in_lobby(splitted_str[1],'lobby_status','team1_name','team2_name', document.getElementById('login').innerHTML);
    //}
    //if (splitted_str[0] == "close_lobby")
    //{
    //  var lobby = document.getElementById('lobby_form');
    //  if(lobby.open)
    //        lobby.close("");
    //}
    //if (splitted_str[0] == "disconnected_from_lobby")
    //{
    //  var all_lobbys = document.getElementById("lobbys_id");
    //  var lobby = document.getElementById(splitted_str[4]);
    //  //all_lobbys.replaceChild(add_lobby_item(splitted_str[1], splitted_str[2], 'Empty Slot', splitted_str[4]), lobby);
    //}
};

sc.socket.onopen = function() {
  console.log("Соединение установлено.");
  this.send('my_name ' +document.getElementById('login').innerHTML);
};

var create_lobby_item = function(id){
  var LBItem = document.createElement("li");
      LBItem.setAttribute('class', 'LBItem');
      LBItem.setAttribute('id', id);

  var LBItemBG = document.createElement("div");
      LBItemBG.setAttribute('class', 'LBItemBG');

  var LBItemTop = document.createElement("div");
      LBItemTop.setAttribute('class', 'LBItemTop');
  var LBItemName = document.createElement("label");
      LBItemName.setAttribute('class', 'LBItemName');
      LBItemName.appendChild(document.createTextNode('lobby_name'));

  var LBItemMiddle = document.createElement("div");
      LBItemMiddle.setAttribute('class', 'LBItemMiddle');
  var LBItemMiddleMapPreview = document.createElement("div");
      LBItemMiddleMapPreview.setAttribute('class', 'LBItemMiddleMapPreview');
  var map_preview = document.createElement("img");
      map_preview.setAttribute('width', '128');
      map_preview.setAttribute('height', '128');
      map_preview.setAttribute('src', 'static/Textures/perekatipole.jpg');
  var LBItemMiddleLobbyStatys = document.createElement("div");
      LBItemMiddleLobbyStatys.setAttribute('class', 'LBItemMiddleLobbyStatys');
  var player1 = document.createElement("label");
      player1.setAttribute('class', 'LBItemMiddleLobbyStatysPlayer');
      player1.appendChild(document.createTextNode('p1_name'));
  var duel_img = document.createElement("img");
      duel_img.setAttribute('width', '64');
      duel_img.setAttribute('height', '64');
      duel_img.setAttribute('src', 'static/Textures/duel.png');
  var player2 = document.createElement("label");
      player2.setAttribute('class', 'LBItemMiddleLobbyStatysPlayer');
      player2.appendChild(document.createTextNode('p2_name'));


  var LBItemBottom = document.createElement("div");
      LBItemBottom.setAttribute('class', 'LBItemBottom');
  var join_button = document.createElement("button");
      join_button.appendChild(document.createTextNode("Join!"));

  var join_form = document.createElement("form");
      join_form.setAttribute('action', '#');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////Присоединиться
      join_form.onclick = function(){
        var current_lobby = document.getElementById(id);
        var current_lobby_name = current_lobby.querySelector('.'+'LBItemName');
        var lobby_name = current_lobby_name.innerHTML;
        sc.send('connected_to_lobby ' + 'lobby_form'+id);
        //in_lobby(lobby_name, 'lobby_status','team1_name','team2_name', 'owner');
      }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var join_form_input = document.createElement("input");
      join_form_input.setAttribute('type', 'submit');
      join_form_input.setAttribute('value', 'Join');
  join_form.appendChild(join_form_input);

  LBItemTop.appendChild(LBItemName);

  //LBItemBottom.appendChild(join_button);
  LBItemBottom.appendChild(join_form);

  LBItemMiddleMapPreview.appendChild(map_preview);

  LBItemMiddleLobbyStatys.appendChild(player1);
  LBItemMiddleLobbyStatys.appendChild(duel_img);
  LBItemMiddleLobbyStatys.appendChild(player2);

  LBItemMiddle.appendChild(LBItemMiddleMapPreview);
  LBItemMiddle.appendChild(LBItemMiddleLobbyStatys);

  LBItemBG.appendChild(LBItemTop);
  LBItemBG.appendChild(LBItemMiddle);
  LBItemBG.appendChild(LBItemBottom);

  LBItem.appendChild(LBItemBG);
  return LBItem;
}

function set_values_lobby_item(lobby_item,lobby_name, player1_name, player2_name ){
  var old_lobby_name = lobby_item.querySelector('.' + 'LBItemName');
  var old_players_names = lobby_item.querySelectorAll('.' + 'LBItemMiddleLobbyStatysPlayer');
  var old_player1_name = old_players_names[1];
  var old_player2_name = old_players_names[0];

  var new_lobby_name = old_lobby_name;
  var new_player1_name = old_player1_name;
  var new_player2_name = old_player2_name;
  new_lobby_name.innerHTML = lobby_name;
  new_player1_name.innerHTML = player1_name;
  new_player2_name.innerHTML = player2_name;

  lobby_item.replaceChild(new_lobby_name, old_lobby_name);
  lobby_item.replaceChild(old_player1_name, new_player1_name);
  lobby_item.replaceChild(old_player2_name, new_player2_name);
}