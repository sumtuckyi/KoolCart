from django.db import models

# Create your models here.
class Rate(models.Model):
    cur_unit = models.TextField()
    cur_nm = models.TextField()
    bkpr = models.IntegerField()
    last_saved_at = models.DateTimeField(auto_now_add=True)