from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets

from core.models import Student
from core.serializers import StudentSerializer

@api_view(["GET"])
def dashboard_data(request):
    payload = {
        "kpis": {
            "students": {"value": 8, "active": 6},
            "departments": {"value": 6},
            "modules": {"value": 14},
            "graduates": {"value": 1},
        },
        "recent_students": [
            {"name": "Amina Benali", "dept": "Informatique", "year": "3eme annee", "status": "Actif"},
            {"name": "Youssef Kaddour", "dept": "Physique", "year": "1ere annee", "status": "Actif"},
            {"name": "Sarah Medjaoui", "dept": "Mathematiques", "year": "5eme annee", "status": "Diplome"},
            {"name": "Karim Bouchiba", "dept": "Informatique", "year": "2eme annee", "status": "Actif"},
            {"name": "Fatima Zahra", "dept": "Physique", "year": "4eme annee", "status": "Actif"},
        ],
        "departments": [
            {"name": "Informatique", "head": "Pr. Belkacemi Ahmed", "score": 320, "progress": 82},
            {"name": "Physique", "head": "Pr. Hamid Nouraddine", "score": 185, "progress": 55},
            {"name": "Mathematiques", "head": "Pr. Larbi Mourad", "score": 210, "progress": 64},
            {"name": "Chimie", "head": "Pr. Boufafi Sarra", "score": 145, "progress": 43},
        ],
    }
    return Response(payload)


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by("-created_at")
    serializer_class = StudentSerializer
