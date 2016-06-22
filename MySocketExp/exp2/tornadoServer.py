import time
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.websocket
from tornado import websocket

from game.Session import Session

callback_time = 1000 / 1000

last_time = time.time() * 1000
calc_time = 1000 / 250

connections = set()
session = Session(callback_time)

def cb():
    send_commands_to_clients()


def send_commands_to_clients():
    global calc_time
    global last_time
    current_time = time.time() * 1000
    if current_time - last_time > calc_time:
        session.calc()
        last_time = current_time
    session.send_data_to_server()



def check_origin(self, origin):
    return True


class EchoWebSocket(websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        print(type(self.request))
        print(self.request)
        print(self.request.remote_ip)
        connections.add(self)
        session.add_player(self)
        print("WebSocket opened")

    def on_message(self, message):
        # self.write_message(u"You said: " + message)
        session.parse_commands(message, self)

    def on_close(self):
        connections.remove(self)
        session.delete_player(self)
        print("WebSocket closed")

    def on_pong(self, data):
        print('got pong', data)


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
    tornado.ioloop.PeriodicCallback(cb, callback_time, mainLoop).start()

    tornado.ioloop.IOLoop.instance().start()
