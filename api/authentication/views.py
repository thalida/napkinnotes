from django.shortcuts import render  # noqa: F401
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action

from authentication.models import User
from authentication.serializers import UserSerializer


@extend_schema_view(
    retrieve=extend_schema(exclude=True),
    me=extend_schema(summary="Retrieve me"),
)
class UserViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(id=self.request.user.id)

    @action(detail=False, methods=["get"], url_path="me")
    def me(self, request, *args, **kwargs):
        self.kwargs["pk"] = request.user.id
        return self.retrieve(request, *args, **kwargs)
