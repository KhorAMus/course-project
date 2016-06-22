class ClientControl:

    key_codes = {'w': '87',
                 'a': '65',
                 's': '83',
                 'd': '68'}

    def __init__(self, shooter, client):
        self.keys = {}
        self.shooter = shooter
        self.client = client
#libGDX    Box2D

    def press(self, key):
        print("user " + self.client.name+" press "+ str(key))

        if key == 87:
            self.shooter.position.y -= 1

        if key == 83:
            self.shooter.position.y += 1

        if key == 65:
            self.shooter.position.x -= 1

        if key == 68:
            self.shooter.position.x += 1
        print("x : " + str(self.shooter.position.x))
        print("y : " + str(self.shooter.position.y))
