from game2.game.Key import Key
from game2.game.Vector2 import Vector2


class Client:
    __slots__ = ['connection', 'ship', 'keys', 'client_view', 'client_mouse_position_in_area']

    def __init__(self, connection, ship):
        self.connection = connection
        self.client_view = Vector2(0, 0)
        self.client_mouse_position_in_area = Vector2(0, 0)
        self.ship = ship
        self.keys = list()

    def write_message(self, message):
        self.connection.write_message(message)

    def parse_commands(self, commands):
        splitted_command = commands.split(' ', 3)
        if splitted_command[0] == "Command":
            if splitted_command[1] == "MousePosition":
                self.client_mouse_position_in_area = Vector2((float(splitted_command[2])), (float(splitted_command[3])))
                self.client_view = self.client_mouse_position_in_area - self.ship.position
            if splitted_command[1] == "KeyDown":
                if splitted_command[2] not in self.keys:
                    self.keys.append(splitted_command[2])
            if splitted_command[1] == "KeyUp":
                for key in self.keys:
                    if key == splitted_command[2]:
                        self.keys.remove(key)

    def encode_json(self):
        return {
            'client_ship' : self.ship.encode_json()
        }

    def calculate_client(self, time):
        pass
        #self.client_view = self.client_mouse_position_in_area - self.ship.position
