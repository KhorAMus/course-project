import json

from game2.game.RotatableObject import RotatableObject


class Ship(RotatableObject):
    models = {1: '../static/Textures/Ships/ship3.png'}

    def __init__(self, position, size):
        super().__init__(position, size)
        self.model = self.models[1]

    def encode_json(self):
        return {
            'position': self.position.encode_json(),
            'angle': json.dumps(self.angle),
            'start_view': self.start_view.encode_json(),
            'view': self.view.encode_json(),
            'size': self.size.encode_json(),
            'turn_rate': json.dumps(self.turn_rate),
            'bounding_box': self.bounding_box.encode_json(),
            'model': self.model
        }
