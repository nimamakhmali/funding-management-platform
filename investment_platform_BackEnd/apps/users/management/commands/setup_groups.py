from django.apps import apps as django_apps
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "ساخت/به‌روزرسانی گروه‌های Operators و Observers طبق RFP (پنل ادمین/اپراتور/ناظر)"

    OPERATOR_MODELS = [
        ("projects", "project"), ("projects", "projectstatushistory"), ("projects", "document"),
        ("support", "ticket"), ("support", "ticketmessage"),
        ("notifications", "notification"), ("profits", "profitperiod"),
    ]
    OBSERVER_MODELS = [
        ("projects", "project"), ("investments", "investment"), ("investments", "transaction"),
        ("investments", "wallet"), ("investments", "paymenttransaction"),
        ("profits", "profitperiod"), ("profits", "payoutitem"),
        ("support", "ticket"), ("notifications", "auditlog"), ("users", "user"),
    ]

    def handle(self, *args, **options):
        operators, _ = Group.objects.get_or_create(name="Operators")
        observers, _ = Group.objects.get_or_create(name="Observers")

        op_perms = []
        for app_label, model_name in self.OPERATOR_MODELS:
            model = django_apps.get_model(app_label, model_name)
            ct = ContentType.objects.get_for_model(model)
            codenames = [f"add_{model_name}", f"change_{model_name}", f"view_{model_name}"]
            op_perms += list(Permission.objects.filter(content_type=ct, codename__in=codenames))
        operators.permissions.set(op_perms)

        ob_perms = []
        for app_label, model_name in self.OBSERVER_MODELS:
            model = django_apps.get_model(app_label, model_name)
            ct = ContentType.objects.get_for_model(model)
            ob_perms += list(Permission.objects.filter(content_type=ct, codename=f"view_{model_name}"))
        observers.permissions.set(ob_perms)

        self.stdout.write(self.style.SUCCESS("گروه‌های Operators و Observers ساخته/به‌روزرسانی شدند."))
        self.stdout.write("برای تخصیص نقش: پنل ادمین → Users → انتخاب کاربر → بخش Groups")