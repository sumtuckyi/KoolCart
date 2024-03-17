from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

# permission Decorators
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from django.shortcuts import get_object_or_404, get_list_or_404

from .serializers import ReviewSerializer, ReviewCommentSerializer
from .models import Review, ReviewComment

# Create your views here.
@api_view(['GET', 'POST'])
def review_list(request):
    if request.method == 'GET':
        reviews = get_list_or_404(Review)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    elif request.method == 'POST' and request.user.is_authenticated:
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
def review_detail(request, review_pk):
	review = get_object_or_404(Review, pk=review_pk)

	if request.method == 'GET':
		serializer = ReviewSerializer(review)
		return Response(serializer.data)
    
	elif request.method == 'PUT':
		if review.user == request.user:
			serializer = ReviewSerializer(review, data=request.data, partial=True)
			if serializer.is_valid(raise_exception=True):
				serializer.save()
				return Response(serializer.data)
    
	elif request.method == 'DELETE':
		if review.user == request.user:
			review.delete()
			return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def comments(request, review_pk):
	review = get_object_or_404(Review, pk=review_pk)
	serializer = ReviewCommentSerializer(data=request.data)
	if serializer.is_valid(raise_exception=True):
		serializer.save(review=review, user=request.user)
		return Response(serializer.data, status=status.HTTP_201_CREATED)
	

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def comment_detail(request, review_pk, comment_pk):
	comment = get_object_or_404(ReviewComment, pk=comment_pk)
	if request.method == 'PUT':
		if comment.user == request.user:
			serializer = ReviewCommentSerializer(comment, data=request.data, partial=True)
			if serializer.is_valid(raise_exception=True):
				serializer.save()
				return Response(serializer.data)
	
	elif request.method == 'DELETE':
		if comment.user == request.user:
			comment.delete()
			return Response(status=status.HTTP_204_NO_CONTENT)
		

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def likes(request, review_pk):
    review = Review.objects.get(pk=review_pk)
    if request.user in review.like_users.all():
        review.like_users.remove(request.user)
    else:
        review.like_users.add(request.user)
    return Response(status=status.HTTP_200_OK)