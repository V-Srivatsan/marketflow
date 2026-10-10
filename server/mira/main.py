import torch
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel

from gym import MarketflowGym
from agent import Agent
import gymnasium as gym

env = MarketflowGym()
agent = Agent(gym.vector.SyncVectorEnv([lambda: env]))
agent.load_state_dict(torch.load("model.pt"))
agent.eval()


app = FastAPI()

@app.get('/health')
async def health_check():
    return {"status": "ok"}

class PredictForm(BaseModel):
    price: float
    cash: float
    quantity: int
    short_balance: float
    portfolio_val: float

@app.post('/')
async def predict_action(form: PredictForm):
    obs = torch.Tensor([form.price, form.cash, form.quantity, form.short_balance, form.portfolio_val]).unsqueeze(0)
    with torch.no_grad():
        action, _, _, _ = agent.get_action_and_value(obs)

    res = action.item()
    return { "units": res if res <= 5 else -(res-5) }