import json

from game2.game.Area import Area
from game2.game.Client import Client
from game2.game.Pilot import Pilot
from game2.game.Planet import Planet
from game2.game.Ship import Ship
from game2.game.Vector2 import Vector2


class Session:
    __slots__ = ['clients', 'area', 'ships', 'planets']

    def __init__(self):
        self.clients = list()
        self.area = Area(700, 700)
        self.ships = list()  # Ship(Vector2(100, 100), Vector2(50, 60))
        self.planets = list()
        self.planets.append(Planet(Vector2(self.area.width/2, self.area.height/2), Vector2(130, 130)))

    def add_client(self, connection):
        new_ship = Ship(Vector2(100, 100), Vector2(50, 60))
        # self.ships.append(new_ship)
        new_client = Pilot(connection, new_ship)  # Pilot(connection, self.ship) #Client(connection, self.ship)
        self.clients.append(new_client)

    def remove_client(self, connection):
        for client in self.clients:
            if client.connection == connection:
                self.clients.remove(client)

    def encode_list_of_ships(self):
        result = list()
        for c in self.clients:
            result.append(c.ship.encode_json())
        return result

    def encode_list_of_planet(self):
        result = list()
        for planet in self.planets:
            result.append(planet.encode_json())
        return result

    def encode_json(self, client):
        return {
            'area': self.area.encode_json(),
            # 'ship': self.ship.encode_json()
            'ships': self.encode_list_of_ships(),
            'client': client.encode_json(),
            'planets': self.encode_list_of_planet()
        }

    def send_data_to_clients(self):
        for client in self.clients:
            client.write_message(json.dumps("sd"))

    def calculate_session(self, time):
        for client in self.clients:
            client.calculate_client(time)

        for planet in self.planets:
            planet.calculate_object(time)

        #for ship in self.ships:
        #    ship.calculate_object()

    def parse_from_client(self, connection, commands):
        for client in self.clients:
            if client.connection == connection:
                client.parse_commands(commands)
