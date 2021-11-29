from rest_framework import serializers
from .models import MyEvent
from django.contrib.auth.models import User, Group

class MyEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyEvent
        fields = ('sport', 'duration', 'distance', 'intensity', 'description', 'start', 'end', 'allday')
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'firstname', 'lastname', 'token')


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=200)
    password = serializers.CharField(max_length=200)