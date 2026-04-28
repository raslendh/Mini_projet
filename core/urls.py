from django.urls import include, path
from rest_framework.routers import DefaultRouter

from core.views import StudentViewSet, dashboard_data

router = DefaultRouter()
router.register("students", StudentViewSet, basename="students")

urlpatterns = [
    path("dashboard/", dashboard_data, name="dashboard-data"),
    path("", include(router.urls)),
]
