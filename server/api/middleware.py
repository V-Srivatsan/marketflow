from fastapi import Header, HTTPException, status
import jwt, os

def get_user(authorization: str | None = Header(default=None)):
    if not authorization:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail={"message": "Unauthorized access"})
    try:
        payload = jwt.decode(authorization, os.environ["SECRET"], algorithms=["HS256"])
        return payload.get("uid")
    
    except jwt.InvalidTokenError:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail={"message": "Credential validation failed"})
    

def check_admin(authorization: str | None = Header(default=None)):
    if not authorization:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail={"message": "Unauthorized access"})
    try:
        payload = jwt.decode(authorization, os.environ["SECRET"], algorithms=["HS256"])
        if payload.get("username") != os.environ["ADMIN_USERNAME"] or payload.get("password") != os.environ["ADMIN_PASSWORD"]:
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail={"message": "Admin access required"})
    
    except jwt.InvalidTokenError:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail={"message": "Credential validation failed"})