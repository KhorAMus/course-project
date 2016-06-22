from pyramid.config import Configurator
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy

from sqlalchemy import engine_from_config

from myproject.models import Base, DBSession
from .security import groupfinder

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine


    authn_policy = AuthTktAuthenticationPolicy('sosecret',callback=groupfinder , hashalg='sha512')
    authz_policy = ACLAuthorizationPolicy()

    config = Configurator(settings=settings, root_factory='.models.RootFactory')
    #config = Configurator(settings=settings)

    config.set_authentication_policy(authn_policy)
    config.set_authorization_policy(authz_policy)

    config.include('pyramid_jinja2')
    config.include('pyramid_sacrud',route_prefix='admin')
    settings = config.registry.settings
    settings['pyramid_sacrud.models'] = (('Project', []),)

    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_static_view('img', 'static/img', cache_max_age=3600)

    config.add_route('home', '/')
    config.add_route('login', '/login')
    config.add_route('logout', '/logout')
    config.add_route('index_submit', '/index_submit')
    config.add_route('trybd', '/test')
    config.add_route('game', '/game')
    config.add_route('account_info', '/account_info/{email}/{nick}')
    config.add_route('registration', '/registration')
    config.scan()

    return config.make_wsgi_app()
