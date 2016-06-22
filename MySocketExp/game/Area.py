from game.Vector2 import Vector2


class Area:
    __slots__ = ['height', 'width', 'bottom_left', 'top_right']

    def __init__(self, height, width):
        self.height = height
        self.width = width
        self.bottom_left = Vector2(0, height)
        self.top_right = Vector2(width, 0)
