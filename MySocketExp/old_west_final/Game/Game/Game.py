import random

from old_west_final.Game.Game.Shooter import Shooter
from old_west_final.Game.Game.World import World
from old_west_final.Game.Math.Vector2 import Vector2
from old_west_final.Game.Room.Command import Command
from old_west_final.Server.Timers import Timers


class Game:
    def __init__(self):
        self.world = World(Vector2(800, 500), Vector2(1, 1), '../static/Textures/town.jpg')
        self.player1 = Shooter(Vector2(self.world.size.x - self.world.size.x / 4, self.world.size.y - self.world.size.y / 5)
                               , Vector2(self.world.size.y / 3, self.world.size.y / 3)
                               , Vector2(1, 0), "../static/Textures/Cowboy1.png", 0)
        self.player2 = Shooter(Vector2(self.world.size.x / 4,  self.world.size.y - self.world.size.y / 5)
                               , Vector2(self.world.size.y / 3, self.world.size.y / 3)
                               , Vector2(1, 0), "../static/Textures/Cowboy2.png", 180)

        self.player1_win_count = 0
        self.player2_win_count = 0

        self.what_to_press = random.randint(65, 90)
        self.winner = None

        self.time = 3.0 * 1000
        self.animate_time = 1.0*1000
        self.death_time = 1.0*1000
        self.text = "Жми "+str(self.time)+" !"

        self.rounds = 5
        self.current_round = 0

    def parse(self, client, command, cmd):
        if command == 'key_up':
            cmd.get('key')
            print("user "+client.name+" unpress "+ str(cmd.get('key')))

        if command == 'key_down':

            if self.time - Timers.cb_calculate_world_time <= 0 and cmd.get('key') == self.what_to_press:
                if self.winner is None:
                    self.winner = client
                    if client == self.player1.client:
                        self.player1_win_count += 1
                    else:
                        self.player2_win_count += 1
                self.player2.texture = "../static/Textures/CowboyShooting2.png"
                self.player1.texture = "../static/Textures/CowboyShooting1.png"
                self.what_to_press = random.randint(65, 90)




        if command == 'mouse_position':
            cmd.get('pos')

    def get_room_message(self):
        room_command = Command('game_room')
        room_command.add_value({'world': self.world.encode_json(),
                                'player1': self.player1.encode_json(),
                                'player2': self.player2.encode_json(),
                                'text': self.text,
                                'rounds': self.rounds,
                                'current_round': self.current_round})
        return room_command.get_message()

    def set_shooters(self, team_int, team):
        if team_int == 1:
            self.player1.set_avatar(team.clients[0])
        if team_int == 2:
            self.player2.set_avatar(team.clients[0])

    def get_total_winner(self):
        if self.player1_win_count > self.player2_win_count:
            return self.player1
        else:
            return self.player2


    def calculate(self):
        if self.current_round == self.rounds:
            winner = self.get_total_winner().client

            if winner != self.player1.client:
                self.player2.texture = "../static/Textures/CowboyDead2.png"
                self.player1.texture = "../static/Textures/Cowboy1.png"
            else:
                self.player1.texture = "../static/Textures/CowboyDead1.png"
                self.player2.texture = "../static/Textures/Cowboy2.png"

            self.text = winner.name + " подбедил!"

            return

        if self.time - Timers.cb_calculate_world_time < 0:
            if self.winner is None:
                self.text = "Жми " + str(chr(self.what_to_press)) + " !"
                return

            if self.animate_time <= 0:
                if self.death_time <= 0:
                    self.time = 3.0*1000
                    self.animate_time = 1.0*1000
                    self.death_time = 0.5*1000
                    self.winner = None
                    self.current_round += 1
                    self.player2.texture = "../static/Textures/Cowboy2.png"
                    self.player1.texture = "../static/Textures/Cowboy1.png"
                else:
                    self.text =  self.winner.name + " быстрее!"
                    self.death_time -= Timers.cb_calculate_world_time

                    if self.winner != self.player1.client:
                        self.player2.texture = "../static/Textures/CowboyDead2.png"
                    else:
                        self.player1.texture = "../static/Textures/CowboyDead1.png"
            else:
                self.text = ''
                self.animate_time -= Timers.cb_calculate_world_time
        else:
            self.time -= Timers.cb_calculate_world_time
            self.text = str("{0:.2f}".format(round(self.time / 1000, 0)))






