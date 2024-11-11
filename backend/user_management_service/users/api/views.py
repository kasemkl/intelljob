from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


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
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user  # This will be the authenticated user
        data['email'] = user.email
        data['first_name'] = user.first_name
        data['last_name'] = user.last_name
        data['role'] = user.role
        return data

#Custom View Class


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create tokens
        tokens = serializer.validated_data
        refresh = tokens['refresh']
        access = tokens['access']

        # Prepare response data
        response_data = {
            "refresh": str(refresh),
            "access": str(access),
            "email": tokens['email'],
            "first_name": tokens['first_name'],
            "last_name": tokens['last_name'],
            "role": tokens['role'],
        }
        return Response(response_data)
    
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/auth/token/',
        '/auth/token/refresh/',
    ]
    return Response(routes)
