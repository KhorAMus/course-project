from game2.game.Client import Client
from game2.game.ClientControl import ClientControl
from game2.game.Vector2 import Vector2


class Pilot(Client):
    __slots__ = ['control']

    def __init__(self, connection, ship):
        super().__init__(connection, ship)
        self.control = ClientControl(ship, self)

    def write_message(self, message):
        self.connection.write_message(message)

    def set_ship_view(self):
        self.ship.view = self.client_view

    def set_ship_move_vector(self, time):
        self.control.parse()
        self.control.calc(time)

    def calculate_client(self, time):
        self.client_view = self.client_mouse_position_in_area - self.ship.position
        self.set_ship_move_vector(time)
        self.set_ship_view()
        self.ship.calculate_object(time)

