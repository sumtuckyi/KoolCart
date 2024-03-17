# celery.py

from django.conf import settings
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ssafy_pjt_django.settings')

app = Celery('newcelery')

# settigs.py에서 celery setting을 CELERY_로 시작하게 한다. 
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks(lambda : settings.INSTALLED_APPS)