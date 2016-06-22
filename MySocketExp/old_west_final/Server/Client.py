from old_west_final.Game.Room.ClientController import ClientController
from old_west_final.Game.Room.Rooms_controller import RoomsController
from old_west_final.Server.Status import Status


class Client:
    def __init__(self, connection, name):
        self.connection = connection
        self.name = name
        self.cookie = 'none'
        self.rooms = list()
        self.status = Status()

    # Все что связанно с комнатами
    # Добавляем комнату в которой находится клиент
    def add_room(self, room):
        self.rooms.append(room)
    ##############################################

    # Если клиент меняет команду, то уведомляем об этом всех и применяем изменения
    def in_team(self, team_id, room_id):
        for room in self.rooms:
            room.in_team(team_id, room_id, self)

    # Если клиент выходит из комнаты, то о ней ему знать не надо(Удаляем её)
    def remove_room(self, room):
        if room in self.rooms:
            self.rooms.remove(room)

    # Если клиент изменил свое состояние, то нужно уведомить всех видящих его клиентов
    def update_client_status(self):
        for room in self.rooms:
            room.update_room()

    # Проверка на то что у пользователя уже есть созданная им комната
    def is_have_room(self):
        for room in self.rooms:
            if room.owner == self:
                return True
        return False

    # Закрыть или выйти из всех комнат кроме...
    def close_all_except(self, except_room):
        for room in self.rooms:
            if except_room != room:
                if room.is_client_owner(self):
                    RoomsController.remove_room(room)
                    room.send_lobby_close_form_message_to_all()
                    #room.send_lobby_delete_message_to_all()
                    ClientController.remove_room_for_all(room)
                else:
                    room.client_disconnected_from_lobby(self)
    ########################################################################

    # Когда клиент отключается от сервера, то ему надо покинуть все комнаты в которых он состоял
    def self_disconnect_from_all_rooms(self):
        for room in self.rooms:
            if room.is_client_owner(self):
                ClientController.remove_room_for_all(room)
                RoomsController.remove_room(room)
                room.send_lobby_close_form_message_to_all()
            else:
                room.client_disconnected_from_lobby(self)
    ############################################################################################

    # # Удалить комнату для этого клиента на сайте
    # def remove_room_site(self, room):
    #     self.remove_room(room)
    #     return room.lobby_delete_message()
    ###################################
    ##############################

    # Проверка на то что команда относится к игровой комнате
    def game_parse(self, command, cmd):
        if self.status.is_in_game():
            self.rooms[0].game_room.parse(self, command, cmd)

    # Метод для отправки сообщения кленту от сервера
    def write_message(self, message):
        self.connection.write_message(message)
    ################################################

    def encode_json(self):
        return {
            'connection': (str(self.connection)),
            'name': self.name,
            'status': self.status.status
        }
