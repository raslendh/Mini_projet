from django.contrib.auth.models import User
from rest_framework import serializers

from core.models import Student
from core.models import NewsItem


class StudentSerializer(serializers.ModelSerializer):
    inscription_date = serializers.DateField(read_only=True)
    matricule = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Student
        fields = [
            "id",
            "name",
            "email",
            "matricule",
            "department",
            "year",
            "average",
            "status",
            "phone",
            "city",
            "birth_date",
            "formation",
            "inscription_date",
        ]


class NewsItemSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = NewsItem
        fields = ["id", "title", "content", "created_at"]


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)


class AuthUserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role", "is_staff", "is_superuser"]

    def get_role(self, obj):
        first_group = obj.groups.order_by("name").values_list("name", flat=True).first()
        if first_group:
            return first_group
        if obj.is_superuser:
            return "Admin"
        return "User"

