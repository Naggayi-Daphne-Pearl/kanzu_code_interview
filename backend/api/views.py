from rest_framework import viewsets, permissions, response
from .models import LoanApplication
from .serializers import LoanApplicationSerializer
from django.contrib.auth.models import User

class LoanApplicationViewSet(viewsets.ModelViewSet):
    # Remove all permission restrictions for demo purposes
    permission_classes = [permissions.AllowAny]
    serializer_class = LoanApplicationSerializer

    def get_queryset(self):
        # Return all loan applications without filtering
        return LoanApplication.objects.all()

    def perform_create(self, serializer):
        # For demo purposes, just use the first user in the database
        default_user = User.objects.first()
        serializer.save(user=default_user, status='pending')
        
    # Override retrieve to allow access without authentication
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
        
    # Ensure list works without authentication
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
        
    # Override other methods to ensure they work without authentication
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
        
    def perform_update(self, serializer):
        serializer.save() 