from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status, permissions, serializers
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Sum, Count
from django.utils import timezone
from .models import LoanApplication, UserProfile, Transaction
from .serializers import (
    LoanApplicationSerializer, 
    UserProfileSerializer,
    UserSerializer,
    LoginSerializer,
    TransactionSerializer,
    DashboardSerializer
)

# Create your views here.

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Create UserProfile if it doesn't exist
            UserProfile.objects.get_or_create(user=user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user:
                # Ensure UserProfile exists
                UserProfile.objects.get_or_create(user=user)
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileViewSet(viewsets.ModelViewSet):
    # Temporarily removing authentication for testing
    permission_classes = [permissions.AllowAny]
    serializer_class = UserProfileSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        # If user is authenticated, filter by user; otherwise show all
        if self.request.user.is_authenticated:
            return UserProfile.objects.filter(user=self.request.user)
        return UserProfile.objects.all()

    def perform_create(self, serializer):
        # For testing purposes - if not authenticated, use a default user
        if not self.request.user.is_authenticated:
            user = User.objects.first()
            if not user:
                raise serializers.ValidationError({
                    "error": "No default user available for testing"
                })
            serializer.save(user=user)
        else:
            serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        # For testing purposes - if not authenticated, use a default user
        if not request.user.is_authenticated:
            user = User.objects.first()
            if not user:
                return Response({"error": "No default user available for testing"}, 
                              status=status.HTTP_400_BAD_REQUEST)
            profile, created = UserProfile.objects.get_or_create(user=user)
        else:
            profile = self.get_queryset().first()
            if not profile:
                profile = UserProfile.objects.create(user=request.user)
        
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        profile = self.get_queryset().first()
        if not profile:
            profile = UserProfile.objects.create(user=request.user)
        
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoanApplicationViewSet(viewsets.ModelViewSet):
    # Temporarily removing authentication for testing
    permission_classes = [permissions.AllowAny]
    serializer_class = LoanApplicationSerializer

    def get_queryset(self):
        # If user is authenticated, filter by user; otherwise show all
        if self.request.user.is_authenticated:
            return LoanApplication.objects.filter(user=self.request.user)
        return LoanApplication.objects.all()

    def perform_create(self, serializer):
        # For testing purposes - if not authenticated, use a default user or admin
        if not self.request.user.is_authenticated:
            # Use the first available user or admin
            default_user = User.objects.first()
            if not default_user:
                raise serializers.ValidationError({
                    "error": "No default user available for testing"
                })
            serializer.save(user=default_user, status='pending')
        else:
            # Normal authenticated flow
            # Check if user has completed their profile
            profile = UserProfile.objects.filter(user=self.request.user).first()
            if not profile or not profile.monthly_income:
                raise serializers.ValidationError({
                    "error": "Please complete your profile with monthly income before applying for a loan"
                })

            # Check if user has any defaulted loans
            has_defaulted_loans = LoanApplication.objects.filter(
                user=self.request.user,
                status='approved'
            ).exists()

            if has_defaulted_loans:
                raise serializers.ValidationError({
                    "error": "You have existing loans that need to be paid"
                })

            serializer.save(user=self.request.user, status='pending')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"error": "You don't have permission to view this loan"},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def active_loans(self, request):
        active_loans = self.get_queryset().filter(status='approved')
        serializer = self.get_serializer(active_loans, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel_application(self, request, pk=None):
        loan = self.get_object()
        if loan.status != 'pending':
            return Response(
                {"error": "Only pending loans can be cancelled"},
                status=status.HTTP_400_BAD_REQUEST
            )
        loan.status = 'cancelled'
        loan.save()
        return Response({"message": "Loan application cancelled successfully"})

class DashboardView(APIView):
    # Temporarily removing authentication for testing
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # For testing purposes - if not authenticated, use a default user
        if not request.user.is_authenticated:
            user = User.objects.first()
            if not user:
                return Response({"error": "No default user available for testing"}, 
                               status=status.HTTP_400_BAD_REQUEST)
        else:
            user = request.user
            
        # Get or create profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        loans = LoanApplication.objects.filter(user=user)
        active_loans = loans.filter(status='approved')
        
        # Calculate loan metrics
        total_loan_amount = active_loans.aggregate(Sum('amount'))['amount__sum'] or 0
        monthly_payments = sum(loan.calculate_monthly_payment() for loan in active_loans)
        
        dashboard_data = {
            'user_info': {
                'name': f"{user.first_name} {user.last_name}",
                'monthly_income': profile.monthly_income,
                'employment_status': profile.employment_status
            },
            'loan_summary': {
                'total_loans': loans.count(),
                'active_loans': active_loans.count(),
                'total_loan_amount': total_loan_amount,
                'monthly_payments': monthly_payments
            },
            'recent_transactions': Transaction.objects.filter(user=user)
                .order_by('-created_at')[:5],
            'active_loans_details': active_loans,
            'pending_applications': loans.filter(status='pending')
        }
        
        serializer = DashboardSerializer(dashboard_data)
        return Response(serializer.data)

class TransactionViewSet(viewsets.ModelViewSet):
    # Temporarily removing authentication for testing
    permission_classes = [permissions.AllowAny]
    serializer_class = TransactionSerializer

    def get_queryset(self):
        # If user is authenticated, filter by user; otherwise show all
        if self.request.user.is_authenticated:
            return Transaction.objects.filter(user=self.request.user).order_by('-created_at')
        return Transaction.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        # For testing purposes - if not authenticated, use a default user
        if not self.request.user.is_authenticated:
            user = User.objects.first()
            if not user:
                raise serializers.ValidationError({
                    "error": "No default user available for testing"
                })
            serializer.save(user=user, created_at=timezone.now())
        else:
            # Validate transaction
            transaction_type = serializer.validated_data.get('transaction_type')
            amount = serializer.validated_data.get('amount')
            related_loan = serializer.validated_data.get('related_loan')

            if transaction_type == 'loan_repayment' and related_loan:
                if related_loan.user != self.request.user:
                    raise serializers.ValidationError({
                        "error": "Invalid loan reference"
                    })
                
                if related_loan.status != 'approved':
                    raise serializers.ValidationError({
                        "error": "Can only make payments for approved loans"
                    })

            serializer.save(
                user=self.request.user,
                created_at=timezone.now()
            )
