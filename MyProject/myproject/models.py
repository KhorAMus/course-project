import datetime
import logging
from sqlalchemy import (
    Column,
    Index,
    Integer,
    Text,
    ForeignKey,
    Unicode,
    DateTime,
    String)

from sqlalchemy.orm import backref, relationship
from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import (
    relationship,
    scoped_session,
    sessionmaker,
)

from pyramid.security import (
    Allow,
    Everyone,
)

from zope.sqlalchemy import ZopeTransactionExtension

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()


class User(Base):
    __tablename__ = 'Users'
    id = Column(Integer, primary_key=True)
    email = Column(String(50), nullable=False)
    other = Column(String, nullable=False, default="")
    def __repr__(self):
        return "<UserEntity(%r, %r)>" % (self.email, self.other)

import hashlib
class Account(Base):
    __tablename__ = 'Accounts'
    id = Column(Integer, primary_key=True)
    nick = Column(Unicode(20), nullable=False)
    user_id = Column(Integer, ForeignKey(User.id), nullable=False)
    user = relationship(User, backref ="accounts")
    password_hash = Column(Unicode(255), nullable=False)
    other = Column(String, nullable=False, default="")

    def set_password(self, password):

        self.password_hash = hashlib.sha512(password.encode('utf-8')).hexdigest()
    def verify_password(self, password):

        return hashlib.sha512(password.encode('utf-8')).hexdigest() == self.password_hash


    def __repr__(self):
        return "<AccountEntity(%r, %r, %r)>" % (self.nick, self.password_hash, self.other)

class Game(Base):
    __tablename__ = 'Games'
    id = Column(Integer, primary_key=True)
    winner_id = Column(Integer, ForeignKey(Account.id), nullable=False)
    winner = relationship(Account, foreign_keys = [winner_id], backref ="victories")
    looser_id = Column(Integer, ForeignKey(Account.id), nullable=False)
    looser = relationship(Account, foreign_keys = [looser_id], backref ="defeats")
    date_time = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    other = Column(String, nullable=False, default="")

    def __repr__(self):
        return "<GameEntity(%r, %r)>" % (self.date_time, self.other)


class RootFactory(object):
    __acl__ = [(Allow, 'group:editors', (
    'pyramid_sacrud_home', 'pyramid_sacrud_create', 'pyramid_sacrud_update', 'pyramid_sacrud_delete',
    'pyramid_sacrud_list')), ]

    def __init__(self, request):
        pass
