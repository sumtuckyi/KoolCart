from django.urls import path
from . import views

urlpatterns = [
    path('pdt_list/<cate_idx>', views.get_list_by_cate),
    path('pdt_list/search/<pdt_idx>', views.get_item_by_idx),
    path('category/', views.get_category),
    path('order/', views.write_order),
    path('order/<order_idx>', views.get_items),
]
 