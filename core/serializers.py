from rest_framework import serializers

from core.models import Student


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

