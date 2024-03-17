from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.http import JsonResponse
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import User
from .serializers import CustomUserDetailsSerializer


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update(request, user_pk):
	serializer = CustomUserDetailsSerializer(request.user, data=request.data, partial=True)
	if serializer.is_valid(raise_exception=True):
		serializer.save()
		return Response(serializer.data)