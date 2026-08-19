from django.db import migrations, models
import django.core.validators
import shared.validators
import uuid


def populate_phone_number(apps, schema_editor):
    User = apps.get_model("users", "User")
    for user in User.objects.filter(phone_number__isnull=True):
        user.phone_number = f"+98{user.username[-10:]}" if len(user.username) >= 10 else f"+98{user.username}0000000000"
        user.save(update_fields=["phone_number"])


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0002_profile_completion_fields"),
    ]

    operations = [
        migrations.RunPython(populate_phone_number, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="user",
            name="phone_number",
            field=models.CharField(
                max_length=20,
                unique=True,
                db_index=True,
                validators=[
                    django.core.validators.RegexValidator(
                        message="شماره موبایل باید با +98 و سپس ۱۰ رقم باشد.",
                        regex="^\\+98\\d{10}$",
                    )
                ],
            ),
        ),
    ]
