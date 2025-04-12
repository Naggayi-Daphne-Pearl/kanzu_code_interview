from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, LoanApplication, Transaction

class UserProfileSerializer(serializers.ModelSerializer):
    total_loans = serializers.SerializerMethodField()
    active_loans_amount = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'phone_number', 'address', 'profile_image', 'date_of_birth',
            'employment_status', 'monthly_income', 'total_loans',
            'active_loans_amount'
        ]

    def get_total_loans(self, obj):
        return obj.get_total_loans()

    def get_active_loans_amount(self, obj):
        return obj.get_active_loans_amount()

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'profile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', None)
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        if profile_data:
            UserProfile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        password = validated_data.pop('password', None)
        
        if password:
            instance.set_password(password)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if profile_data and instance.userprofile:
            for attr, value in profile_data.items():
                setattr(instance.userprofile, attr, value)
            instance.userprofile.save()
        
        return instance

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class LoanApplicationSerializer(serializers.ModelSerializer):
    monthly_payment = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = LoanApplication
        fields = [
            'id', 'user', 'user_name', 'loan_type', 'amount', 'status',
            'purpose', 'created_at', 'approved_at', 'repayment_period',
            'interest_rate', 'monthly_payment'
        ]
        read_only_fields = ['user', 'approved_at', 'status']

    def get_monthly_payment(self, obj):
        return obj.calculate_monthly_payment()

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['user']

class DashboardSerializer(serializers.Serializer):
    total_loans = serializers.IntegerField()
    active_loans = serializers.IntegerField()
    total_loan_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    recent_transactions = TransactionSerializer(many=True)
    active_loans_details = LoanApplicationSerializer(many=True)
