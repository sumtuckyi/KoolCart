# newcelery/tasks.py

from celery import shared_task
import requests


@shared_task
def send_order_notification(order_id, user_seq, standard):
    order_seq = order_id
    if standard == 1:
        mc_seq = 1
    else:
        mc_seq = 2
    # 주문 데이터를 기반으로 알림 메세지 데이터 생성
    message = {
        "mc_seq": mc_seq, 
        "order_seq": order_seq,
        "user_seq": user_seq,
        "ms_chk": "false"
    }
        # 'mc_seq': 1, # 일반배송 - 1, 정기배송 - 2
        # 'order_id': order_id, # 주문 고유번호
        # 'user_seq': user_seq, # 유저 식별자
        # 'ms_chk': 'false', # 알림 메세지 확인 여부
        # 필요한 다른 데이터 추가


    # 스프링부트 서버에 POST 요청 보내기
    response = requests.post('http://i10a101.p.ssafy.io:8080/message/create', json=message)
   
    return response.status_code