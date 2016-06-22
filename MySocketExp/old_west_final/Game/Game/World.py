import json


class World:
    def __init__(self, size, scale, texture):
        self.size = size
        self.scale = scale
        self.texture = texture

    def inc_size_x(self, inc):
        self.size.x += inc

    def inc_size_y(self, inc):
        self.size.y += inc

    def encode_json(self):
        return {
            'height': self.size.y,
            'width': self.size.x,
            'texture': self.texture
        }
