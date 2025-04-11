from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import UserProfile, LoanApplication

# Create your tests here.

class UserProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.profile_url = reverse('userprofile-list')

    def test_create_user_profile(self):
        self.client.login(username='testuser', password='testpass')
        data = {'user': self.user.id, 'phone_number': '1234567890', 'address': '123 Main St'}
        response = self.client.post(self.profile_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class LoanApplicationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.loan_url = reverse('loanapplication-list')

    def test_create_loan_application(self):
        self.client.login(username='testuser', password='testpass')
        data = {'user': self.user.id, 'amount': 5000.00, 'status': 'pending'}
        response = self.client.post(self.loan_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
