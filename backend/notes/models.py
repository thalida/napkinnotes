from django.db import models

from backend.models import BaseModel


class Note(BaseModel):
    user = models.ForeignKey("authentication.User", on_delete=models.CASCADE, related_name="notes")
    content = models.TextField(
        blank=True,
        default="",
        help_text="Write your notes here.",
    )

    def __str__(self):
        return f"{self.user}"

    class Meta:
        constraints = [models.UniqueConstraint(fields=["user"], name="unique_user_note")]