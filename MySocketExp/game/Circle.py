import json

from game.Vector2 import Vector2


class Circle:
    __slots__ = ['position', 'radius', 'minRadius', 'motion_vector', 'session_area']

    def __init__(self, position, radius, session_area):
        if position is None:
            self.position = Vector2(0, 0)
        else:
            self.position = position
        if radius is None:
            self.radius = 1
        else:
            self.radius = radius
        self.minRadius = 0
        self.motion_vector = Vector2(0, 0)
        self.session_area = session_area

    def inc_position(self, add_position):
        new_position = self.position + add_position
        if new_position.x > self.session_area.top_right.x - self.radius:
            new_position.x = self.session_area.top_right.x - self.radius
        if new_position.x < self.session_area.bottom_left.x + self.radius:
            new_position.x = self.session_area.bottom_left.x + self.radius
        if new_position.y < self.session_area.top_right.y + self.radius:
            new_position.y = self.session_area.top_right.y + self.radius
        if new_position.y > self.session_area.bottom_left.y - self.radius:
            new_position.y = self.session_area.bottom_left.y - self.radius
        self.position = new_position

    def inc_radius(self, add_radius):
        if self.radius + add_radius >= self.minRadius:
            self.radius += add_radius

    def encode_json(self):
        return {
            'position': self.position.encode_json(),
            'radius': json.dumps(self.radius),
            'motion_vector': self.motion_vector.encode_json()
        }
