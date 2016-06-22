class Status:
    statuses = {'Ready': 1,
                'Not Ready': 0,
                'In Game': 2}

    def __init__(self):
        self.status = 0

    def is_in_game(self):
        if self.status == Status.statuses["In Game"]:
            return True
        else:
            return False

    def set_ready(self):
        self.status = Status.statuses["Ready"]

    def set_not_ready(self):
        self.status = Status.statuses["Not Ready"]

    def set_in_game(self):
        self.status = Status.statuses["In Game"]

    def switch(self):
        if self.status == 1:
            self.status = 0
        else:
            self.status = 1
