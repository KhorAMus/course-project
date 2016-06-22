from old_west_final.Game.Game.WorldObject import WorldObject
from old_west_final.Game.Game.ClientControl import ClientControl


class Shooter(WorldObject):

    def __init__(self, position, size, view, texture, angle):
        super().__init__(position, size, view, texture)
        self.angle = angle

    def set_avatar(self, client):
        self.client = client
        self.control = ClientControl(self, client)

    def encode_json(self):
        return {
            'size': self.size.encode_json(),
            'position': self.position.encode_json(),
            'view': self.view.encode_json(),
            'texture': self.texture,
            'angle': self.angle
        }