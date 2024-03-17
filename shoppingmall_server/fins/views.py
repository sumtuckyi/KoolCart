import requests
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core import mail
# permission Decorators
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import DepositProduct, DepositOption, SavingProduct, SavingOption
from .serializers import (DepositProductsSerializer, DepositOptsSerializer, SavingProductsSerializer, SavingOptsSerializer,
                          DepProdOptSerializer, SavProdOptSerializer)

# Create your views here.
# 예금 상품 및 옵션 데이터 요청 보내서 가져오기
def get_dep_data(request):
    api_key = settings.API_KEY2
    URL = f'http://finlife.fss.or.kr/finlifeapi/depositProductsSearch.json?auth={api_key}&topFinGrpNo=020000&pageNo=1'
    response = requests.get(URL).json()
    tof = False

    for product in response.get('result').get('baseList'):
        already = DepositProduct.objects.filter(fin_prdt_cd = product.get('fin_prdt_cd'))
        if already.exists():
            continue
        save_data = {
            'dcls_month': product.get('dcls_month'),
            'fin_co_no': product.get('fin_co_no'),
            'kor_co_nm': product.get('kor_co_nm'),
            'fin_prdt_cd': product.get('fin_prdt_cd'),
            'fin_prdt_nm': product.get('fin_prdt_nm'),
            'join_way': product.get('join_way'),
            'mtrt_int': product.get('mtrt_int'),
            'spcl_cnd': product.get('spcl_cnd'),
            'join_deny': product.get('join_deny'),
            'join_member': product.get('join_member'),
            'etc_note': product.get('etc_note'),
            'max_limit': product.get('max_limit') if product.get('max_limit') else -1,
            'dcls_strt_day': product.get('dcls_strt_day'),
            'dcls_end_day': product.get('dcls_end_day') if product.get('dcls_end_day') else -1,
            'fin_co_subm_day': product.get('fin_co_subm_day'),
        }
        serializer = DepositProductsSerializer(data=save_data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()

    if DepositOption.objects.count() != 0:
        tof = True
    for option in response.get('result').get('optionList'):
        if tof:
            break
        save_data = {
            'dcls_month': option.get('dcls_month'),
            'fin_co_no': option.get('fin_co_no'),
            'fin_prdt_cd': option.get('fin_prdt_cd'),
            'intr_rate_type': option.get('intr_rate_type'),
            'intr_rate_type_nm': option.get('intr_rate_type_nm'),
            'save_trm': option.get('save_trm'),
            'intr_rate': option.get('intr_rate') if option.get('intr_rate') else -1,
            'intr_rate2': option.get('intr_rate2') if option.get('intr_rate2') else -1,
        }
        serializer = DepositOptsSerializer(data=save_data)
        if serializer.is_valid(raise_exception=True):
            product = DepositProduct.objects.get(fin_prdt_cd = save_data.get('fin_prdt_cd'))
            serializer.save(product=product)

    return JsonResponse({ 'message':'okay' })

# 적금 상품 및 옵션 데이터 요청해서 가져오기
def get_sav_data(request):
    api_key = settings.API_KEY2
    URL = f'http://finlife.fss.or.kr/finlifeapi/savingProductsSearch.json?auth={api_key}&topFinGrpNo=020000&pageNo=1'
    response = requests.get(URL).json()
    tof = False

    for product in response.get('result').get('baseList'):
        already = SavingProduct.objects.filter(fin_prdt_cd = product.get('fin_prdt_cd'))
        if already.exists():
            continue
        save_data = {
            'dcls_month': product.get('dcls_month'),
            'fin_co_no': product.get('fin_co_no'),
            'kor_co_nm': product.get('kor_co_nm'),
            'fin_prdt_cd': product.get('fin_prdt_cd'),
            'fin_prdt_nm': product.get('fin_prdt_nm'),
            'join_way': product.get('join_way'),
            'mtrt_int': product.get('mtrt_int'),
            'spcl_cnd': product.get('spcl_cnd'),
            'join_deny': product.get('join_deny'),
            'join_member': product.get('join_member'),
            'etc_note': product.get('etc_note'),
            'max_limit': product.get('max_limit') if product.get('max_limit') else -1,
            'dcls_strt_day': product.get('dcls_strt_day'),
            'dcls_end_day': product.get('dcls_end_day') if product.get('dcls_end_day') else -1,
            'fin_co_subm_day': product.get('fin_co_subm_day'),
        }
        serializer = SavingProductsSerializer(data=save_data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()

    if (SavingOption.objects.count() != 0): # 옵션 중복저장 방지
        tof = True
    for option in response.get('result').get('optionList'):
        if tof:
            break
        save_data = {
            'dcls_month': option.get('dcls_month'),
            'fin_co_no': option.get('fin_co_no'),
            'fin_prdt_cd': option.get('fin_prdt_cd'),
            'intr_rate_type': option.get('intr_rate_type'),
            'intr_rate_type_nm': option.get('intr_rate_type_nm'),
            'rsrv_type': option.get('rsrv_type'),
            'rsrv_type_nm': option.get('rsrv_type_nm'),
            'save_trm': option.get('save_trm'),
            'intr_rate': option.get('intr_rate') if option.get('intr_rate') else -1,
            'intr_rate2': option.get('intr_rate2') if option.get('intr_rate2') else -1,
        }
        serializer = SavingOptsSerializer(data=save_data)
        if serializer.is_valid(raise_exception=True):
            product = SavingProduct.objects.get(fin_prdt_cd = save_data.get('fin_prdt_cd'))
            serializer.save(product=product)

    return JsonResponse({ 'message':'okay' })

# 예금상품 목록 조회
@api_view(['GET'])
def deposit_list(request):
    products = get_list_or_404(DepositProduct)
    serializer = DepositProductsSerializer(products, many=True)
    return Response(serializer.data)


# 적금상품 목록 조회
@api_view(['GET'])
def savings_list(request):
    products = get_list_or_404(SavingProduct)
    serializer = SavingProductsSerializer(products, many=True)
    return Response(serializer.data)


# 해당 예금상품의 옵션 목록 조회
@api_view(['GET'])
def deposit_options(request, pdt_pk):
    product = DepositProduct.objects.get(fin_prdt_cd=pdt_pk)
    options = product.depositoption_set.all()
    serializer = DepositOptsSerializer(options, many=True)
    return Response(serializer.data)


#해당 예금상품의 상세 정보 조회
@api_view(['GET'])
def deposit_detail(request, pdt_pk):
    product = DepositProduct.objects.get(fin_prdt_cd=pdt_pk)
    serializer = DepositProductsSerializer(product)
    return Response(serializer.data)


# 해당 적금상품의 옵션 목록 조회
@api_view(['GET'])
def saving_options(request, pdt_pk):
    product = SavingProduct.objects.get(fin_prdt_cd=pdt_pk)
    options = product.savingoption_set.all()
    serializer = SavingOptsSerializer(options, many=True)
    return Response(serializer.data)


#해당 적금상품의 상세 정보 조회
@api_view(['GET'])
def saving_detail(request, pdt_pk):
    print(pdt_pk)
    product = SavingProduct.objects.get(fin_prdt_cd=pdt_pk)
    serializer = SavingProductsSerializer(product)
    return Response(serializer.data)

@api_view(['GET'])
def filter_best(request, type, per):
    print(type, per)
    # if type == 'all-pdt': # 예적금 상품을 통합하여 최고 금리 상품 검색
    #     dep_opt_table = DepositOption.objects.annotate(intr_rate2=F('intr_rate2'))
    #     sav_opt_table = SavingOption.objects.annotate(intr_rate2=F('intr_rate2'))

    #     combined_query = dep_opt_table.union(sav_opt_table)
    #     top_eight_rows = combined_query.order_by('-intr_rate2')[:8] # 8개만 슬라이싱
    #     print(top_eight_rows)
    #     ids = []

    #     pass 
    if type == 'dep':
        if per == 'all': # 기간을 고려하지 않을 때
            top_four_rows = DepositOption.objects.all().order_by('-intr_rate2')
            if top_four_rows.exists() and len(top_four_rows) > 4:
                # 검색 결과가 4개보다 많은 경우라면 슬라이싱
                top_four_rows = top_four_rows[:4]
            ids = []
            for opt in top_four_rows:
                pdt = DepositProduct.objects.get(pk=opt.product.pk)
                ids.append(pdt.fin_prdt_cd)
            products = DepositProduct.objects.filter(fin_prdt_cd__in=ids) # querySet
            data = {
                'ProdList': products,
                'OptList': top_four_rows,
            }
            serializer = DepProdOptSerializer(instance=data)
            print(products)
            return Response(serializer.data)
            # serializer = DepositOptsSerializer(top_four_rows, many=True)
            # return Response(serializer.data)
        else: # 특정 기간 상품일 때
            top_four_rows = DepositOption.objects.filter(save_trm=f'{per}').order_by('-intr_rate2')
            if top_four_rows.exists() and len(top_four_rows) > 4:
                # 검색 결과가 4개보다 많은 경우라면 슬라이싱
                top_four_rows = top_four_rows[:4]
            ids = []
            for opt in top_four_rows:
                pdt = DepositProduct.objects.get(pk=opt.product.pk)
                ids.append(pdt.fin_prdt_cd)
            products = DepositProduct.objects.filter(fin_prdt_cd__in=ids) # querySet
            data = {
                'ProdList': products,
                'OptList': top_four_rows,
            }
            serializer = DepProdOptSerializer(instance=data)
            print(products)
            return Response(serializer.data)
            # serializer = DepositOptsSerializer(top_four_rows, many=True)
            # return Response(serializer.data)
    elif type == 'sav':
        if per == 'all': # 기간을 고려하지 않을 때
            top_four_rows = SavingOption.objects.all().order_by('-intr_rate2') # querySet
            if top_four_rows.exists() and len(top_four_rows) > 4:
                # 검색 결과가 4개보다 많은 경우라면 슬라이싱
                top_four_rows = top_four_rows[:4]
            ids = []
            for opt in top_four_rows:
                pdt = SavingProduct.objects.get(pk=opt.product.pk)
                ids.append(pdt.fin_prdt_cd)
            products = SavingProduct.objects.filter(fin_prdt_cd__in=ids) # querySet
            data = {
                'ProdList': products,
                'OptList': top_four_rows,
            }
            serializer = SavProdOptSerializer(instance=data)
            print(products)
            return Response(serializer.data)
                    
            # serializer = SavingOptsSerializer(top_four_rows, many=True)
            # return Response(serializer.data)
        else: # 특정 기간 상품일 때
            top_four_rows = SavingOption.objects.filter(save_trm=f'{per}').order_by('-intr_rate2')
            if top_four_rows.exists() and len(top_four_rows) > 4:
            # 검색 결과가 4개보다 많은 경우라면 슬라이싱
                top_four_rows = top_four_rows[:4]
            ids = []
            for opt in top_four_rows:
                pdt = SavingProduct.objects.get(pk=opt.product.pk)
                ids.append(pdt.fin_prdt_cd)
            products = SavingProduct.objects.filter(fin_prdt_cd__in=ids) # querySet
            data = {
                'ProdList': products,
                'OptList': top_four_rows,
            }
            serializer = SavProdOptSerializer(instance=data)
            print(products)
            return Response(serializer.data)
            # serializer = SavingOptsSerializer(top_four_rows, many=True)
            # return Response(serializer.data)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_deposits(request, pdt_pk):
    product = DepositProduct.objects.get(fin_prdt_cd=pdt_pk)
    if request.user in product.like_users.all():
        product.like_users.remove(request.user)
    else:
        product.like_users.add(request.user)
    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_deposits(request, opt_pk):
    option = DepositOption.objects.get(pk=opt_pk)
    product = DepositProduct.objects.get(fin_prdt_cd=option.fin_prdt_cd)
    if request.user not in product.joined_users.all():
        if request.user not in option.joined_users.all():
            product.joined_users.add(request.user)
            option.joined_users.add(request.user)
            return JsonResponse({'message': 'join'})
    else:
        return JsonResponse({'message': 'already'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_savings(request, pdt_pk):
    product = SavingProduct.objects.get(fin_prdt_cd=pdt_pk)
    if request.user in product.like_users.all():
        product.like_users.remove(request.user)
    else:
        product.like_users.add(request.user)
    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_savings(request, opt_pk):
    option = SavingOption.objects.get(pk=opt_pk)
    product = SavingProduct.objects.get(fin_prdt_cd=option.fin_prdt_cd)
    if request.user not in product.joined_users.all():
        if request.user not in option.joined_users.all():
            product.joined_users.add(request.user)
            option.joined_users.add(request.user)
            return JsonResponse({'message': 'join'})
    else:
        return JsonResponse({'message': 'already'})
    

def send_email(request):
    # message = ('제목', 
    #            '내용', 
    #            'ckadltmf0224@naver.com', 
    #            ['ckadltmf0224@naver.com'])
    # mail.send_mass_mail((message), fail_silently=False)
    mail.send_mail("제목",
                   "내용",
                   "ckadltmf0224@naver.com",
                   ["ckadltmf0224@naver.com"],
                   fail_silently=False)
    return JsonResponse({'message': 'YES'})


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def change_deposit_rate(request, opt_pk):
    option = DepositOption.objects.get(pk=opt_pk)
    serializer = DepositOptsSerializer(option, data=request.data, partial=True)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        # return Response(serializer.data)
        to_mail = []
        for user in option.product.joined_users.all():
            to_mail.append(user.email)
        mail.send_mail(
            f'금리 수정 확인 - 상품명: {option.product.fin_prdt_nm}',
            f'{option.product.fin_prdt_nm} 상품의 금리 정보가 다음과같이 변경되었습니다.\n가입기간: {option.save_trm} - 최고우대금리: {option.intr_rate2}\n감사합니다.',
            'ckadltmf0224@naver.com',
            to_mail,
            fail_silently=True
        )
        return JsonResponse({'message': 'YES'})


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def change_saving_rate(request, opt_pk):
    option = SavingOption.objects.get(pk=opt_pk)
    serializer = SavingOptsSerializer(option, data=request.data, partial=True)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        # return Response(serializer.data)
        to_mail = []
        for user in option.product.joined_users.all():
            to_mail.append(user.email)
        mail.send_mail(
            f'금리 수정 확인 - 상품명: {option.product.fin_prdt_nm}',
            f'{option.product.fin_prdt_nm} 상품의 금리 정보가 다음과같이 변경되었습니다.\n가입기간: {option.save_trm} - 최고우대금리: {option.intr_rate2}\n감사합니다.',
            'ckadltmf0224@naver.com',
            to_mail,
            fail_silently=True
        )
        return JsonResponse({'message': 'YES'})
