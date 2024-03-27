from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from channels.security.websocket import WebsocketDenier
from django.http import HttpRequest
from django.utils.module_loading import import_string


class TokenAuthMiddleware(BaseMiddleware):
    @database_sync_to_async
    def _authenticate(self, token: str, token_type: str = "Bearer"):
        backend = import_string("oauth2_provider.contrib.rest_framework.OAuth2Authentication")()
        http_request = HttpRequest()
        http_request.META["Authorization"] = f"{token_type} {token}"
        return backend.authenticate(request=http_request)

    async def authenticate_user(self, scope) -> None:
        scope["user"] = None
        qs = parse_qs(scope["query_string"].decode("utf8"))
        token = qs.get("token", [None])[0]
        token_type = qs.get("token_type", ["Bearer"])[0]

        if not token:
            return

        user_res = await self._authenticate(token, token_type=token_type)

        if not user_res:
            return

        scope["user"] = user_res[0]

    async def __call__(self, scope, receive, send):
        await self.authenticate_user(scope)

        if not scope["user"]:
            denier = WebsocketDenier()
            return await denier(scope, receive, send)

        return await super().__call__(scope, receive, send)
