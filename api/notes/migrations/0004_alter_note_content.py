# Generated by Django 5.0.3 on 2024-03-26 07:20

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("notes", "0003_alter_note_user"),
    ]

    operations = [
        migrations.AlterField(
            model_name="note",
            name="content",
            field=models.BinaryField(
                blank=True, default=b"", help_text="Encrypted content of the note."
            ),
        ),
    ]