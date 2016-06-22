import json


class Color:
    __slots__ = ['r', 'g', 'b', 'a']

    def __init__(self, r, g, b, a):
        self.r = r
        self.g = g
        self.b = b
        self.a = a

    def encode_json(self):
        return {
            'r': json.dumps(self.r),
            'g': json.dumps(self.g),
            'b': json.dumps(self.b),
            'a': json.dumps(self.a)
        }
