import json
import random

from game.Circle import Circle
from game.Color import Color
from game.Key import Key
from game.Motion import Motion
from game.Vector2 import Vector2


class Player:
    __slots__ = {'view', 'player_object', 'connection', 'commands', 'player_id',
                 'motion', '__key_a', '__key_d', '__key_w', '__key_s', '__key_q', '__key_e', 'friendly_motions'
                 }

    def __init__(self, player_object, connection, player_id):
        self.view = Vector2(0, -1).normalize()
        self.connection = connection
        self.player_object = player_object  # Circle(position, radius)
        self.commands = list()
        self.friendly_motions = list()
        self.player_id = player_id
        self.motion = Motion(Vector2(0, 0), 5, Color(random.randint(0,255),random.randint(0,255),random.randint(0,255),255))

        self.__key_a = Key('65')  # <-
        self.__key_d = Key('68')  # ->

        self.__key_w = Key('87')  # /\
        self.__key_s = Key('83')  # \/

        self.__key_q = Key('81')
        self.__key_e = Key('69')

    def __check_key(self, income_key, key, function):
        if income_key == key.key_code:
            function()

    def add_commands(self, cmd):
        att = cmd.split(" ", 2)
        if att[0] == "Command":
            if att[1] == "KeyDown":
                # print( str(self.player_id) + "added  ")
                if att[2] not in self.commands:
                    self.commands.append(att[2])
            if att[1] == "KeyUp":
                if att[2] in self.commands:
                    self.commands.remove(att[2])


            if att[1] == "MousePosition":
                print(att[2])

    def parsec(self, callback_time):
        # print(str(self.player_id) + "parsec  ")
        for c in self.commands:
            self.__check_key(c, self.__key_a, lambda: self.__key_a.pressed())
            self.__check_key(c, self.__key_w, lambda: self.__key_w.pressed())
            self.__check_key(c, self.__key_s, lambda: self.__key_s.pressed())
            self.__check_key(c, self.__key_d, lambda: self.__key_d.pressed())
            self.__check_key(c, self.__key_q, lambda: self.inc_size(1))
            self.__check_key(c, self.__key_e, lambda: self.inc_size(-1))

        self.__key_a.time(callback_time)
        self.__key_d.time(callback_time)
        self.__key_w.time(callback_time)
        self.__key_s.time(callback_time)
        self.__key_a.is_pressed = False
        self.__key_d.is_pressed = False
        self.__key_w.is_pressed = False

        self.__key_s.is_pressed = False

        nx = -self.__key_a.get_normalize_pressed_value() + self.__key_d.get_normalize_pressed_value()
        ny = self.__key_s.get_normalize_pressed_value() + -self.__key_w.get_normalize_pressed_value()

        if Vector2(nx, ny) <= Vector2(nx, ny).normalize():
            self.inc_position(Vector2(nx, ny))
        else:
            self.inc_position(Vector2(nx, ny).normalize())

    def send_message(self):
        # print( str(self.player_id) + "   " + str(self.encode_json()["motion_vector"]))
        self.connection.write_message(self.encode_json())

    def inc_position(self, add_position):
        self.motion.inc_motion_vector(add_position)

    def inc_size(self, add_size):
        self.player_object.inc_radius(add_size)

    def list_vectors_encode_json(self):
        result = list()
        for v in self.friendly_motions:
            result.append(v.encode_json())
        return result

    def encode_json(self):
        return {
            'view': self.view.encode_json(),
            'player_object': self.player_object.encode_json(),
            'motion': self.motion.encode_json(),
            'friendly_motions': self.list_vectors_encode_json()
        }
