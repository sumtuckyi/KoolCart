from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

# permission Decorators
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from django.shortcuts import get_object_or_404, get_list_or_404
from .serializers import PortfolioSerializer
from .models import Portfolio

# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_portfoilo(request):
	serializer = PortfolioSerializer(data=request.data)
	if serializer.is_valid(raise_exception=True):
		serializer.save(user=request.user)
		return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def portfolio_detail(request):
	portfolio = get_object_or_404(Portfolio, user=request.user)
	if request.method == 'GET':
		serializer = PortfolioSerializer(portfolio)
		return Response(serializer.data)
	
	elif request.method == 'PUT':
		serializer = PortfolioSerializer(portfolio, data=request.data, partial=True)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response(serializer.data)