class Key:
    __slots__ = ['key_code', 'pressed_time', 'millisecond_to_max_press', 'is_pressed']

    def __init__(self, key_code):
        self.key_code = key_code
        self.pressed_time = 0
        self.millisecond_to_max_press = 500
        self.is_pressed = False

    def inc_pressed_time(self, time):
        if self.pressed_time + time <= self.millisecond_to_max_press:
            self.pressed_time += time
        else:
            self.pressed_time = self.millisecond_to_max_press

    def dec_pressed_time(self, time):
        if self.pressed_time - time >= 0:
            self.pressed_time -= time
        else:
            self.pressed_time = 0

    def clear_pressed_time(self):
        self.pressed_time = 0

    def get_normalize_pressed_value(self):
        return self.pressed_time / self.millisecond_to_max_press

    def time(self, time):
        if self.is_pressed:
            self.inc_pressed_time(time)
        else:
            self.dec_pressed_time(time)

    def pressed(self):
        self.is_pressed = True