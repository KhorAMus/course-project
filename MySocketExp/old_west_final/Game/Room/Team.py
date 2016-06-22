import json


class Team:
    def __init__(self, team_name, slots, team_id):
        self.clients = list()
        self.slots = slots
        self.name = team_name
        self.team_id = team_id

    # Если в этой комнате есть свободные слоты то помещаем клиента в него и отправляем True (значит успешно)
    def add_client(self, client):
        if len(self.clients) != self.slots:
            self.clients.append(client)
            return True
        return False

    def remove_client(self, client):
        if client in self.clients:
            self.clients.remove(client)

    # Проверка на пустоту команды
    def is_empty(self):
        if len(self.clients) == 0:
            return True
        else:
            return False

    # Проверка на готовность команды
    def is_ready(self):
        if 0 < len(self.clients) <= self.slots and self.clients_ready():
            return True
        else:
            return False

    # Проверка на готовность игроков в команде
    def clients_ready(self):
        for client in self.clients:
            if client.status.status == 0:
                return False
        return True

    def encode_json(self):
        from old_west.Game.Lobby import encode_list
        return {
            'clients': encode_list(self.clients),
            'slots': json.dumps(self.slots),
            'name': self.name,
            'team_id': json.dumps(self.team_id)
        }
