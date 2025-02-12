import jwt
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings

def verify_jwt(token):
    """
    Decodes and verifies the JWT token.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload  # Returns user details
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Token has expired")
    except jwt.InvalidTokenError:
        raise AuthenticationFailed("Invalid token")
