from fastapi import HTTPException, status

from . import models
from modules.user import models as user_models
from modules.stock import models as stock_models
from lib.cache import Cache

CACHE = Cache()
sumGP = lambda a,n: a * (1 - a**n) / (1 - a)


async def buy_stock(
    user: user_models.User, stock: stock_models.Stock, 
    units: int, holding: models.Holding | None
):
    per_unit = stock_models.StockEntry.from_json(CACHE.get(stock.uid.hex)).close
    txn = models.Transaction(
        user=user,
        stock=stock,
        num_units=units,
        price=per_unit
    )

    if holding is not None and holding.quantity < 0:
        num_units = min(units, -holding.quantity)
        short_price = holding.short_balance / -holding.quantity
        profit = num_units * (short_price - per_unit)

        user.balance += profit + (num_units * short_price)
        holding.short_balance -= num_units * short_price
        holding.quantity += num_units
        units -= num_units

    
    if units > 0:
        price = per_unit * sumGP(1.001, units)
        if (user.balance < price):
            raise HTTPException(status.HTTP_417_EXPECTATION_FAILED, detail={"message": "Insufficient balance" })
        
        user.balance -= price
        if holding is None:
            holding = models.Holding(
                user=user,
                stock=stock,
                quantity=units,
                short_balance=0,
                avg_price=price/units
            )
        else:
            holding.avg_price = (holding.avg_price * holding.quantity + price) / (holding.quantity + units)
            holding.quantity += units
        
    await holding.save()
    await user.save()
    await txn.save()
    
    return { 
        "valid": True, "message": "Transaction successful!", 
        "balance": user.balance, "avg_price": holding.avg_price # type: ignore
    }


async def sell_stock(
    user: user_models.User, stock: stock_models.Stock,
    units: int, holding: models.Holding | None
):
    per_unit = stock_models.StockEntry.from_json(CACHE.get(stock.uid.hex)).close
    txn = models.Transaction(
        user=user,
        stock=stock,
        num_units=-units,
        price=per_unit
    )
    
    if holding is not None:
        num_units = min(holding.quantity, units)
        price = per_unit * sumGP(1/1.001, num_units)

        user.balance += price
        holding.quantity -= num_units
        units -= num_units
    
    if units > 0:
        price = per_unit * sumGP(1/1.001, units)
        if (user.balance < price):
            raise HTTPException(status.HTTP_417_EXPECTATION_FAILED, detail={"message": "Insufficient balance" })
        
        user.balance -= price
        if holding is None:
            holding = models.Holding(
                user=user,
                stock=stock,
                quantity=-units,
                short_balance=price,
                avg_price=price/units
            )
        else:
            holding.avg_price = (holding.avg_price * -holding.quantity + price) / (-holding.quantity + units)
            holding.quantity -= units
            holding.short_balance += price
            
    await holding.save()
    await user.save()
    await txn.save()

    return { 
        "message": "Transaction successful!", 
        "balance": user.balance, "avg_price": holding.avg_price # type: ignore
    }
        

async def transact(stock_id: str, units: int, user_id: str):
    stock = await stock_models.Stock.get_or_none(uid=stock_id)
    if stock is None: raise HTTPException(status.HTTP_404_NOT_FOUND, detail={"message": "Stock ID not found"})
    
    user = await user_models.User.get_or_none(uid=user_id)
    if user is None: raise HTTPException(status.HTTP_404_NOT_FOUND, detail={"message": "User not found"})
    if not user.verified: raise HTTPException(status.HTTP_403_FORBIDDEN, detail={"message": "User not verified"})
    
    holding = await models.Holding.get_or_none(user=user, stock=stock)
    if units == 0: raise HTTPException(status.HTTP_400_BAD_REQUEST, detail={"message": "Units cannot be zero"})

    return (
        await buy_stock(user, stock, units, holding) if units > 0 
        else await sell_stock(user, stock, -units, holding)
    )

async def get_transactions(user_id: str):
    user = await user_models.User.get_or_none(uid=user_id)
    if not user: raise HTTPException(404, detail={"message": "User not found!"})

    transactions = await models.Transaction.filter(user=user)\
        .order_by('-timestamp').all().prefetch_related('stock')
    return {
        "transactions": [{
            "stock": transaction.stock.name,
            "units": transaction.num_units,
            "price": transaction.price,
            "timestamp": transaction.timestamp
        } for transaction in transactions]
    }