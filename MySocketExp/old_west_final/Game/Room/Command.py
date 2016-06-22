import json


class Command:
    def __init__(self, command):
        self.message = list()
        self.message.append({'command': command})
        pass

    def add_value(self, value):
        self.message.append(value)

    def add_values(self, values):
        for value in values:
            self.add_value(value)

    def get_message(self):
        return json.dumps(self.message)
