import jwt, os
from fastapi import HTTPException
from tortoise.exceptions import IntegrityError
from . import models, forms
from modules.transaction import models as transaction_models

async def login(data: forms.UserForm):
    user = await models.User.get_or_none(username=data.username)
    if not user: raise HTTPException(404, detail={"message": "Username not found!"})
    if not user.verify(data.password): raise HTTPException(401, detail={"message": "Incorrect password"})

    return {"token": jwt.encode({ "uid": user.uid.hex }, os.environ['SECRET'], algorithm='HS256')}


async def signup(data: forms.UserForm):
    try:
        user = models.User(username=data.username, password=data.password)
        await user.save()
        return {"token": jwt.encode({ "uid": user.uid.hex }, os.environ['SECRET'], algorithm='HS256')}
    
    except IntegrityError:
        raise HTTPException(400, detail={"message": "Username already taken!"})

    
async def verify_user(username: str):
    user = await models.User.get_or_none(username=username)
    if not user: raise HTTPException(404, detail={"message": "User not found!"})

    user.verified = True
    await user.save()
    return {"message": "User verified successfully."}


async def get_info(user_id: str):
    user = await models.User.get_or_none(uid=user_id)
    if not user: raise HTTPException(404, detail={"message": "User not found!"})

    holdings = await transaction_models.Holding.filter(user=user).all().prefetch_related('stock')
    return {
        "balance": user.balance,
        "owned": dict([
            (holding.stock.uid.hex, {
                "avg_price": holding.avg_price,
                "quantity": holding.quantity
            }) for holding in holdings
        ])
    }