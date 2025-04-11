from django.shortcuts import render
from rest_framework import viewsets
from .models import LoanApplication, UserProfile
from .serializers import LoanApplicationSerializer, UserProfileSerializer

# Create your views here.

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class LoanApplicationViewSet(viewsets.ModelViewSet):
    queryset = LoanApplication.objects.all()
    serializer_class = LoanApplicationSerializer
