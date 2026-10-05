import random

def sum_gp(a: float, n: int) -> float:
    if a == 1.0:
        return float(n)
    return a * (1 - a**n) / (1 - a)

class MarketEngine:
    def __init__(self, initial_price: float = 100.0):
        self.initial_price = initial_price
        self.reset()

    def reset(self):
        self.price = self.initial_price
        self.pending_volume_delta = 0.0
        return self.price

    def calculate_buy_cost(self, units: int) -> float:
        return self.price * sum_gp(1.001, units)

    def calculate_sell_revenue(self, units: int) -> float:
        return self.price * sum_gp(1 / 1.001, units)

    def record_transaction(self, units: int, exec_price: float):
        self.pending_volume_delta += units * exec_price * 0.001

    def step(self):
        delta = self.pending_volume_delta
        self.pending_volume_delta = 0.0
        self.price += delta + (self.price * random.uniform(-0.01, 0.01))
        self.price = max(0.01, self.price)
        return self.price