# 가상환경 생성(bash 터미널 사용)
$ python -m venv venv

#가상환경 활성화
$ source venv/Scripts/activate

# 의존성 패키지 설치
$ pip install -r requirements.txt

# django migrate
$ python manage.py migrate

# django 서버 실행하기
$ python manage.py runserver