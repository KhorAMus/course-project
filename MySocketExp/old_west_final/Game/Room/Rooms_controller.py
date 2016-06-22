class RoomsController:
    rooms = list()

    def __init__(self):
        pass

    @staticmethod
    def calc_rooms():
        for room in RoomsController.rooms:
            room.calc()

    @staticmethod
    def add_room(room):
        if room in RoomsController.rooms:
            return
        # Нельзя создать комнаты с одинаковыми именами
        for r in RoomsController.rooms:
            if r.name == room.name:
                return
        RoomsController.rooms.append(room)

    @staticmethod
    def remove_room(room):
        if room not in RoomsController.rooms:
            return
        RoomsController.rooms.remove(room)

    @staticmethod
    def create_all_rooms_for_client(client):
        for room in RoomsController.rooms:
            room.lobby_create_message(client)
