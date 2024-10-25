from django.urls import path
from .views import UsuarioList, AdminView, CompradorView, VendedorView, LoginView, SignUpView, ChangePasswordView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/v1/', UsuarioList.as_view(), name='usuario-list'),
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/', AdminView.as_view(), name='admin_view'),
    path('comprador/', CompradorView.as_view(), name='comprador_view'),
    path('vendedor/', VendedorView.as_view(), name='vendedor_view'),
    path('login/', LoginView, name='login_view'),
    path('signup/', SignUpView, name='signup_view'),
    path('change-password/', ChangePasswordView, name='change_password_view'),

]