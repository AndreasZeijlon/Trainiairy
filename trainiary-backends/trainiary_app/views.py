from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.utils import IntegrityError
from django.contrib.auth.password_validation import validate_password
from django.core import validators, serializers
from django.core.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken

from django.db.models import Q

import datetime
import requests
 
 
# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.utils import json
from rest_framework import viewsets, generics, permissions, status
from .serializers import MyEventSerializer, UserSerializer, LoginSerializer

from .models import MyEvent
 

class Index(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'index.html', context=None)


 

class AddWorkout(generics.CreateAPIView):
    serializer_class = MyEventSerializer
    permission_classes = (permissions.IsAuthenticated, )
    def post(self, request, *args, **kwargs):
        try:
            workout = request.data.get('workout', '')
            user = request.user

            sport = workout.get('sport', '')
            duration = workout.get('duration', '') 
            distance = workout.get('distance', '') 
            intensity = workout.get('intensity', '') 
            description = workout.get('description', '')

            allday = request.data.get('allday','')
            start = request.data.get('start', '')
            end = request.data.get('end', '')

            start = datetime.datetime.strptime(start, "%Y-%m-%dT%H:%M:%S.%f%z")
            end = datetime.datetime.strptime(end, "%Y-%m-%dT%H:%M:%S.%f%z")

            myevent = MyEvent(start=start, end=end, sport=sport, duration=duration, distance=distance, intensity=intensity, description=description, allday=allday, user=user)
            myevent.save()

            return Response({"id": myevent.pk, "message": "Workout added succesfully"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"message": "Workout could not be added", "error": e.args[0] } ,status.HTTP_400_BAD_REQUEST)

class RegisterUser(generics.CreateAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        try:
            username = request.data.get('username', '')
            password = request.data.get('password', '')
            firstname = request.data.get('firstname', '')
            lastname = request.data.get('lastname', '')

            try:

                validate_password(password)
            except ValidationError as e:
                return Response({"message": e.args[0] }, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(username, None, password)

            user.last_name = lastname
            user.first_name = firstname
            user.save()


            return Response({"message": "Registration successful" }, status=status.HTTP_201_CREATED)
        except IntegrityError as e:
            return Response({"message": ["Username \"{}\" is already taken".format(username)], "error": e.args[0]} , status=status.HTTP_409_CONFLICT)


class AuthenticateUser(generics.CreateAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        try:
            username = request.data.get('username', '')
            password = request.data.get('password', '')

            user = authenticate(username=username, password=password)

            if user is not None:
                # A backend authenticated the credentials

                refresh = RefreshToken.for_user(user)

                user_obj = {"username": user.username, "firstname": user.first_name, "lastname": user.last_name, "jwt_refresh": str(refresh), "jwt_access": str(refresh.access_token)}

                return Response({"user": user_obj, "message": "Authentication successful"}, status=status.HTTP_200_OK)
            else:
                # No backend authenticated the credentials
                return Response({"message": "Wrong password/username"}, status=status.HTTP_401_UNAUTHORIZED)
        except ValueError as e:
            return Response({ "message": e.args[0] }, status.HTTP_400_BAD_REQUEST)



class FetchEvents(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            start = request.query_params.get("start")
            end = request.query_params.get("end")
            
            events = MyEvent.objects.filter( Q(start__gte=start) & Q(start__lte=end) & Q(user=user) )

            response = []

            for e in events:
                workout = {
                    "sport": e.sport,
                    "duration": e.duration.strftime("%H:%M"),
                    "distance": e.distance,
                    "intensity": e.intensity,
                    "description": e.description
                }
                response.append({
                    "id": e.pk,
                    "workout": workout,
                    "start": e.start,
                    "end": e.end,
                    "allDay": e.allday,
                })

            return Response({"message": "Event fetching successful", "data": response }, status=status.HTTP_200_OK)
        except TypeError as e:
            return Response({ "message": "Event fetching unsuccessful", "error": e.args[0] }, status=status.HTTP_400_BAD_REQUEST)


class DeleteEvent(generics.CreateAPIView):

    permission_classes = (permissions.IsAuthenticated, )

    def delete(self, request, *args, **kwargs):
        try:
            id = request.query_params.get("id")

            MyEvent.objects.filter(id=id).delete()

            return Response({"message": "Event deleted successfully"}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Event could not be deleted"}, status=status.HTTP_400_BAD_REQUEST)


class ChangePassword(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated, )

    def post(self, request, *args, **kwargs):
        try:
            username = request.user.username
            currentpassword = request.data.get('currentpassword', '')
            newpassword = request.data.get('newpassword', '')
            confirmnewpassword = request.data.get('confirmnewpassword', '')

            user = authenticate(username=username, password=currentpassword)
            
            if user is not None: 
                # correct credentials

                try:
                    validate_password(newpassword)
                except ValidationError as e:
                    return Response({"message": e.args[0] }, status=status.HTTP_400_BAD_REQUEST)

                user.set_password(newpassword)
                user.save()
                return Response({"message": ["Password changed successfully"] }, status=status.HTTP_200_OK)
            else:
                # incorrect credentials
                return Response({"message": ["Wrong password, password not changed"]}, status=status.HTTP_401_UNAUTHORIZED)
        except ValueError as e:
            return Response({"message": e.args[0] } , status.HTTP_400_BAD_REQUEST)


class ChangeEvent(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated, )

    def post(self, request, *args, **kwargs):
        try:
            workout = request.data.get('workout', '')
            event_id = request.data.get("id", '')


            sport = workout.get('sport', '')
            duration = workout.get('duration', '') 
            distance = workout.get('distance', '') 
            intensity = workout.get('intensity', '') 
            description = workout.get('description', '')
            allday = request.data.get('allday','')
            start = request.data.get('start', '')
            end = request.data.get('end', '')



            start = datetime.datetime.strptime(start, "%Y-%m-%dT%H:%M:%S.%f%z")
            end = datetime.datetime.strptime(end, "%Y-%m-%dT%H:%M:%S.%f%z")


            event = MyEvent.objects.get(pk=event_id)
            event.sport = sport
            event.duration = duration
            event.intensity = intensity
            event.description = description
            event.distance = distance
            event.allday = allday
            event.start = start
            event.end = end

            event.save()

            return Response({"message": "Event edited successfully"}, status=status.HTTP_200_OK)
        except:
            return Response({"message": "Event not edited"}, status=status.HTTP_400_BAD_REQUEST)
