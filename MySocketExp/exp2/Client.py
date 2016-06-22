import socket

from msvcrt import getch


def send_message(connect, message):
    connect.send(message.encode("utf-8"))
    # conn.setblocking(0)
    data = b""
    tmp = connect.recv(1024)
    while tmp:
        data += tmp
        tmp = connect.recv(1024)
    print(data.decode("utf-8"))


def input_doing(connect, key):
    if key == 27:  # ESC
        send_message(connect, "command 27")
    elif key == 13:  # Enter
        send_message(connect, "command 13")
    elif key == 224:  # Special keys (arrows, f keys, ins, del, etc.)
        key = ord(getch())
        if key == 80:  # Down arrow
            send_message(connect, "command 80")
        elif key == 72:  # Up arrow
            send_message(connect, "command 72")


conn = socket.socket();
conn.connect(("127.0.0.1", 14900))
send_message(conn, "command up")
while 1:
    print("ttt")
    print(ord(getch()))
    input_doing(conn, ord(getch()))
conn.close()
