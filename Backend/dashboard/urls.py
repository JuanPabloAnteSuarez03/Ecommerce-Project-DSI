from django.urls import path
from .views import DashboardData

urlpatterns = [
    path('api/', DashboardData.as_view(), name='dashboard-data'),
]
