from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

# permission Decorators
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from django.shortcuts import get_object_or_404, get_list_or_404

from .serializers import ArticleSerializer, ArticleCommentSerializer
from .models import Article, ArticleComment

# Create your views here.
@api_view(['GET', 'POST'])
def article_list(request):
    if request.method == 'GET':
        articles = get_list_or_404(Article)
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data)

    elif request.method == 'POST' and request.user.is_authenticated:
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
def article_detail(request, article_pk):
	article = get_object_or_404(Article, pk=article_pk)

	if request.method == 'GET':
		serializer = ArticleSerializer(article)
		return Response(serializer.data)
    
	elif request.method == 'PUT':
		if article.user == request.user:
			serializer = ArticleSerializer(article, data=request.data, partial=True)
			if serializer.is_valid(raise_exception=True):
				serializer.save()
				return Response(serializer.data)
    
	elif request.method == 'DELETE':
		if article.user == request.user:
			article.delete()
			return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def comments(request, article_pk):
	article = get_object_or_404(Article, pk=article_pk)
	serializer = ArticleCommentSerializer(data=request.data)
	if serializer.is_valid(raise_exception=True):
		serializer.save(article=article, user=request.user)
		return Response(serializer.data, status=status.HTTP_201_CREATED)
	

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def comment_detail(request, article_pk, comment_pk):
	comment = get_object_or_404(ArticleComment, pk=comment_pk)
	if request.method == 'PUT':
		if comment.user == request.user:
			serializer = ArticleCommentSerializer(comment, data=request.data, partial=True)
			if serializer.is_valid(raise_exception=True):
				serializer.save()
				return Response(serializer.data)
	
	elif request.method == 'DELETE':
		if comment.user == request.user:
			comment.delete()
			return Response(status=status.HTTP_204_NO_CONTENT)
		

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def likes(request, article_pk):
    article = Article.objects.get(pk=article_pk)
    if request.user in article.like_users.all():
        article.like_users.remove(request.user)
    else:
        article.like_users.add(request.user)
    return Response(status=status.HTTP_200_OK)