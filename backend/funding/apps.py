from django.apps import AppConfig


class FundingConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "funding"
    verbose_name = "Funding / Investment Management"

    def ready(self):
        # Import signal handlers to wire up model events
        from . import signals  # noqa: F401

