import json

from game.Area import Area
from game.Circle import Circle
from game.Player import Player
from game.Vector2 import Vector2


class Session:
    __slots__ = ['players', 'session_object', 'count', 'session_area', 'callback_time']

    def __init__(self, callback_time):
        self.players = list()
        self.session_area = Area(500, 500)
        self.session_object = Circle(Vector2(200, 200), 20, self.session_area)
        self.count = 0
        self.callback_time = callback_time

# Добавление игрока. Добавляем игрока к списку игроков с сессии и добавляем его вектор другим игрокам.
    def add_player(self, connection):
        new_player = Player(self.session_object, connection, self.count)
        self.players.append(new_player)
        self.count += 1

# Удаление игрока. Проверяем по всем соединениям игроков в текущей сессии и удаляем того кто отключился.
    def delete_player(self, connection):
        for player in self.players:
            if connection == player.connection:
                self.players.remove(player)
                self.count -= 1

    def update_motion_vectors(self):
        for player in self.players:
            for oth_player in self.players:
                if oth_player.motion not in player.friendly_motions and oth_player != player:
                    #print(str(oth_player.motion_vector))
                    player.friendly_motions.append(oth_player.motion)

    def send_data_to_server(self):
        for player in self.players:
            player.send_message()
            player.friendly_motions.clear()

    def calc(self):
        total_motion_vector = Vector2(0, 0)
        self.update_motion_vectors()
        for player in self.players:
            self.session_object.inc_position(player.motion.motion_vector)
            player.parsec(self.callback_time)
            total_motion_vector += player.motion.motion_vector
        self.session_object.motion_vector = total_motion_vector.normalize()

    def parse_commands(self, commands, connection):
        for player in self.players:
            if connection == player.connection:
                player.add_commands(commands)

    def manipulation(self):
        add_vector = Vector2(0, 0)
        for player in self.players:
            add_vector += player.motion_vector
        self.session_object.inc_position(add_vector)
