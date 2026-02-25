"""
API URL Configuration (v1)
"""
from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ProjectViewSet, UserProfileMeView

app_name = "api"

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")

urlpatterns = [
    path("profile/me/", UserProfileMeView.as_view(), name="profile-me"),
] + router.urls





