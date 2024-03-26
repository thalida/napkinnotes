from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import Note


@admin.register(Note)
class NoteAdmin(ModelAdmin):
    list_display = ("user", "created_at", "updated_at")
    search_fields = ["user__email", "content"]
    list_filter = ["user"]
    readonly_fields = ["user", "created_at", "updated_at"]
