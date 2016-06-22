import json
import time
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.websocket
from tornado import websocket

from game2.game.Session import Session
from old_west.Game.Lobby import Lobby
from old_west.Server.Client import Client

cb_calculate_world_time = 1000 / 120
cb_response_clients_time = 1000 / 60

session = Session()
clients = list()
lobbys = list()


def cb():
    send_commands_to_clients()


def send_commands_to_clients():
    pass
    # for client in clients:
    #    for l in lobbys:
    #        l.send_lobyes_info(client)
    # session.send_data_to_clients()


def calculate_world():
    pass
    # session.calculate_session(cb_calculate_world_time)


def function_to_all_clients(func):
    for client in clients:
        func(client)


def parser(cmd, client):
    splitted = cmd.split(' ')

    if splitted[0] == 'create_lobby':
        new_lobby = Lobby(splitted[1], splitted[2], client)
        lobbys.append(new_lobby)
        function_to_all_clients(new_lobby.lobby_create_message)
        new_lobby.client_connected_to_lobby(client)

    if splitted[0] == 'disconnected_from_lobby':
        split2 = cmd.split(' ', 1)
        for lobby in lobbys:
            if lobby.id == split2[1]:
                if client.connection == lobby.owner.connection:
                    function_to_all_clients(lobby.lobby_delete_message)
                    for c in lobby.clients:
                        lobby.lobby_close_form_message(c)
                    lobbys.remove(lobby)
                else:
                    lobby.client_disconnected_from_lobby(client)


    if splitted[0] == 'connected_to_lobby':
        split2 = cmd.split(' ', 1)
        for lobby in lobbys:
            if lobby.id == split2[1]:
                lobby.client_connected_to_lobby(client)

    if splitted[0] == 'in_team':
        for l in lobbys:
            for c in l.clients:
                if c == client:
                    if splitted[1] == "1":
                        l.in_team(c, 0)
                    if splitted[1] == "2":
                        l.in_team(c, 1)


    if splitted[0] == 'my_name':
        for c in clients:
            if c == client:
                c.name = splitted[1]


def on_load_client(client):
    for lobby in lobbys:
        lobby.lobby_create_message(client)


class EchoWebSocket(websocket.WebSocketHandler):
    def data_received(self, chunk):
        pass

    def check_origin(self, origin):
        return True

    def open(self):
        print(type(self.request))
        print(self.request)
        print(self.request.remote_ip)
        # session.add_client(self)
        # connections.add(self)
        clients.append(Client(self, 'noname'))
        self.write_message("opened on server")
        on_load_client(self)
        print("WebSocket opened")

    def on_message(self, message):
        # self.write_message(u"You said: " + message)
        print(message)

        for c in clients:
            if c.connection == self:
                parser(message, c)
                # session.parse_from_client(self, message)

    def on_close(self):
        # connections.remove(self)
        # session.remove_client(self)
        for lobby in lobbys:
            if lobby.owner.connection == self:
                for c in clients:
                    if c.connection != self:
                        lobby.lobby_close_form_message(c)
                        lobby.lobby_delete_message(c)
                lobbys.remove(lobby)
        for c in clients:
            if c.connection == self:
                clients.remove(c)
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
    tornado.ioloop.PeriodicCallback(calculate_world, cb_calculate_world_time, mainLoop).start()
    tornado.ioloop.PeriodicCallback(send_commands_to_clients, cb_response_clients_time, mainLoop).start()

    tornado.ioloop.IOLoop.instance().start()
