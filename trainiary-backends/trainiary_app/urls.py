from django.conf.urls import url
from django.urls import path, include
 
from .views import Index, AddWorkout, AuthenticateUser, RegisterUser, FetchEvents, DeleteEvent, ChangePassword, ChangeEvent
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views

 
 
router = routers.DefaultRouter()
 
urlpatterns = [
    path('postworkout', AddWorkout.as_view()),
    path('user/auth', AuthenticateUser.as_view()),
    path('user/register', RegisterUser.as_view()),
    path('fetchevents', FetchEvents.as_view()),
    path('deleteevent', DeleteEvent.as_view()),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('user/changepassword', ChangePassword.as_view()),
    path('changeevent', ChangeEvent.as_view()),

    # catch-all pattern for compatibility with the Angular routes. This must be last in the list.
    url(r'^.*', Index.as_view()),
]