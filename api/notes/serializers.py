from django.conf import settings
from cryptography.fernet import Fernet
from rest_framework import serializers

from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    content = serializers.SerializerMethodField()

    def get_content(self, obj):
        fernet = Fernet(settings.FERNET_SECRET_KEY)
        return fernet.decrypt(bytes(obj.content)).decode("utf-8")

    class Meta:
        model = Note
        fields = [
            "id",
            "created_at",
            "updated_at",
            "content",
        ]
