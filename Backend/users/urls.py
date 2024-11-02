from django.urls import path
from .views import AdminView, CompradorView, LoginView, SignUpView, ChangePasswordView

urlpatterns = [
    path('admin/', AdminView.as_view(), name='admin_view'),
    path('comprador/', CompradorView.as_view(), name='comprador_view'),
    path('login/', LoginView.as_view(), name='login_view'),
    path('signup/', SignUpView.as_view(), name='signup_view'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password_view'),
]