from django.db import transaction
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from rest_framework import permissions, viewsets, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action

from funding.models import (
    Project,
    ProjectStatus,
    UserProfile,
    Wallet,
    Transaction,
    TransactionType,
)
from funding.services import process_investment
from .serializers import (
    ProjectSerializer,
    ProjectCreateSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer,
    InvestmentCreateSerializer,
    InvestmentSerializer,
    WalletSerializer,
    TransactionSerializer,
)

# ============================================================================
# 1. AUTHENTICATION & PROFILE
# ============================================================================

class RegisterView(generics.CreateAPIView):
    """
    Endpoint: POST /api/v1/auth/register/
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileMeView(APIView):
    """
    Endpoint: GET/PUT /api/v1/profile/me/
    مشاهده و ویرایش پروفایل کاربر جاری
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # اگر پروفایل نبود، بساز (Fail-safe)
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = get_object_or_404(UserProfile, user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================================
# 2. PROJECTS (Public Read + Entrepreneur Write)
# ============================================================================

class ProjectViewSet(viewsets.ModelViewSet):
    """
    Endpoints:
    - GET /api/v1/projects/ (Public)
    - POST /api/v1/projects/ (Entrepreneur only)
    - GET /api/v1/projects/{id}/ (Public)
    """
    queryset = Project.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ProjectCreateSerializer
        return ProjectSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # اینجا می‌توان پرمژن IsEntrepreneur هم اضافه کرد
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        # برای ادمین همه چیز را برگردان
        if self.request.user.is_staff:
            return Project.objects.all().order_by("-created_at")
        
        # برای عموم فقط پروژه‌های قابل نمایش
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

    def perform_create(self, serializer):
        # پروژه جدید همیشه با وضعیت PENDING_REVIEW و مالکیت کاربر جاری ساخته می‌شود
        serializer.save(
            owner=self.request.user,
            status=ProjectStatus.PENDING_REVIEW,
            raised_amount=0
        )


# ============================================================================
# 3. FINANCIAL & INVESTMENT (THE CORE LOGIC)
# ============================================================================

class WalletView(APIView):
    """
    Endpoint: GET /api/v1/wallet/
    مشاهده موجودی کیف پول
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        serializer = WalletSerializer(wallet)
        return Response(serializer.data)


class MockDepositView(APIView):
    """
    Endpoint: POST /api/v1/wallet/deposit/
    (فقط جهت تست - شارژ کیف پول بدون درگاه بانکی)
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount')
        if not amount or float(amount) <= 0:
            return Response({"error": "Invalid amount"}, status=400)

        with transaction.atomic():
            wallet = Wallet.objects.select_for_update().get(user=request.user)
            wallet.balance += int(amount)
            wallet.save()

            Transaction.objects.create(
                user=request.user,
                amount=amount,
                type=TransactionType.DEPOSIT,
                is_successful=True,
                reference_id=f"MOCK-{request.user.id}"
            )

        return Response({"status": "Deposited", "new_balance": wallet.balance})


class InvestmentView(APIView):
    """
    Endpoint: POST /api/v1/invest/
    اصلی‌ترین بخش سامانه: ثبت سرمایه‌گذاری با کنترل همزمانی
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = InvestmentCreateSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            try:
                investment = process_investment(
                    user=request.user,
                    project=serializer.validated_data["project"],
                    amount=serializer.validated_data["amount"],
                )
                return Response(
                    InvestmentSerializer(investment).data,
                    status=status.HTTP_201_CREATED,
                )
            except ValidationError as e:
                # خطای بیزنسی/اعتباری
                detail = e.message_dict if hasattr(e, "message_dict") else e.messages
                return Response({"error": detail}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": str(e)}, status=500)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)