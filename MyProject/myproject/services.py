from .models import (DBSession, Account, User, Game)
from paginate_sqlalchemy import SqlalchemyOrmPage
import sqlalchemy
import logging
class AddToDbError(Exception):
    def __init__(self, message):
        self.message = message
    def __str__(self):
        return repr(self.message)

class UserAccountService(object):

    @classmethod
    def user_by_email(cls, email):
        """
        Find user by email
        :param email: user email
        :return: User with this email. None if nobody wasn't found.
        """
        return DBSession.query(User).filter(User.email.like(email)).first()

    @classmethod
    def account_by_email_nick(cls, email, nick):
        """
        Find account by user email and account nick
        :param email: user email
        :param nick: account nickname
        :return: Account with this email. None if account wasn't found.
        """
        user = cls.user_by_email(email)
        if user == None:
            return None
        for user_account in user.accounts:
            if user_account.nick == nick:
                return user_account
        return None

    @classmethod
    def account_by_email_password(cls, email, password):
        user = cls.user_by_email(email)
        if user == None:
            return None
        for user_account in user.accounts:
            if user_account.verify_password(password):
                return user_account
        return None

    @classmethod
    def change_password(cls,user_entity,account_entity, new_password):
        if cls.account_by_email_password(user_entity.email, new_password):
            raise AddToDbError("Account with this password (password's hash) already exist")
        account_entity.set_password(new_password)

    @classmethod
    def add_user(cls, email):
        # check that this email in db exist
        if cls.user_by_email(email):
            raise AddToDbError("User with email \"{0}\" already exist.".format(email))
        DBSession.add(User(email = email))

    @classmethod
    def add_account(cls, user_entity, account_nick, account_password):
        if cls.account_by_email_password(user_entity.email, account_password):
            raise AddToDbError("Account with this password (password's hash) already exist")
        new_account = Account()
        new_account.nick = account_nick
        new_account.set_password(account_password)
        user_entity.accounts.append(new_account)


class GameService(object):

    @classmethod
    def add_game(cls, winner_id, defeated_id):
        game_to_add = Game(winner_id = winner_id, looser_id = defeated_id)
        DBSession.add(game_to_add)

    @classmethod
    def get_all_date_order(cls):
        return DBSession.query(Game).order_by(sqlalchemy.desc(Game.date_time))

    @classmethod
    def get_account_date_order(cls, account_id):
        return cls.get_all_date_order().filter(sqlalchemy.or_(Game.looser_id == account_id, Game.winner_id == account_id))

    @classmethod
    def get_game_by_id(cls, id):
        return DBSession.query(Game).filter(Game.id == id).first()

    @classmethod
    def get_paginator(cls, request,account_id = None, page = 1):
        if account_id:
            query = cls.get_account_date_order(account_id)
        else:
            query = cls.get_all_date_order()
        logging.info("games found: {0}".format(len(query.all())))
        query_params = request.GET.mixed()
        def url_maker(link_page):
            query_params['page'] = link_page
            return request.current_route_url(_query=query_params)
        return SqlalchemyOrmPage(query, page, items_per_page=5, url_maker=url_maker)





        
        




