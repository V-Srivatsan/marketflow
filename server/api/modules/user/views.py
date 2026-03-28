from fastapi import APIRouter, Depends
import middleware
from . import forms, logic

router = APIRouter()

@router.post('/login')
async def login(data: forms.UserForm):
    return await logic.login(data)

@router.post('/signup')
async def signup(data: forms.UserForm):
    return await logic.signup(data)

@router.put('/verify/{username}')
async def verify_user(username: str, _: None = Depends(middleware.check_admin)):
    return await logic.verify_user(username)

@router.get('/')
async def get_info(user: str = Depends(middleware.get_user)):
    return await logic.get_info(user)

