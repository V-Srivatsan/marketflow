from .stock import *
from typing import List
import random


def BULLISH_FLAG(value : float) -> List[Event]:
    events : List[Event] = []
    pole_top = value * 1.08
    events.append(Event(6, value, pole_top))

    top = pole_top
    bottom = pole_top * 0.97

    zigzag = [
        bottom, 
        top * 0.99,
        bottom * 1.01,
        top * 0.985
    ]

    last = pole_top
    for target in zigzag:
        events.append(Event(3, last, target))
        last = target
    
    if random.random() < 0.75:
        breakout_target = pole_top * 1.06
    else:
        breakout_target = bottom * 0.96

    events.append(Event(4, last, breakout_target))

    return events


def BEARISH_FLAG(value : float) -> List[Event]:
    events: List[Event] = []
    pole_bottom = value * 0.92
    events.append(Event(6, value, pole_bottom))
    top = pole_bottom * 1.03
    bottom = pole_bottom 

    zigzag = [
        top,
        bottom * 1.01,
        top * 0.995,
        bottom * 1.02
    ]

    last = pole_bottom
    
    for target in zigzag:
        events.append(Event(3, last, target))
        last = target

    if random.random() < 0.75:
        breakout_target = pole_bottom * 0.94
    else:
        breakout_target = top * 1.02
    
    events.append(Event(4,last, breakout_target))
    return events

def BULLISH_PENNANT(value : float) -> List[Event]:
    events: List[Event] = []

    pole_top = value * 1.1
    events.append(Event(6, value, pole_top))
    
    last = pole_top

    rel_targets = [0.96, 0.995, 0.97, 0.99, 0.98]
    seg_candles = [4, 3, 3, 2, 2]

    for r,c in zip(rel_targets, seg_candles):
        target = pole_top * r
        events.append(Event(c, last, target))
        last = target

    breakout_target = pole_top * 1.08
    events.append(Event(5,last, breakout_target))

    return events

def BEARISH_PENNANT(value : float) -> List[Event]:
    events: List[Event] = []
    pole_bottom = value * 0.9
    events.append(Event(6, value, pole_bottom))

    last = pole_bottom
    rel_targets = [1.03, 0.985, 1.02, 0.99, 1.01]
    seg_candles = [4,3,3,2,2]

    for r,c in zip(rel_targets, seg_candles):
        target = pole_bottom * r
        events.append(Event(c, last, target))
        last = target

    breakout_target = pole_bottom * 0.9
    events.append(Event(5, last, breakout_target))

    return events


def DOUBLE_TOP(value : float) -> List[Event]:
    events: List[Event] = []

    top1 = value * 1.12
    events.append(Event(10, value, top1))

    neckline = value * 1.03
    events.append(Event(8, top1, neckline))
    top2 = top1 * 0.997
    events.append(Event(9, neckline, top2))

    events.append(Event(7, top2, neckline))

    measured_move = top1 - neckline
    target = max(0.0, neckline - measured_move)
    events.append(Event(12, neckline, target))
    return events

def DOUBLE_BOTTOM(value : float) -> List[Event]:
    events: List[Event] = []  
    bottom1 = value * 0.88
    events.append(Event(10, value, bottom1))
    neckline = value * 0.97
    events.append(Event(8, bottom1, neckline))
    bottom2 = bottom1 * 1.01
    events.append(Event(9, neckline, bottom2))
    events.append(Event(7, bottom2, neckline))

    measured_move = neckline - bottom1
    target = neckline + measured_move
    events.append(Event(12, neckline, target))

    return events

def TRIPLE_TOP(value : float) -> List[Event]:
    events : List[Event] = []

    top1 = value * 1.12
    events.append(Event(10, value, top1))

    low1 = value * 1.03
    events.append(Event(8, top1, low1))
    top2 = top1 * 0.998
    events.append(Event(9, low1, top2))
    low2 = low1 * 0.998
    events.append(Event(7, top2, low2))
    top3 = top1 * 1.002
    events.append(Event(9, low2, top3))
    events.append(Event(8, top3, low2))

    measured_move = top1 - low1
    target = low1 - measured_move
    events.append(Event(12, low2, target))

    return events

def TRIPLE_BOTTOM(value : float) -> List[Event]:
    events: List[Event] = []

    bottom1 = value * 0.88
    events.append(Event(10, value, bottom1))
    high1 = value * 0.97
    events.append(Event(9, bottom1, high1))
    bottom2 = bottom1 * 1.01
    events.append(Event(8, high1, bottom2))
    high2 = high1 * 0.998
    events.append(Event(9, bottom2, high2))
    bottom3 = bottom1 * 0.997
    events.append(Event(8, high2, bottom3))
    events.append(Event(9, bottom3, high2))

    measured_move = high1 - bottom1
    target = high1 + measured_move 
    events.append(Event(12, high2, target))

    return events

def HEAD_AND_SHOULDERS(value : float) -> List[Event]:
    events: List[Event] = []
    left_shoulder = value * 1.08
    events.append(Event(8, value, left_shoulder))
    neckline = value * 1.03
    events.append(Event(6, left_shoulder, neckline))
    head = value * 1.2
    events.append(Event(10, neckline, head))
    events.append(Event(6, head, neckline))
    right_shoulder = left_shoulder * 0.995
    events.append(Event(8, neckline, right_shoulder))
    events.append(Event(6, right_shoulder, neckline))

    measured_move = head - neckline 
    target = max(0.0, neckline - measured_move)
    events.append(Event(12, neckline, target))

    return events


def INVERSE_HEAD_AND_SHOULDERS(value : float) -> List[Event]:
    events: List[Event] = []
    left_shoulder = value * 0.92
    events.append(Event(10, value, left_shoulder))
    neckline = value * 0.97
    events.append(Event(8, left_shoulder, neckline))
    head = value * 0.85
    events.append(Event(10,neckline, head))
    events.append(Event(8, head, neckline))
    right_shoulder = left_shoulder * 1.01
    events.append(Event(9, neckline, right_shoulder))
    events.append(Event(7, right_shoulder, neckline))

    measured_move = neckline - head
    target = neckline + measured_move
    events.append(Event(12, neckline, target))

    return events

def RISING_WEDGE(value : float) -> List[Event]:
    events: List[Event] = []

    pole_top = value * 1.12

    events.append(Event(10, value, pole_top))

    top1 = pole_top * 1.02
    low1 = pole_top * 0.985

    events.append(Event(8, pole_top, top1))
    events.append(Event(7, top1, low1))
    
    top2 = pole_top * 1.04
    low2 = pole_top * 0.99
    
    events.append(Event(7, low1, top2))
    events.append(Event(6, top2, low2))
    
    top3 = pole_top * 1.03
    low3 = pole_top * 1.005
    
    events.append(Event(6, low2, top3))
    events.append(Event(6, top3, low3))
    
    height = pole_top - low1
    target = max(0.0, low3 - height)
    
    events.append(Event(12, low3, target))
    
    return events

def FALLING_WEDGE(value: float) -> List[Event]:
    events: List[Event] = []

    pole_bottom = value * 0.90
    events.append(Event(10, value, pole_bottom))
    high1 = pole_bottom * 1.03
    low1 = pole_bottom * 0.985
    
    events.append(Event(8, pole_bottom, high1))
    events.append(Event(7, high1, low1))
    high2 = pole_bottom * 1.05
    low2 = pole_bottom * 0.99
    
    events.append(Event(7, low1, high2))
    events.append(Event(6, high2, low2))
    high3 = pole_bottom * 1.04
    low3 = pole_bottom * 1.005
    events.append(Event(6, low2, high3))
    events.append(Event(6, high3, low3))
    
    height = value - pole_bottom
    target = low3 + height
    events.append(Event(12, low3, target))
    
    return events

def TRIANGLE(value : float) ->List[Event]:
    events: List[Event] = []
    swing_low = value * 0.93
    events.append(Event(10, value, swing_low))
    high1 = value * 1.02
    low1 = value * 0.965
    events.append(Event(8, swing_low, high1))
    events.append(Event(7, high1, low1))
    high2 = value * 1.015
    low2 = value * 0.97
    events.append(Event(7, low1, high2))
    events.append(Event(6, high2, low2))
    high3 = value * 1.01
    low3 = value * 0.975
    events.append(Event(6, low2, high3))
    events.append(Event(6, high3, low3))
    
    base_height = high1 - low1
    target = low3 - base_height
    events.append(Event(12, low3, target))
    return events

def RECTANGLE(value : float) -> List[Event]:
    events: List[Event] = []

    bottom = value * 0.94
    events.append(Event(8, value, bottom))
    top = value * 1.02
    mid = (top + bottom) / 2
    events.append(Event(7, bottom, top))
    events.append(Event(6, top, mid))
    events.append(Event(7, mid, top))
    events.append(Event(6, top, bottom))
    events.append(Event(8, bottom, mid))

    height = top - bottom
    target = bottom - height
    events.append(Event(12, mid, target))
    
    return events

def CUP_AND_HANDLE(value : float) -> List[Event]:
    events : List[Event] = []

    left_top = value
    left_bottom1 = value * 0.95

    events.append(Event(14, left_top, left_bottom1))
    left_bottom2 = value * 0.92
    events.append(Event(12, left_bottom1, left_bottom2))
    
    base_mid = value * 0.905
    events.append(Event(12, left_bottom2, base_mid))
    right_bottom2 = value * 0.92
    events.append(Event(12, base_mid, right_bottom2))
    right_bottom1 = value * 0.95
    events.append(Event(12, right_bottom2, right_bottom1))
    
    cup_rim = value * 1.00
    events.append(Event(16, right_bottom1, cup_rim))
    handle_pull = cup_rim * 0.98
    events.append(Event(10, cup_rim, handle_pull))
    handle_base = cup_rim * 0.99
    events.append(Event(8, handle_pull, handle_base))
    
    height = cup_rim - left_bottom2
    target = handle_base + height
    events.append(Event(18, handle_base, target))
    
    return events

def INVERTED_CUP_AND_HANDLE(value : float) -> List[Event]:
    events: List[Event] = []

    left_top = value
    top1 = value * 1.05
    events.append(Event(14, left_top, top1))
    mid1 = value * 1.03
    events.append(Event(12, top1, mid1))

    cup_peak = value * 1.06
    events.append(Event(14, mid1, cup_peak))
    mid2 = value * 1.03
    events.append(Event(12, cup_peak, mid2))

    right_top = value * 1.05
    events.append(Event(14, mid2, right_top))

    handle_start = value * 1.02
    events.append(Event(10, right_top, handle_start))
    handle_end = value * 1.03
    events.append(Event(8, handle_start, handle_end))

    height = cup_peak - handle_start
    target = handle_end - height
    events.append(Event(10, handle_end, target))

    return events
