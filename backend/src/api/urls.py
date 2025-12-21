"""
API URL Configuration
"""
from django.urls import path
from rest_framework.routers import DefaultRouter

app_name = 'api'

# Create a router for ViewSets
router = DefaultRouter()

# Register your ViewSets here
# router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    # Add your API endpoints here
    # path('example/', ExampleView.as_view(), name='example'),
]

urlpatterns += router.urls



