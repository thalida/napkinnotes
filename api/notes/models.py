from django.db import models

from api.models import BaseModel


class Note(BaseModel):
    user = models.ForeignKey("authentication.User", on_delete=models.CASCADE, related_name="notes")
    content = models.BinaryField(
        blank=True,
        default=b"",
        help_text="Encrypted content of the note.",
    )
    is_hidden = models.BooleanField(
        default=False,
        help_text="Flag to hide the note from the user.",
    )

    def __str__(self):
        return f"{self.user}"
