from rest_framework import serializers
from .models import Product, SmallCategory, MajorCategory, Order, OrderItem

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class SmallCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SmallCategory
        fields = '__all__'


class MajorCategorySerializer(serializers.ModelSerializer):
    small_categories = SmallCategorySerializer(many=True, read_only=True)

    class Meta:
        model = MajorCategory
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        small_categories = SmallCategory.objects.filter(upper_cate=instance)
        representation['small_categories'] = SmallCategorySerializer(small_categories, many=True).data
        return representation


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('products', 'date', 'shipping_speed') 


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'