from django.urls import path
from . import views

urlpatterns = [
    path('get_news/', views.get_news),
]