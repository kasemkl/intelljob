import jwt
from fastapi import HTTPException, Request, Header

SECRET_KEY = 'django-insecure-#z6n0_zv*#dkjj36z0$*-cbji9o6w4wwbw^@(&2ea%594$4zw_'




def verify_jwt(authorization: str = Header(...)):
    """
    Decodes and validates a JWT token from the Authorization header.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
    token = authorization.split(" ")[1]
    # print("token",token)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        # print("JWT Verified:", payload)
        return token
    except jwt.ExpiredSignatureError:
        print("Token expired")
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        print("Invalid token")
        raise HTTPException(status_code=401, detail="Invalid token")
