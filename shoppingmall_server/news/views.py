import json
from django.shortcuts import render
import requests
from django.conf import settings
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
def get_news(request):
    keyword = '금융'
    encode_type = 'json'
    URL = f'https://openapi.naver.com/v1/search/news.{encode_type}?query={keyword}'
    client_id = settings.API_KEY_NAVER
    client_secret = settings.CLIENT_SECRET
    # params = request.GET.dict()

    headers = {
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret,
    }

    response = requests.get(URL, headers=headers)


    # response_data = json.loads(response.content.decode('utf-8'))
    # print(response)
    # return JsonResponse(response, safe=False)

    try:
        # Attempt to decode the response content using UTF-8
        response_data = response.content.decode('utf-8')
        # Convert the decoded JSON string to a Python object
        response_json = json.loads(response_data)
    except UnicodeDecodeError as e:
        # If decoding fails, handle the error
        error_message = f"Error decoding response content: {e}"
        return JsonResponse({'error': error_message}, status=500)
    except json.JSONDecodeError as e:
        # If parsing JSON fails, handle the error
        error_message = f"Error parsing JSON: {e}"
        return JsonResponse({'error': error_message}, status=500)

    return JsonResponse(response_json, safe=False)