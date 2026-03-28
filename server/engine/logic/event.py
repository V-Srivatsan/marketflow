import random

class Event:
    _curr: int
    _prev: float
    num_candles: int
    ends: tuple[float, float]

    def __init__(self, num_candles: int, data_from: float, data_to: float):
        if num_candles < 1: raise ValueError("Number of candles for transition should be atleast 1")

        self._curr = 0
        self._prev = data_from
        self.num_candles = num_candles
        self.ends = (data_from, data_to)

    def is_finished(self) -> bool:
        return self._curr == self.num_candles

    def get_next(self) -> float:
        self._curr += 1
        if self._curr > self.num_candles: raise IndexError("Exceeded the number of candles")
        if self._curr == self.num_candles: return self.ends[1]
        lin_value = self.ends[0] + self._curr * (self.ends[1] - self.ends[0]) / self.num_candles

        diff = min(lin_value - self.ends[0], self.ends[1] - lin_value) / 2
        value = random.uniform(lin_value - diff, lin_value + diff)
        self._prev = value
        return value