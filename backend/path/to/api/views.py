from rest_framework import viewsets, permissions, serializers
from .models import LoanApplication, User

class LoanApplicationViewSet(viewsets.ModelViewSet):
    # Remove all permission restrictions for demo purposes
    permission_classes = [permissions.AllowAny]
    serializer_class = LoanApplicationSerializer

    def get_queryset(self):
        # Return all loan applications without filtering
        return LoanApplication.objects.all()

    def perform_create(self, serializer):
        # Get a default user (first available) and use it for all loan applications
        default_user = User.objects.first()
        if not default_user:
            raise serializers.ValidationError({
                "error": "No users available in the system"
            })
        # Save with the default user without any validation checks
        serializer.save(user=default_user, status='pending') 