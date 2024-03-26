from django.conf import settings
from cryptography.fernet import Fernet
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import mixins, permissions, viewsets
from rest_framework.response import Response

from .models import Note
from .serializers import NoteSerializer

@extend_schema_view(
    retrieve=extend_schema(summary="Retrieve note"),
    update=extend_schema(summary="Update note"),
    partial_update=extend_schema(exclude=True),
)
class NotesViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user.id)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        note_content = request.data.get("content", "")

        fernet = Fernet(settings.FERNET_SECRET_KEY)
        encrypted_content = fernet.encrypt(note_content.encode("utf-8"))
        instance.content = encrypted_content
        instance.save()

        response = NoteSerializer(instance)
        return Response(response.data)
