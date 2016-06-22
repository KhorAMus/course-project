import json


class Client:
    def __init__(self, connection, name):
        self.connection = connection
        self.name = name

    def write_message(self, message):
        self.connection.write_message(message)

    def encode_json(self):
        return {
            'connection': (str(self.connection)),
            'name': self.name
        }
