 var LobbyWindow = function(owner) {
  this.owner = owner;
 }


LobbyWindow.prototype.create_lobby = function  (lobby_name, lobby_status, team1_name, team2_name){
  var global_div = document.createElement("div");

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
      lobby_form_team1_slot.setAttribute('id', 'lobby_form_team1_slot');
  var lobby_form_team2_list = document.createElement("ul");
      lobby_form_team2_list.setAttribute('id', 'lobby_form_team2_list');
  var lobby_form_team2_name = document.createElement("li");
      lobby_form_team2_name.setAttribute('id', 'lobby_form_team2_name');
  var lobby_form_team2_slot = document.createElement("li");
      lobby_form_team2_slot.setAttribute('id', 'lobby_form_team2_slot');

  var lobby_form_bottom_place = document.createElement("div");
      lobby_form_bottom_place.setAttribute('id', 'lobby_form_bottom_place');
  var close_lobby_form = document.createElement("button");
      close_lobby_form.setAttribute('id', 'close_lobby_form');


      lobby_form_name.appendChild(document.createTextNode(lobby_name));
      lobby_form_name_place.appendChild(lobby_form_name);

      lobby_form_status.appendChild(document.createTextNode(lobby_status));
      lobby_form_status_place.appendChild(lobby_form_status);

      lobby_form_teams_place.appendChild(lobby_form_team1_list);
      lobby_form_team1_name.appendChild(document.createTextNode(team1_name));
      lobby_form_team1_list.appendChild(lobby_form_team1_name);
      lobby_form_team1_list.appendChild(lobby_form_team1_slot);
      lobby_form_team1_slot.appendChild(document.createTextNode(this.owner));
      lobby_form_teams_place.appendChild(lobby_form_team2_list);
      lobby_form_team2_name.appendChild(document.createTextNode(team2_name));
      lobby_form_team2_list.appendChild(lobby_form_team2_name);
      lobby_form_team2_list.appendChild(lobby_form_team2_slot);

      close_lobby_form.appendChild(document.createTextNode('Close'));
      lobby_form_bottom_place.appendChild(close_lobby_form);
      close_lobby_form.onclick = function() { 
        lobby_form.close("");
        while (lobby_form.hasChildNodes()) {
          lobby_form.removeChild(lobby_form.lastChild);
        }
      };

      global_div.appendChild(lobby_form_name_place);
      global_div.appendChild(lobby_form_status_place);
      global_div.appendChild(lobby_form_teams_place);
      global_div.appendChild(lobby_form_bottom_place);
      return global_div;
}