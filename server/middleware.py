from fastapi import Header, Depends, HTTPException, status
import jwt, os, uuid

import data.db as db
from sqlalchemy.exc import NoResultFound
from user.models import User

def get_user(
    user_token: str | None = Header(default=None),
    session: db.sql.Session = Depends(db.get_session)
):
    if user_token is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Credential validation failed")
    
    try:
        data = jwt.decode(user_token, os.environ['SECRET'], algorithms=['HS256'])
        res = session.exec(db.sql.select(User).where(User.uid == uuid.UUID(data['uid'])))
        return res.one()

    except (NoResultFound, jwt.InvalidTokenError):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Credential validation failed")


def check_admin(user_token: str | None = Header(default=None)):
    if user_token is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Credential validation failed")

    try:
        data = jwt.decode(user_token, os.environ['SECRET'], algorithms=['HS256'])
        if data['username'] != os.environ['ADMIN_USERNAME'] or data['password'] != os.environ['ADMIN_PASSWORD']:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Admin access required")

    except (NoResultFound, jwt.InvalidTokenError):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Credential validation failed")