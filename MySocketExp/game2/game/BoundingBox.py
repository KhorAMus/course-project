from game2.game.Vector2 import Vector2


class BoundingBox:
    __slots__ = ['position', 'size', 'p1', 'p2', 'p3', 'p4']

    def __init__(self, position, size):
        self.position = position
        self.size = size
        self.p1 = Vector2(self.position.x - self.size.x/2, self.position.y - self.size.y/2)
        self.p2 = Vector2(self.position.x + self.size.x/2, self.position.y - self.size.y/2)
        self.p3 = Vector2(self.position.x + self.size.x/2, self.position.y + self.size.y/2)
        self.p4 = Vector2(self.position.x - self.size.x/2, self.position.y + self.size.y/2)

    def encode_json(self):
        return {
            'position': self.position.encode_json(),
            'size': self.size.encode_json(),
            'p1': self.p1.encode_json(),
            'p2': self.p2.encode_json(),
            'p3': self.p3.encode_json(),
            'p4': self.p4.encode_json()
        }

    def add_position(self, distance):
        self.p1 += distance
        self.p2 += distance
        self.p3 += distance
        self.p4 += distance

    def sub_position(self, distance):
        self.p1 -= distance
        self.p2 -= distance
        self.p3 -= distance
        self.p4 -= distance
