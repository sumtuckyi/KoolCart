from rest_framework import serializers
from django.db.models import Max, Min
from .models import DepositProduct, DepositOption, SavingProduct, SavingOption

class DepositOptsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepositOption
        fields = '__all__'
        read_only_fields = ('product', 'joined_users')


class SavingOptsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavingOption
        fields = '__all__'
        read_only_fields = ('product', 'joined_users')


class DepositProductsSerializer(serializers.ModelSerializer):
    depositoption_set = DepositOptsSerializer(many=True, read_only=True)
    max_option = serializers.SerializerMethodField()
    min_option = serializers.SerializerMethodField()

    
    def get_max_option(self, obj):
        max_value = obj.depositoption_set.all().aggregate(Max("intr_rate2"))["intr_rate2__max"]
        return float(max_value) if max_value is not None else None

    
    def get_min_option(self, obj):
        min_value = obj.depositoption_set.all().aggregate(Min("intr_rate2"))["intr_rate2__min"]
        return float(min_value) if min_value is not None else None

    class Meta:
        model = DepositProduct
        fields = '__all__'
        read_only_fields = ('like_users', 'joined_users')


class SavingProductsSerializer(serializers.ModelSerializer):
    savingoption_set = SavingOptsSerializer(many=True, read_only=True)
    max_option = serializers.SerializerMethodField()
    min_option = serializers.SerializerMethodField()


    def get_max_option(self, obj):
        max_value = obj.savingoption_set.all().aggregate(Max("intr_rate2"))["intr_rate2__max"]
        return float(max_value) if max_value is not None else None
    
    
    def get_min_option(self, obj):
        min_value = obj.savingoption_set.all().aggregate(Min("intr_rate2"))["intr_rate2__min"]
        return float(min_value) if min_value is not None else None


    class Meta:
        model = SavingProduct
        fields = '__all__'
        read_only_fields = ('like_users', 'joined_users')


class DepProdOptSerializer(serializers.Serializer):
    ProdList = DepositProductsSerializer(many=True)
    OptList = DepositOptsSerializer(many=True)


class SavProdOptSerializer(serializers.Serializer):
    ProdList = SavingProductsSerializer(many=True)
    OptList = SavingOptsSerializer(many=True)
