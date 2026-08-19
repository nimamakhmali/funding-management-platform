"""
Django Signals برای کاربران
"""
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver


from .models import UserProfile

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_related_records(sender, instance, created, **kwargs):
    """ایجاد پروفایل و کیف پول پس از ثبت کاربر"""
    if not created:
        return

    from apps.users.infrastructure.models import UserProfile
    from apps.investments.infrastructure.models import Wallet

    UserProfile.objects.get_or_create(user=instance)
    Wallet.objects.get_or_create(user=instance)



@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def ensure_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)