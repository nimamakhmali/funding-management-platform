from django.db import migrations, models
import django.core.validators
import shared.validators
import uuid


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="email",
            field=models.EmailField(blank=True, db_index=True, max_length=254, null=True),
        ),
        migrations.AlterUniqueTogether(
            name="user",
            unique_together={},
        ),
        migrations.AlterIndexTogether(
            name="user",
            index_together={},
        ),
        migrations.AddField(
            model_name="userprofile",
            name="profile_type",
            field=models.CharField(
                blank=True,
                choices=[("INDIVIDUAL", "حقیقی"), ("LEGAL_ENTITY", "حقوقی")],
                db_index=True,
                max_length=20,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="first_name",
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="last_name",
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="date_of_birth",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="contact_number",
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="entity_type",
            field=models.CharField(
                blank=True,
                choices=[("COMPANY", "شرکت"), ("ORGANIZATION", "سازمان")],
                max_length=20,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="company_name_persian",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="company_name_latin",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="ceo_name",
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="surname",
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="country",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="province",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="postal_code",
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddIndex(
            model_name="userprofile",
            index=models.Index(fields=["profile_type"], name="user_profil_profile_f3d123_idx"),
        ),
    ]
