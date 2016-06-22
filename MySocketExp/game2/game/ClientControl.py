from game2.game.Key import Key


class ClientControl:
    __slots__ = ['keys', 'ship', 'client', 'x', 'y']

    key_codes = {'w': '87',
                 'a': '65',
                 's': '83',
                 'd': '68'}

    def __init__(self, ship, client):
        self.keys = {}
        self.ship = ship
        self.client = client
        self.add_key(Key(self.key_codes['w'], 1000), self.up_pressed)
        self.add_key(Key(self.key_codes['s'], 1000), self.down_pressed)
        self.add_key(Key(self.key_codes['a'], 1000), self.left_pressed)
        self.add_key(Key(self.key_codes['d'], 1000), self.right_pressed)
        self.x = 0
        self.y = 0

    def add_key(self, key, function):
        self.keys[key] = function

    def remove_key(self, key):
        self.keys.pop(key)

    def parse(self):

        for key in self.keys:
            key.unpressed()

        for key in self.keys:
            for k in self.client.keys:
                if key.key_code == k:
                    key.pressed()

    def calc(self, time):
        for key in self.keys:
            self.keys[key](key, time)

        self.ship.move_vector.x = self.x
        self.ship.move_vector.y = self.y
        self.x = 0
        self.y = 0

        if self.ship.move_vector.length() > 1:
            self.ship.move_vector = self.ship.move_vector.normalize()

    def up_pressed(self, key, time):
        key.time(5*time)
        self.y -= key.get_normalize_pressed_value()

    def down_pressed(self, key, time):
        key.time(5*time)
        self.y += key.get_normalize_pressed_value()

    def left_pressed(self, key, time):
        key.time(5*time)
        self.x -= key.get_normalize_pressed_value()

    def right_pressed(self, key, time):
        key.time(5*time)
        self.x += key.get_normalize_pressed_value()

from game2.game.Key import Key

