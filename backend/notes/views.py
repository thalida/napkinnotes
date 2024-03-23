from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import mixins, permissions, viewsets

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
        return self.queryset.filter(id=self.request.user.id)
