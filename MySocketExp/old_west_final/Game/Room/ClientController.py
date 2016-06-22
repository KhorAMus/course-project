from old_west_final.Game.Room.Rooms_controller import RoomsController


class ClientController:
    clients = list()

    def __init__(self):
        pass

    @staticmethod
    def add_client(new_client):
        # Если клиент уже подключен, то он не может подключиться еще раз
        if new_client in ClientController.clients:
            return
        ClientController.clients.append(new_client)

    @staticmethod
    def remove_client(client):
        if client not in ClientController.clients:
            return
        ClientController.clients.remove(client)

    @staticmethod
    def remove_room_for_all(room):
        print('remove_room_for_all')
        RoomsController.remove_room(room)
        for client in ClientController.clients:
            client.remove_room(room)
            client.write_message(room.lobby_delete_message())
