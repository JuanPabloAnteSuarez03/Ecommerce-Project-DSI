from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from .forms import CustomPasswordChangeForm
from django.contrib.auth.models import User
from django.views.generic import TemplateView

# Create your views here.

@login_required
def home_view(request):
    return render(request, 'home.html')

def signup_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, f'Account created for {user.username}!')
            return redirect('login')  # Redirige a la página de login después de registrarse
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = UserCreationForm()
    
    return render(request, 'registration/signup.html', {'form': form})

def password_change_view(request):
    if request.method == 'POST':
        form = CustomPasswordChangeForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            old_password = form.cleaned_data['old_password']
            new_password = form.cleaned_data['new_password1']

            try:
                user = User.objects.get(email=email)
                if user.check_password(old_password):  # Verifica si la contraseña actual es correcta
                    user.set_password(new_password)  # Cambia la contraseña
                    user.save()
                    messages.success(request, 'Tu contraseña ha sido cambiada con éxito.')
                    return redirect('login')  # Redirige a una página de éxito
                else:
                    form.add_error('old_password', 'La contraseña actual es incorrecta.')
            except User.DoesNotExist:
                form.add_error('email', 'No hay un usuario asociado a este correo electrónico.')
    else:
        form = CustomPasswordChangeForm()

    return render(request, 'password_change.html', {'form': form})