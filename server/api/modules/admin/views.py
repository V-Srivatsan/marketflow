from fastapi import APIRouter, HTTPException, Depends
import os, requests
import middleware
from modules.misc.views import NEWS_UPDATES

from . import forms
from modules.user.models import User

router = APIRouter()

@router.post('/login')
async def login(form: forms.LoginForm):
    print(form.username, form.password, flush=True)
    if form.username == os.environ['ADMIN_USERNAME'] and \
        form.password == os.environ['ADMIN_PASSWORD']:
            return { "token": middleware.sign_jwt({ "username": form.username, "password": form.password }) }

    raise HTTPException(401, detail={"message": "Incorrect username or password"})


@router.post('/news')
async def post_news(data: forms.NewsForm, _: None = Depends(middleware.check_admin)):
    NEWS_UPDATES.publish(data.message)
    return { "message": "News update sent successfully" }



@router.get('/stock')
async def get_status(_: None = Depends(middleware.check_admin)):
    res = requests.get(os.environ['ENGINE_HOST'] + '/')
    return res.json()

@router.post('/stock')
async def start_provider(_: None = Depends(middleware.check_admin)):
    requests.post(os.environ['ENGINE_HOST'] + '/')
    return {  "message": "Stock provider started successfully" }

@router.delete('/stock')
async def stop_provider(_: None = Depends(middleware.check_admin)):
    requests.delete(os.environ['ENGINE_HOST'] + '/')
    return {  "message": "Stock provider stopped successfully" }

@router.post('/events')
async def trigger_event(data: forms.StockEventForm, _: None = Depends(middleware.check_admin)):
    requests.post(os.environ['ENGINE_HOST'] + '/events', json={"events": data.events})
    return { "message": "Stock event triggered successfully" }

@router.post('/patterns')
async def trigger_pattern(data: forms.StockEventForm, _: None = Depends(middleware.check_admin)):
    requests.post(os.environ['ENGINE_HOST'] + '/patterns', json={"events": data.events})
    return { "message": "Stock pattern triggered successfully" }



@router.get('/user')
async def get_user(_: None = Depends(middleware.check_admin)):
    return {"users": [
        {"username": user.username, "verified": user.verified}
        for user in await User.all()
    ]}

@router.put('/user/{username}')
async def verify_user(username: str, _: None = Depends(middleware.check_admin)):
    res = await User.filter(username=username).update(verified=True)
    if not res: raise HTTPException(404, detail={"message": "User not found!"})
    return {"message": "User verified successfully."}

@router.delete('/user/{username}')
async def suspend_user(username: str, _: None = Depends(middleware.check_admin)):
    res = await User.filter(username=username).update(verified=False)
    if not res: raise HTTPException(404, detail={"message": "User not found!"})
    return {"message": "User suspended successfully."}

@router.put('/user')
async def verify_users(form: forms.UsersForm, _: None = Depends(middleware.check_admin)):
    await User.filter(username__in=form.users).update(verified=True)
    return { "message": "Users verified successfully" }

@router.delete('/user')
async def suspend_users(form: forms.UsersForm, _: None = Depends(middleware.check_admin)):
    await User.filter(username__in=form.users).update(verified=False)
    return { "message": "Users suspended successfully" }
