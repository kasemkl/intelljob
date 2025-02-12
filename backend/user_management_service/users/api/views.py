from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User

# Custom Serializer Class


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['role'] = user.role
        
        # Add profile ID based on role
        if user.role == 'job_seeker':
            try:
                job_seeker = user.jobseeker
                token['profile_id'] = job_seeker.id
            except:
                token['profile_id'] = None
        elif user.role == 'company':
            try:
                company = user.company
                token['profile_id'] = company.id
            except:
                token['profile_id'] = None

        return token
    

#Custom View Class

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer
    
@api_view(['GET'])
def getRoutes(request):
    routes=[
        'api/token',
        'api/token/refresh'
    ]
    return Response(routes)