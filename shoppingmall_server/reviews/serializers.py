from rest_framework import serializers
from .models import Review, ReviewComment


class ReviewCommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = ReviewComment
        fields = '__all__'
        read_only_fields = ('review', 'user')


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    reviewcomment_set = ReviewCommentSerializer(many=True, read_only=True)
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('user', 'like_users')