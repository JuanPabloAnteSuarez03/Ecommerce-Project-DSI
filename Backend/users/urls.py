from django.urls import path
from .views import AdminView, CompradorView, LoginView, SignUpView, ChangePasswordView, EmailAPIView, activate, LogoutView, RefreshTokenView
from django.contrib.auth import views
from . import views


urlpatterns = [
    path('admin/', AdminView.as_view(), name='admin_view'),
    path('comprador/', CompradorView.as_view(), name='comprador_view'),
    path('login/', LoginView.as_view(), name='login_view'),
    path('signup/', SignUpView.as_view(), name='signup_view'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password_view'),
    path('logout/', LogoutView.as_view(), name='logout_view'),
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh_token_view'),
    path('email/', EmailAPIView.as_view(), name='email_view'),
    path('activate/<uidb64>/<token>/', activate.as_view(), name='activate'),
]