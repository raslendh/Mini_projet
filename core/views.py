from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.models import NewsItem, Student
from core.serializers import AuthUserSerializer, LoginSerializer, NewsItemSerializer, StudentSerializer

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


@api_view(["POST"])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    identifier = serializer.validated_data["identifier"].strip()
    password = serializer.validated_data["password"]

    username = identifier
    matched_user = User.objects.filter(email__iexact=identifier).first()
    if matched_user:
        username = matched_user.username

    user = authenticate(username=username, password=password)
    if user is None:
        return Response(
            {"detail": "Identifiant ou mot de passe incorrect."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response(AuthUserSerializer(user).data)


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by("-created_at")
    serializer_class = StudentSerializer


class NewsItemViewSet(viewsets.ModelViewSet):
    queryset = NewsItem.objects.all().order_by("-created_at")
    serializer_class = NewsItemSerializer
