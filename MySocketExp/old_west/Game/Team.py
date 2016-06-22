import json



class Team:
    def __init__(self, team_name, slots, team_id):
        self.clients = list()
        self.slots = slots
        self.name = team_name
        self.team_id = team_id

    def add_client(self, client):
        if len(self.clients) != self.slots:
            self.clients.append(client)

    def remove_client(self, client):
        if client in self.clients:
            self.clients.remove(client)

    def is_empty(self):
        if len(self.clients) == 0:
            return True
        else:
            return False

    def encode_json(self):
        from old_west.Game.Lobby import encode_list
        return {
            'clients': encode_list(self.clients),
            'slots': json.dumps(self.slots),
            'name': json.dumps(self.name),
            'team_id': json.dumps(self.team_id)
        }