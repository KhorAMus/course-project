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

    def add_client(self, connection):
        new_client = connection
        self.clients.append(new_client)

    def remove_client(self, connection):
        if connection in self.clients:
           self.clients.remove(connection)

    def encode_json(self, client):
        return {
            #'area': self.area.encode_json(),
            'client': client.encode_json()
        }

    def send_data_to_clients(self):
        for client in self.clients:
            client.write_message(self.encode_json(client))

    def calculate_session(self, time):
        pass
        #for client in self.clients:
         #   client.calculate_client(time)


    def parse_from_client(self, connection, commands):
        pass
#        for client in self.clients:
 #           if client.connection == connection:
  #              client.parse_commands(commands)
