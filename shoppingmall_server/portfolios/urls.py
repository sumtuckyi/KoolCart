from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_portfoilo),
    path('detail/', views.portfolio_detail)
]
