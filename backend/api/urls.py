from django.urls import path
from .views import LoanApplicationViewSet

urlpatterns = [
    path('public-loans/', LoanApplicationViewSet.as_view({'get': 'list', 'post': 'create'}), name='public-loans'),
    path('public-loans/<int:pk>/', LoanApplicationViewSet.as_view({'get': 'retrieve'}), name='public-loan-detail'),
] 