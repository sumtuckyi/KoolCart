from django.db import models
from django.conf import settings

# Create your models here.
class Portfolio(models.Model):
	user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
		on_delete=models.CASCADE)
	job = models.CharField(max_length=100)
	income = models.IntegerField()
	preffered_bank = models.CharField(max_length=100)
	investment_type = models.IntegerField()
	age = models.IntegerField()