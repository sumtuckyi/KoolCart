from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import UserDetailsSerializer
from dj_rest_auth.serializers import PasswordChangeSerializer
from allauth.account.adapter import get_adapter
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class CustomRegisterSerializer(RegisterSerializer):
	first_name = serializers.CharField(max_length=150, allow_blank=True)
	last_name = serializers.CharField(max_length=150, allow_blank=True)

	def get_cleaned_data(self):
		return {
			'username': self.validated_data.get('username', ''),
			'password1': self.validated_data.get('password1', ''),
			'email': self.validated_data.get('email', ''),
			'first_name': self.validated_data.get('first_name', ''),
			'last_name': self.validated_data.get('last_name', ''),
		}
	
	def save(self, request):
		adapter = get_adapter()
		user = adapter.new_user(request)
		self.cleaned_data = self.get_cleaned_data()
		user = adapter.save_user(request, user, self, commit=False)
		user.save()
		self.custom_signup(request, user)
		# setup_user_email(request, user, [])
		return user


class CustomUserDetailsSerializer(UserDetailsSerializer):
	@staticmethod

	class Meta:
		extra_fields = []
		# see https://github.com/iMerica/dj-rest-auth/issues/181
		# UserModel.XYZ causing attribute error while importing other
		# classes from `serializers.py`. So, we need to check whether the auth model has
		# the attribute or not
		if hasattr(UserModel, 'USERNAME_FIELD'):
				extra_fields.append(UserModel.USERNAME_FIELD)
		if hasattr(UserModel, 'EMAIL_FIELD'):
				extra_fields.append(UserModel.EMAIL_FIELD)
		if hasattr(UserModel, 'first_name'):
				extra_fields.append('first_name')
		if hasattr(UserModel, 'last_name'):
				extra_fields.append('last_name')
		if hasattr(UserModel, 'is_staff'):
				extra_fields.append('is_staff')
		if hasattr(UserModel, 'like_articles'):
				extra_fields.append('like_articles')
		if hasattr(UserModel, 'like_reviews'):
				extra_fields.append('like_reviews')
		if hasattr(UserModel, 'like_deposits'):
				extra_fields.append('like_deposits')
		if hasattr(UserModel, 'like_savings'):
				extra_fields.append('like_savings')
		if hasattr(UserModel, 'my_deposits'):
				extra_fields.append('my_deposits')
		if hasattr(UserModel, 'my_savings'):
				extra_fields.append('my_savings')
		if hasattr(UserModel, 'my_depositoptions'):
				extra_fields.append('my_depositoptions')
		if hasattr(UserModel, 'my_savingoptions'):
				extra_fields.append('my_savingoptions')
		model = UserModel
		fields = ('pk', *extra_fields)
		# read_only_fields = ('email',)
