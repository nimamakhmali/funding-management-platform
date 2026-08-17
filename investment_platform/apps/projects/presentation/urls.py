from rest_framework.routers import DefaultRouter
https://meet.google.com/tvp-mxet-xph from .views import ProjectViewSet

app_name = "projects"

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")

urlpatterns = router.urls