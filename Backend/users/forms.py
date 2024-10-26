# forms.py
from django import forms
from django.contrib.auth.forms import PasswordChangeForm

class CustomPasswordChangeForm(forms.Form):
    email = forms.CharField(widget=forms.PasswordInput(), required=True)
    old_password = forms.CharField(widget=forms.PasswordInput(), required=True)
    new_password1 = forms.CharField(widget=forms.PasswordInput(), required=True)
    new_password2 = forms.CharField(widget=forms.PasswordInput(), required=True)

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get('new_password1')
        password2 = cleaned_data.get('new_password2')

        if password1 != password2:
            self.add_error('new_password2', 'Las nuevas contraseñas no coinciden.')
