import transaction
import pyramid.httpexceptions as exc
from pyramid.response import Response
from pyramid.view import view_config
from pyramid.authentication import AuthTktCookieHelper
import logging
from pyramid.view import (
    view_config,
    forbidden_view_config,
    )

from pyramid.security import (
    remember,
    forget,
    authenticated_userid)

from pyramid.httpexceptions import (
    HTTPFound,
    HTTPNotFound,
    )
from sqlalchemy import Column
from sqlalchemy.exc import DBAPIError

from myproject import DBSession
from myproject.models import User
from myproject.services import UserAccountService, GameService, AddToDbError

@view_config(route_name='game',  renderer='templates/game.jinja2')
def game_view(request):
    return {'login': authenticated_userid(request)}

def split_remembering(userid):
    pipeline_pos= userid.find("|")
    email = userid[:pipeline_pos]
    nick = userid[pipeline_pos+1:]
    return (email, nick)



@view_config(route_name='home', renderer='templates/main.jinja2')
def my_view(request):
    userid=authenticated_userid(request)
    if userid:
        email, nick = split_remembering(userid)
        return {'project': 'MyProject', 'login': authenticated_userid(request), 'name':nick, 'email':email}
    else:
        return HTTPFound(location = request.route_url('login'))

@view_config(route_name = 'account_info', renderer='templates/account_info.jinja2')
def account_info_view(request):
    page = int(request.params.get('page', 1))
    email = request.matchdict.get('email', '')
    nick = request.matchdict.get('nick', '')
    found_acc = UserAccountService.account_by_email_nick(email, nick)
    if not found_acc:
        return exc.HTTPNotFound()
    games_paginator = GameService.get_paginator(request,found_acc.id, page)
    return {"email":email, "nickname":nick, "paginator":games_paginator}



@view_config(route_name='login', renderer='templates/login.jinja2')
def login(request):
    login_url = request.route_url('login')
    referrer = request.url
    if referrer == login_url:
        referrer = '/' # never use the login form itself as came_from
    came_from = request.params.get('came_from', referrer)
    message = ''
    email = ''
    password = ''
    if 'form.submitted' in request.params:
        email = request.params['login']
        password = request.params['password']
        found_account = UserAccountService.account_by_email_password(email, password)

        if found_account != None:
            headers = remember(request, found_account.user.email  + "|" + found_account.nick)

            return HTTPFound(location = came_from,
                             headers = headers)
        message = 'Failed login'

    return dict(
        message = message,
        url = request.application_url + '/login',
        came_from = came_from,
        login = email,
        password = password,
        )


@view_config(route_name='logout')
def logout(request):
    headers = forget(request)
    return HTTPFound(location = request.route_url('login'),
                     headers = headers)

@view_config(route_name='index_submit')
def index_submit (request):
    from sqlalchemy.util import OrderedDict
    message = 'Parameter a = {}, and parameter b = {}'.format(request.GET['usermail'], request.GET['password'])
    return Response(str(request)+ '\n' + str(message) + '\n' + str(request.query_string), content_type='text/plain', status_int=500)

@view_config(route_name='registration', renderer='templates/registration.jinja2')
def registration_view(request):
    #logging.info("Registration opened")
    registration_url = request.route_url('registration')
    referrer = request.url
    if referrer == registration_url:
        referrer = '/' # never use the login form itself as came_from
    came_from = request.params.get('came_from', referrer)
    message = ''
    email = ''
    nickname = ''
    password = ''
    if 'form.submitted' in request.params:
        email = request.params['email']
        nickname = request.params['nickname']
        password = request.params['password']
        try:
            UserAccountService.add_user(email)
        except AddToDbError as addToDbError:
            message = addToDbError.message
            logging.info(message)
        else:
            UserAccountService.add_account(UserAccountService.user_by_email(email), nickname, password)
    return dict(
        message = message,
        url = request.application_url + '/registration',
        main_url = request.application_url,
        came_from = came_from,
        email = email,
        nickname = nickname,
        password = password,
        )

@view_config(route_name='trybd')
def trybd(request):
    from pyramid.security import (
    effective_principals)
    eff_principals = str(effective_principals(request))
    return Response(eff_principals, content_type='text/plain')

conn_err_msg = """\
Pyramid is having a problem using your SQL database.  The problem
might be caused by one of the following things:
1.  You may need to run the "initialize_test2_db" script
    to initialize your database tables.  Check your virtual
    environment's "bin" directory for this script and try to run it.
2.  Your database server may not be running.  Check that the
    database server referred to by the "sqlalchemy.url" setting in
    your "development.ini" file is running.
After you fix the problem, please restart the Pyramid application to
try it again.
"""