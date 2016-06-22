import json

import math

from game2.game.BoundingBox import BoundingBox
from game2.game.Vector2 import Vector2


class RotatableObject:
    __slots__ = ['position', 'angle', 'start_view', 'view', 'size', 'turn_rate', 'move_vector', 'speed', 'bounding_box']

    def __init__(self, position, size):
        self.position = position
        self.angle = 0
        self.start_view = Vector2(0, 1)
        self.view = Vector2(0, 1)
        self.move_vector = Vector2(0, 0)
        self.size = size
        self.speed = 700 / 1000

        self.bounding_box = BoundingBox(self.position, self.size)

        # Время поворота 180 градусов в секунду?
        self.turn_rate = 180 * 3.1415 / 360 / 300

    def encode_json(self):
        return {
            'position': self.position.encode_json(),
            'angle': json.dumps(self.angle),
            'start_view': self.start_view.encode_json(),
            'view': self.view.encode_json(),
            'size': self.size.encode_json(),
            'turn_rate': json.dumps(self.turn_rate),
            'bounding_box': self.bounding_box.encode_json()
        }

    def calc_angle(self, time):
        if self.start_view.length() != 0 and self.view.length() != 0:
            dot = self.start_view.normalize().dot_product(self.view.normalize())
            # print(dot)
            # ang = math.acos(dot / (
            #    self.start_view.normalize().length() * self.view.normalize().length()))


            Clockwise = self.start_view.x * self.view.y - self.start_view.y * self.view.x

            ang = self.turn_rate * time
            if Clockwise < 0:
                ang *= -1

            if dot != 1.0:
                self.angle += ang
                self.rotate(self.start_view, ang)

                self.bounding_box.sub_position(self.bounding_box.position)

                self.rotate(self.bounding_box.p1, ang)

                self.rotate(self.bounding_box.p2, ang)

                self.rotate(self.bounding_box.p3, ang)

                self.rotate(self.bounding_box.p4, ang)

                self.bounding_box.add_position(self.bounding_box.position)

    def calculate_object(self, time):
        self.calc_position(time)
        self.calc_angle(time)

    def rotate(self, point, ang):
        new_x = point.x * math.cos(ang) - point.y * math.sin(ang)
        new_y = point.x * math.sin(ang) + point.y * math.cos(ang)
        point.x = new_x
        point.y = new_y


    def calc_position(self, time):
        distance = self.move_vector * self.speed * time
        self.position += distance
        self.bounding_box.add_position(distance)
