from django.conf import settings
from cryptography.fernet import Fernet
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from authentication.models import User
from notes.serializers import NoteSerializer


class UserSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    initials = serializers.SerializerMethodField()
    note = serializers.SerializerMethodField()

    @extend_schema_field(NoteSerializer())
    def get_note(self, obj):
        note = obj.notes.first()
        return NoteSerializer(note).data if note else None

    @extend_schema_field(serializers.CharField())
    def get_display_name(self, obj):
        return obj.display_name

    @extend_schema_field(serializers.CharField())
    def get_initials(self, obj):
        initials = "".join(list(map(lambda name: name[0].upper(), obj.display_name.split(" "))))
        return initials

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "display_name", "initials", "note"]
