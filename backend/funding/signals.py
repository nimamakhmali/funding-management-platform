from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import UserProfile, Wallet


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_related_models(sender, instance, created, **kwargs):
    """
    Ensure each user has a profile and a wallet right after creation.
    This keeps API و منطق مالی ساده‌تر و قابل اتکا.
    """
    if not created:
        return

    # Create profile if missing
    UserProfile.objects.get_or_create(user=instance)

    # Create wallet if missing
    Wallet.objects.get_or_create(user=instance)

