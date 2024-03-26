# Generated by Django 5.0.3 on 2024-03-26 08:21

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("notes", "0004_alter_note_content"),
    ]

    operations = [
        migrations.AddField(
            model_name="note",
            name="is_hidden",
            field=models.BooleanField(
                default=False, help_text="Flag to hide the note from the user."
            ),
        ),
    ]