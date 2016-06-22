import json

from old_west.Game.Team import Team


def encode_list(elems_list):
    result = list()
    for el in elems_list:
        result.append(el.encode_json())
    return result


class Lobby:
    def __init__(self, name, password, owner):
        self.owner = owner
        self.name = name
        self.status = 'Waiting for players'
        self.password = password
        self.teams = list()
        self.clients = list()
        self.id = 'lobby_form' + str(self.owner.connection)
        team1 = Team('team1', 1, 'lobby_form_team1_list')
        team2 = Team('team2', 1, 'lobby_form_team2_list')
        self.teams.append(team1)
        self.teams.append(team2)

    def client_connected_to_lobby(self, client):
        if client not in self.clients:
            if client == self.owner:
                print('owner ' + client.name + ' connected to lobby')
            else:
                print('client ' + client.name + ' connected to lobby')
            self.clients.append(client)
            for c in self.clients:
                c.write_message(self.create_command('connected_to_lobby'))

    def client_disconnected_from_lobby(self, client):
        if client in self.clients:
            if client == self.owner:
                print('owner ' + client.name + ' disconnected from lobby')
            else:
                print('client ' + client.name + ' disconnected from lobby')
            self.clients.remove(client)
            for t in self.teams:
                if client in t.clients:
                    t.clients.remove(client)
            for c in self.clients:
                c.write_message(self.create_command('disconnected_from_lobby'))
            client.write_message(self.create_command('disconnected_from_lobby'))


    def lobby_delete_message(self, client):
        print('sended delete_lobby  to ' + client.name)
        delete_message = self.create_command('delete_lobby')
        client.write_message(delete_message)

    def lobby_create_message(self, client):
        message = self.create_command('create_lobby')
        client.write_message(message)

    def lobby_close_form_message(self, client):
        message = self.create_command('close_lobby_form')
        client.write_message(message)

    def in_team(self, client, team_id):
        for t in self.teams:
            if client in t.clients:
                t.clients.remove(client)

        if client not in self.teams[team_id].clients:
            self.teams[team_id].clients.append(client)
            for c in self.clients:
                c.write_message(self.create_command('in_team'))

    def create_command(self, command):
        message = list()
        message.append({'command': command})
        message.append(self.encode_json())
        result = json.dumps(message)
        return result

    def slots_in_teams(self):
        slots = 0
        for t in self.teams:
            slots += t.slots
        return slots

    def add_client(self, client, team):
        if client not in self.clients and len(self.clients) < self.slots_in_teams():
            self.clients.append(client)

        for c in self.clients:
            message = list()
            message.append({'command': 'joined_in_lobby'})
            message.append(self.encode_json())
            client.write_message(json.dumps(message))

    def encode_json(self):
        return {
            'owner': self.owner.encode_json(),
            'name': self.name,
            'password': self.password,
            'teams': encode_list(self.teams),
            'clients': encode_list(self.clients),
            'status': self.status
        }
