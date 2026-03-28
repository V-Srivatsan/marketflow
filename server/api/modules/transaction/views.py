from fastapi import APIRouter, Depends
from . import logic, forms
import middleware

router = APIRouter()

@router.post('/{stock_id}')
async def transact(stock_id: str, form: forms.TransactForm, user: str = Depends(middleware.get_user)):
    return await logic.transact(stock_id, form.units, user)

@router.get('/')
async def get_transaction(user: str = Depends(middleware.get_user)):
    return await logic.get_transactions(user)