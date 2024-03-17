import json
import re
from datetime import datetime
import random
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_list_or_404, get_object_or_404

from .models import MajorCategory, OrderItem, SmallCategory, Product, Order
from .serializers import ProductSerializer, MajorCategorySerializer, SmallCategorySerializer, OrderSerializer, OrderItemSerializer

from newcelery.task import send_order_notification

# Create your views here.
# 선택한 품목의 리스트 보여주기(예-우유)
# url파라미터로 소분류 인덱스를 받아서 해당하는 품목 데이터 보내기
@api_view(['GET'])
def get_list_by_cate(request, cate_idx):
    products = get_list_or_404(Product, category=cate_idx)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# 키워드를 받아서 해당 키워드를 포함하는 품목 데이터 보내기
@api_view(['GET'])
def get_list_by_keyword(request, keyword):
    # 검색어에 해당하는 품목이 있는 경우
    if Product.objects.filter(item__contains=keyword).exists():
        products = Product.objects.filter(item__icontains=keyword) # 대소문자 구분 안 함
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    else: # 없다면
        return Response(status=status.HTTP_404_NOT_FOUND)


# 상품번호를 받아서 해당 상품 정보를 보내주기 - 1개의 인스턴스
@api_view(['GET'])
def get_item_by_idx(request, pdt_idx):
    product = get_object_or_404(Product, pk=pdt_idx)
    serializer = ProductSerializer(product)
    print(serializer.data)
    return Response(serializer.data)


# 카테고리 목록을 보내기
@api_view(['GET'])
def get_category(request):
    categories = get_list_or_404(MajorCategory)
    serializer = MajorCategorySerializer(categories, many=True)
    return Response(serializer.data)

# 주문 고유번호를 받아서 해당 주문 건에 포함된 상품 번호 및 수량 데이터 보내기 + 상품명, 소분류까지 보내주기
@api_view(['GET'])
def get_items(request, order_idx):
    # 유저 아이디 정보를 담고 있음
    order = get_object_or_404(Order, pk=order_idx)
    items = get_list_or_404(OrderItem, order_id=order_idx)
    serializer = OrderItemSerializer(items, many=True)
    print(serializer.data)
    return Response(serializer.data)

# 주문 데이터 추가하기 - 요청 시 데이터를 Json으로 받기
# {
#     "user": "fhdfhd4843dj",
#     "pdts": [
#         {"product_id": 1, "count": 2},
#         {"product_id": 43, "count": 1},
#         {"product_id": 23, "count": 4},
#         {"product_id": 90, "count": 3},
#         {"product_id": 22, "count": 5}
#     ]
# }
@api_view(['POST'])
def write_order(request):
    # 상품목록이 배열에 담겨있고, 각각의 상품 목록마다 주문과 관계를 맺어주어야 함 
    print("함수 호출")
    # data = json.loads(request.data)
    data = request.data # dict 
    print('request data: ', data)
    # 유저 정보 추출
    user = int(data["user"])
    pdts = json.loads(data["pdts"])
    standard = int(data["standard"]) # 1이면 일반배송, 0이면 정기배송
    print('주문한 상품번호와 수량: ', pdts)
    new_order = {
        'user': user,
    }

    # 일단 해당 유저의 주문 instance를 생성 - 유효성 검사 필요
    serializer = OrderSerializer(data=new_order)
    print('주문 인스턴스: ', serializer)
    if serializer.is_valid(raise_exception=True):
        new_order = serializer.save() # db에 저장
        # print(new_order, pdts)

        # 주문과 상품간 mtom 테이블에 관계 추가해주기

        for pdt in pdts:
            product_id = pdt['pdt_id']
            quantity = pdt['count']
            product = get_object_or_404(Product, pk=product_id)
            # 소분류는 db에서 찾아오기
            small_cate = product.category_id
            name = product.item
            print('소분류', small_cate)
            # new_order.products.add(product)
            order_item = OrderItem(order=new_order, product=product, quantity=quantity, small_cate=small_cate, name=name)
            order_item.save()
        print("주문 아이디: ", new_order.id, "user", user)
        # for pdt_idx in pdts:
        #     # Product table에서 필요한 인스턴스 찾아오기
        #     product = get_object_or_404(Product, pk=pdt_idx)
        #     new_order.products.add(product)
        #     print(new_order.id)

        # 셀러리로 비동기 작업 수행 
        send_order_notification.delay(new_order.id, user, standard)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    
        

    
 

