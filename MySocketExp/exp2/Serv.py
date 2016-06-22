import socket

commands = list()

sock = socket.socket()
sock.bind(("", 14900))
sock.listen(10)

#sock.setblocking(0)

while 1:
    conn, addr = sock.accept()
    data = conn.recv(16348)
    udata = data.decode("utf-8")
    print("Income Data: " + udata)
    conn.send(b"Hello from Server! \n")

    att = udata.split(" ", 2)
    if(att[0] == "command"):
        conn.send(b"Command added \n")
        commands.append(att[1])

    #conn.send(b"Your data: \n" + udata.encode("utf-8"))
    conn.send(b"All Commands \n")
    counterCommands = 0;
    for i in commands:
        conn.send(b"cmd " + str(counterCommands).encode("utf-8") + b": " +i.encode("utf-8") + b"\n")
        counterCommands+=1
    conn.close()
