import time
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.websocket
from tornado import websocket

from game2.game.Session import Session

cb_calculate_world_time = 1000 / 120
cb_response_clients_time = 1000 / 60

session = Session()


def cb():
    send_commands_to_clients()


def send_commands_to_clients():
    session.send_data_to_clients()


def calculate_world():
    session.calculate_session(cb_calculate_world_time)


class EchoWebSocket(websocket.WebSocketHandler):
    def data_received(self, chunk):
        pass

    def check_origin(self, origin):
        return True

    def open(self):
        print(type(self.request))
        print(self.request)
        print(self.request.remote_ip)
        session.add_client(self)
        # connections.add(self)
        print("WebSocket opened")

    def on_message(self, message):
        #self.write_message(u"You said: " + message)
        #print(message)
        session.parse_from_client(self, message)

    def on_close(self):
        # connections.remove(self)
        session.remove_client(self)
        print("WebSocket closed")


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r'/websocket', EchoWebSocket),
            (r'/index.html', EchoWebSocket),
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
