from django.urls import path

from core.views import dashboard_data

urlpatterns = [
    path("dashboard/", dashboard_data, name="dashboard-data"),
]
