from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, LoanApplicationViewSet, register_user

router = DefaultRouter()
router.register(r'user-profiles', UserProfileViewSet)
router.register(r'loan-applications', LoanApplicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user),
]
