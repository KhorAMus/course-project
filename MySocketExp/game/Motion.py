import json


class Motion:
    __slots__ = ['motion_vector', 'move_power', 'motion_color']

    def __init__(self, motion_vector, move_power, motion_color):
        self.motion_vector = motion_vector
        self.motion_color = motion_color
        self.move_power = move_power

    def inc_motion_vector(self, add_position):
        self.motion_vector = add_position * self.move_power  # .normalize()


    def encode_json(self):
        return {
            'move_power': json.dumps(self.move_power),
            'motion_vector': self.motion_vector.encode_json(),
            'motion_color': self.motion_color.encode_json()
        }