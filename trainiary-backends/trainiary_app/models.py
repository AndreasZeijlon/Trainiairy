
from django.db import models
from django.contrib.auth.models import User
import datetime

class MyEvent(models.Model):
    user        = models.ForeignKey(User, on_delete=models.CASCADE)
    sport		= models.CharField(max_length=200)
    duration	= models.TimeField()
    distance 	= models.FloatField()
    intensity 	= models.IntegerField()
    description = models.CharField(max_length=255)
    start = models.DateTimeField(default=datetime.datetime.today)
    end = models.DateTimeField(default=datetime.datetime.today)
    allday = models.BooleanField(default=True)

    def __str__(self):
        return self.description