import gymnasium as gym
from gymnasium import spaces
import numpy as np
from sim import MarketEngine

class MarketflowGym(gym.Env):
    def __init__(self, initial_cash: float = 10000.0):
        super().__init__()
        self.initial_cash = initial_cash
        self.engine = MarketEngine()

        self.action_space = spaces.Discrete(11)
        
        # State normalized around ~[-1.0, 1.0] scale for neural net stability
        self.observation_space = spaces.Box(
            low=-np.inf, high=np.inf, shape=(5,), dtype=np.float32
        )

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.price = self.engine.reset()
        self.cash = float(self.initial_cash)
        self.quantity = 0            # >0 Long, <0 Short
        self.short_balance = 0.0
        self.step_count = 0
        self.portfolio_value = self.cash

        return self._get_obs(), {}

    def step(self, action: int):
        self.step_count += 1
        units = self._map_action(action)
        
        # Track trade execution
        if units > 0:
            self._execute_buy(units)
        elif units < 0:
            self._execute_sell(-units)

        self.price = self.engine.step()

        prev_portfolio_val = self.portfolio_value
        self.portfolio_value = self._calculate_portfolio_value()

        # Scaled Percent Return Reward (Multiplied by 100 for gradient stability)
        pnl_pct = (self.portfolio_value - prev_portfolio_val) / prev_portfolio_val
        reward = pnl_pct * 100.0

        # Small penalty for unnecessary holding when idle to encourage active trading explore
        if action == 0:
            reward -= 0.1

        terminated = self.portfolio_value <= (self.initial_cash * 0.1)
        truncated = self.step_count >= 1000

        return self._get_obs(), float(reward), terminated, truncated, {}

    def _execute_buy(self, units: int):
        if self.quantity < 0:
            num_units = min(units, -self.quantity)
            short_price = self.short_balance / (-self.quantity)
            profit = num_units * (short_price - self.price)

            self.cash += profit + (num_units * short_price)
            self.short_balance -= num_units * short_price
            self.quantity += num_units
            units -= num_units
            self.engine.record_transaction(num_units, self.price)

        if units > 0:
            price = self.engine.calculate_buy_cost(units)
            if self.cash >= price:
                self.cash -= price
                self.quantity += units
                self.engine.record_transaction(units, price / units)

    def _execute_sell(self, units: int):
        if self.quantity > 0:
            num_units = min(self.quantity, units)
            price = self.engine.calculate_sell_revenue(num_units)

            self.cash += price
            self.quantity -= num_units
            units -= num_units
            self.engine.record_transaction(-num_units, price / num_units)

        if units > 0:
            price = self.engine.calculate_sell_revenue(units)
            if self.cash >= price:
                self.cash -= price
                self.quantity -= units
                self.short_balance += price
                self.engine.record_transaction(-units, price / units)

    def action_masks(self) -> np.ndarray:
        mask = np.ones(11, dtype=bool)

        # Check Buys (Actions 1 to 5)
        for u in range(1, 6):
            units = u
            temp_cash = self.cash
            
            if self.quantity < 0:
                num_units = min(units, -self.quantity)
                short_price = self.short_balance / (-self.quantity)
                profit = num_units * (short_price - self.price)
                temp_cash += profit + (num_units * short_price)
                units -= num_units

            if units > 0:
                cost = self.engine.calculate_buy_cost(units)
                if temp_cash < cost:
                    mask[u] = False

        # Check Sells/Shorts (Actions 6 to 10)
        for u in range(1, 6):
            action_idx = u + 5
            units = u
            temp_cash = self.cash
            
            if self.quantity > 0:
                num_units = min(self.quantity, units)
                revenue = self.engine.calculate_sell_revenue(num_units)
                temp_cash += revenue
                units -= num_units

            if units > 0:
                short_revenue = self.engine.calculate_sell_revenue(units)
                if temp_cash < short_revenue:
                    mask[action_idx] = False

        return mask

    def _calculate_portfolio_value(self) -> float:
        if self.quantity >= 0:
            return self.cash + (self.quantity * self.price)
        else:
            buyback_cost = self.price * (-self.quantity)
            return self.cash + self.short_balance - buyback_cost

    def _get_obs(self):
        return np.array([
            self.price / 100.0,
            self.cash / self.initial_cash,
            float(self.quantity) / 50.0,
            self.short_balance / self.initial_cash,
            self.portfolio_value / self.initial_cash
        ], dtype=np.float32)

    def _map_action(self, action: int) -> int:
        if action == 0:
            return 0
        elif 1 <= action <= 5:
            return action
        elif 6 <= action <= 10:
            return -(action - 5)
        return 0