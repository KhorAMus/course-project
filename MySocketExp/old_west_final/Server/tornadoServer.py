import json

import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.websocket

from old_west_final.Game.Room.ClientController import ClientController
from old_west_final.Game.Room.Command import Command
from old_west_final.Game.Room.Lobby import Lobby
from old_west_final.Game.Room.Rooms_controller import RoomsController
from tornado import websocket

from old_west_final.Server.Client import Client
from old_west_final.Server.Timers import Timers


def cb():
    send_commands_to_clients()


def send_commands_to_clients():
    pass
    # for client in clients:
    #    for l in lobbys:
    #        l.send_lobyes_info(client)
    # session.send_data_to_clients()


def calculate_world():
    RoomsController.calc_rooms()
    pass
    # session.calculate_session(cb_calculate_world_time)


def function_to_all_clients(func):
    for client in ClientController.clients: #clients:
        func(client)


def parser(cmd, client):
    for command in cmd.get('cmd'):
        if command == "create_lobby":
            if not client.is_have_room():
                new_lobby = Lobby(cmd.get('name'), cmd.get('pass'), client)
                RoomsController.add_room(new_lobby)
                function_to_all_clients(new_lobby.lobby_create_message)
                new_lobby.client_connected_to_lobby(client)
            else:
                error_message = Command('error')
                error_message.add_value({'error_message': 'У вас уже есть созданное лобби   '})
                client.write_message(error_message.get_message())

        if command == 'connected_to_lobby':
            for lobby in RoomsController.rooms:
                if lobby.id == cmd.get('name'):
                    lobby.client_connected_to_lobby(client)

        if command == 'my_name':
            for c in ClientController.clients:#clients:
                if c == client:
                    c.name = cmd.get('name')
                    c.cookie = cmd.get('cookie')



        if command == 'disconnected_from_lobby':
            for lobby in RoomsController.rooms:
                if lobby.id == cmd.get('name'):
                    if client.connection == lobby.owner.connection:
                        #function_to_all_clients(lobby.lobby_delete_message)
                        ClientController.remove_room_for_all(lobby)
                        for c in lobby.clients:
                            lobby.lobby_close_form_message(c)
                        RoomsController.remove_room(lobby)
                    else:
                        lobby.client_disconnected_from_lobby(client)

        if command == 'in_team':
            client.in_team(cmd.get('room_id'), cmd.get('team'))

        if command == 'set_status':
            client.status.switch()
            client.update_client_status()

        if command == 'game_command':
            pass

        client.game_parse(command, cmd)




def on_load_client(client):
    #for lobby in lobbys:
    for lobby in RoomsController.rooms:
        lobby.lobby_create_message(client)


class EchoWebSocket(websocket.WebSocketHandler):
    def data_received(self, chunk):
        pass

    def check_origin(self, origin):
        return True

    def open(self):
        print('typerequest--------------------------------------------')
        print(type(self.request))
        print('request--------------------------------------------')
        print(self.request)
        print('remote_ip--------------------------------------------')
        print(self.request.remote_ip)
        print('self--------------------------------------------')
        print(self)
        print('--------------------------------------------')

        # session.add_client(self)
        # connections.add(self)
        #clients.append(Client(self, 'noname'))

        ClientController.add_client(Client(self, 'no_name'))
        RoomsController.create_all_rooms_for_client(self)
        #self.write_message("opened on server")
        #on_load_client(self)
        print("WebSocket opened")

    def on_message(self, message):
        # self.write_message(u"You said: " + message)
        #print(message)
        message = json.loads(message)
        #print(message.get('cmd'))
        for client in ClientController.clients:#clients:
            if client.connection == self:
                parser(message, client)


    def on_close(self):
        #for lobby in lobbys:
         #   if lobby.owner.connection == self:
          #      for c in clients:
           #         if c.connection != self:
            #            lobby.lobby_close_form_message(c)
             #           lobby.lobby_delete_message(c)
              #  lobbys.remove(lobby)

        for c in ClientController.clients:#clients:
            if c.connection == self:
                ClientController.remove_client(c)#clients.remove(c)
                c.self_disconnect_from_all_rooms()
        print("WebSocket closed")


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r'/websocket', EchoWebSocket),
        ]

        tornado.web.Application.__init__(self, handlers)


if __name__ == '__main__':
    ws_app = Application()
    server = tornado.httpserver.HTTPServer(ws_app)
    server.listen(8080)

    mainLoop = tornado.ioloop.IOLoop.instance()
    tornado.ioloop.PeriodicCallback(calculate_world, Timers.cb_calculate_world_time, mainLoop).start()
    tornado.ioloop.PeriodicCallback(send_commands_to_clients, Timers.cb_response_clients_time, mainLoop).start()

    tornado.ioloop.IOLoop.instance().start()
