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

