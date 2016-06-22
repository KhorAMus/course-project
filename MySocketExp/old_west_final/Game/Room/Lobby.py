import json

from old_west_final.Game.Game.Game import Game
from old_west_final.Game.Room.Command import Command
from old_west_final.Game.Room.Team import Team

from old_west_final.Game.Room.Rooms_controller import RoomsController
from old_west_final.Server.Timers import Timers


def encode_list(elems_list):
    result = list()
    for el in elems_list:
        result.append(el.encode_json())
    return result


class Lobby:
    def __init__(self, name, password, owner):
        self.owner = owner
        self.name = name
        self.status = 'Ожидаем игроков...'
        self.password = password
        self.teams = list()
        self.clients = list()
        self.id = 'lobby_form' + str(self.owner.connection)
        team1 = Team('Команда 1', 1, 'lobby_form_team1_list')
        team2 = Team('Команда 2', 1, 'lobby_form_team2_list')
        self.teams.append(team1)
        self.teams.append(team2)
        self.RoomsController = RoomsController
        self.time_before_game = 5.0 * 1000
        self.game_room = Game()

    def client_connected_to_lobby(self, client):
        if client not in self.clients:
            if client == self.owner:
                print('owner ' + client.name + ' connected to lobby')
            else:
                print('client ' + client.name + ' connected to lobby')
            self.clients.append(client)
            client.add_room(self)
            for c in self.clients:
                c.write_message(self.create_command('connected_to_lobby'))
            client.write_message(self.create_command('open_lobby'))
            client.status.set_not_ready()

    def client_disconnected_from_lobby(self, client):
        # Так как клиент больше не состоит в этой комнате, то емуне надо знать о ней
        client.remove_room(self)
        if client in self.clients:
            if client == self.owner:
                print('owner ' + client.name + ' disconnected from lobby')
            else:
                print('client ' + client.name + ' disconnected from lobby')
            self.clients.remove(client)
            # Удаляем клиента из команды если он в ней состоит
            for t in self.teams:
                if client in t.clients:
                    t.clients.remove(client)

            for c in self.clients:
                c.write_message(self.create_command('disconnected_from_lobby'))
            client.write_message(self.create_command('close_lobby'))
            client.status.set_not_ready()

    def client_update_lobby_item(self, client):
        message = list()
        message.append({'command': 'update_lobby'})
        message.append(self.encode_json())
        client.write_message(json.dumps(message))

    def lobby_delete_message(self):
        delete_command = Command('delete_lobby')
        delete_command.add_value({'id': self.id})
        return delete_command.get_message()

    def send_lobby_delete_message_to_all(self):
        delete_message = self.create_command('delete_lobby')
        delete_command = Command('delete_lobby')
        delete_command.add_value({'id': self.id})
        for client in self.clients:
            try:
                 print('sended delete_lobby  to ' + client.name)
                 client.write_message(delete_command.get_message())
            finally:
                pass
            # if not self.is_client_owner(client):
            #     print('sended delete_lobby  to ' + client.name)
            #     client.write_message(delete_message)

    def lobby_create_message(self, client):
        create_message = Command('create_lobby')
        create_message.add_value({'name': self.name,
                                  'id': self.id,
                                  'password': self.password,
                                  'status': self.status})
        client.write_message(create_message.get_message())


    def lobby_close_form_message(self, client):
        message = self.create_command('close_lobby')
        client.write_message(message)

    def send_lobby_close_form_message_to_all(self):
        message = self.create_command('close_lobby')
        for client in self.clients:
            if not self.is_client_owner(client):
                client.write_message(message)

    def create_command(self, command):
        message = list()
        message.append({'command': command})
        message.append(self.encode_json())
        result = json.dumps(message)
        return result

    def add_client(self, client, team):
        if client not in self.clients:
            self.clients.append(client)

        for c in self.clients:
            message = list()
            message.append({'command': 'joined_in_lobby'})
            message.append(self.encode_json())
            client.write_message(json.dumps(message))

    # Как только все готовы, начинается отсчет времени, до старта игры
    def calc(self):
        tick = Timers.cb_calculate_world_time
        teams_ready = True
        for team in self.teams:
            teams_ready &= team.is_ready()

        if teams_ready:
            self.time_before_game -= tick
            if self.time_before_game <= 0.0:
                if self.status != 'В игре':
                    self.status = 'В игре'
                    for client in self.clients:
                        client.close_all_except(self)
                        client.status.set_in_game()
                    self.update_room_status()
                    self.in_game()
                self.send_game()####
                self.calc_game()
            else:
                self.status = 'Игра начнется: ' + str("{0:.2f}".format(round(self.time_before_game / 1000, 2)))
                self.update_room_status()
        else:
            if self.status != 'Ожидаем игроков...':
                self.status = 'Ожидаем игроков...'
                self.time_before_game = 5.0 * 1000
                self.update_room_status()

    # Отправляем игровой мир, если комната в игре
    def send_game(self):
        for client in self.clients:
            client.write_message(self.game_room.get_room_message())
    def calc_game(self):
        self.game_room.calculate()


    # Отправляем всем в комнате состояние лобби, если все готовы
    def update_room_status(self):
        update_command = Command('update_room_status')
        update_command.add_value({'id': self.id, 'status': self.status})
        for client in self.clients:
            client.write_message(update_command.get_message())

    ############################################################

    # Отослать всем в комнате измененное состояниекомнаты и её участников
    def update_room(self):
        update_command = self.create_command('update_room')
        for client in self.clients:
            client.write_message(update_command)

    ####################################################################

    # Проверка на принадлежность клиента данной комнате
    def is_client_in_lobby(self, client):
        return client in self.clients

    ##################################################

    # Проверка на то что клиент является создателем комнаты
    def is_client_owner(self, client):
        return self.owner == client

    #######################################################

    # Запрос который переводит клиентов в комнате на страницу с игрой
    def in_game(self):
        self.game_room = Game()
        self.game_room.set_shooters(1, self.teams[0])
        self.game_room.set_shooters(2, self.teams[1])
        in_game_message = Command('in_game')
        for client in self.clients:
            client.write_message(in_game_message.get_message())

    #################################################################
    # Запрос который переводит клиента в команду и уведомляет всех кто в комнате
    def in_team(self, room_id, team_id, client):
        # Если id комнаты не тот, то прерываем выполнение команды (она не для этой комнаты)
        if room_id != self.id:
            return

        for t in self.teams:
            if t != self.teams[team_id]:
                if client in t.clients:
                    t.clients.remove(client)

        # Если клиента нет в команде
        if client not in self.teams[team_id].clients:
            # Если клиент не добавлен то отправляем ошибку
            if not self.teams[team_id].add_client(client):
                error_message = Command('error')
                error_message.add_value({'error_message': 'В команде нет свободных слотов'})
                client.write_message(error_message.get_message())
            # Если клиент добавлен отправляем новое состояние команд
            else:
                for c in self.clients:
                    team_message = Command('in_team')
                    team_message.add_value(
                        {'id': self.id, 'teams': encode_list(self.teams), 'clients': encode_list(self.clients),
                         'status': self.status})
                    c.write_message(team_message.get_message())
            ########################################################
        else:
            # Если клиент в команде, то отправляем ошибку
            error_message = Command('error')
            error_message.add_value({'error_message': 'Вы уже в этой команде'})
            client.write_message(error_message.get_message())

    ############################################################################

    ##Команды для игроков в игре будут идти в игровую комнату
    def command_in_game(self, command):
        self.game_room.parse(command)
    #########################################################

    def encode_json(self):
        return {
            'owner': self.owner.encode_json(),
            'name': self.name,
            'id': self.id,
            'password': self.password,
            'teams': encode_list(self.teams),
            'clients': encode_list(self.clients),
            'status': self.status
        }
