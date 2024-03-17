import requests
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime
from .serializers import RateSerializer
from .models import Rate

# Create your views here.
@api_view(['GET'])
def getRate(request):
    
    current_date = datetime.now()
    formatted_date = current_date.strftime("%Y%m%d")

    api_key = settings.API_KEY
    data_type = 'AP01'
    URL = f'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey={api_key}&searchdate=20231120&data={data_type}'

    
   
    # 당일에 아직 요청을 보낸 적이 없는 경우
    if (Rate.objects.count() == 0) or (Rate.objects.all().first().last_saved_at.strftime("%Y%m%d") != formatted_date): 
        if (Rate.objects.count() != 0):
            Rate.objects.all().delete()
        response = requests.get(URL).json()
        print('send request')
        for currency in response:
            save_data = {
                'cur_unit': currency.get('cur_unit'),
                'cur_nm': currency.get('cur_nm'),
                'bkpr': int(currency.get('bkpr').replace(",", ""))
            }
            serializer = RateSerializer(data=save_data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                print('saved')
    

    rates = get_list_or_404(Rate)
    serializer2 = RateSerializer(rates, many=True)
    return Response(serializer2.data)
