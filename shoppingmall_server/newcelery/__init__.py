from .celery import app as celery_app
# celery app is automatically imported when django starts
__all__ = ['celery_app']