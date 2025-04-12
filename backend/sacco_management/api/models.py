from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15)
    address = models.CharField(max_length=255)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    employment_status = models.CharField(max_length=50, choices=[
        ('employed', 'Employed'),
        ('self_employed', 'Self Employed'),
        ('unemployed', 'Unemployed')
    ], default='employed')
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    def get_total_loans(self):
        return self.user.loanapplication_set.all().count()
    
    def get_active_loans_amount(self):
        return sum(
            loan.amount 
            for loan in self.user.loanapplication_set.filter(status='approved')
        )

class LoanApplication(models.Model):
    LOAN_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed')
    ]
    
    LOAN_TYPE_CHOICES = [
        ('personal', 'Personal Loan'),
        ('business', 'Business Loan'),
        ('emergency', 'Emergency Loan'),
        ('education', 'Education Loan')
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    loan_type = models.CharField(max_length=20, choices=LOAN_TYPE_CHOICES, default='personal')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=LOAN_STATUS_CHOICES, default='pending')
    purpose = models.CharField(max_length=255, default='General Purpose')
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    repayment_period = models.IntegerField(help_text="Repayment period in months")
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('15.00'))
    
    def calculate_monthly_payment(self):
        if self.status != 'approved':
            return 0
        total_amount = float(self.amount) * (1 + float(self.interest_rate)/100)
        return total_amount / self.repayment_period if self.repayment_period else 0

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('loan_disbursement', 'Loan Disbursement'),
        ('loan_repayment', 'Loan Repayment')
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    related_loan = models.ForeignKey(LoanApplication, on_delete=models.SET_NULL, null=True, blank=True)
