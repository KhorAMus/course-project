from game2.game.RotatableObject import RotatableObject


class Planet(RotatableObject):
    def __init__(self, position, size):
        super().__init__(position, size)
        self.turn_rate = 180 * 3.1415 / 360 / 10000


    def calc_angle(self, time):
        if self.start_view.length() != 0 and self.view.length() != 0:
            ang = self.turn_rate * time
            self.angle += ang
            self.rotate(self.start_view, ang)
            self.bounding_box.sub_position(self.bounding_box.position)
            self.rotate(self.bounding_box.p1, ang)
            self.rotate(self.bounding_box.p2, ang)
            self.rotate(self.bounding_box.p3, ang)
            self.rotate(self.bounding_box.p4, ang)
            self.bounding_box.add_position(self.bounding_box.position)
