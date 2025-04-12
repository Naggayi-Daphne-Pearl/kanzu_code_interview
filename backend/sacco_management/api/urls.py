from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserProfileViewSet, 
    LoanApplicationViewSet,
    LoginView,
    RegisterView
)

router = DefaultRouter()
router.register(r'userprofiles', UserProfileViewSet)
router.register(r'loan-applications', LoanApplicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
