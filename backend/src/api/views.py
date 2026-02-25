from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from funding.models import Project, ProjectStatus, UserProfile
from .serializers import ProjectSerializer, UserProfileSerializer


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only API for public projects.

    Exposes:
    - GET /api/v1/projects/        (list)
    - GET /api/v1/projects/{id}/   (detail)
    """

    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        visible_statuses = [
            ProjectStatus.APPROVED,
            ProjectStatus.FUNDING,
            ProjectStatus.ACTIVE,
            ProjectStatus.FUNDING_COMPLETED,
            ProjectStatus.COMPLETED,
        ]
        return (
            Project.objects.filter(status__in=visible_statuses)
            .select_related("owner")
            .order_by("-created_at")
        )


class UserProfileMeView(APIView):
    """
    Return the current authenticated user's profile.

    GET /api/v1/profile/me/
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            profile = request.user.profile
        except UserProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=404)

        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

