from .event import Event
from typing import List
import random


def BULLISH_FLAG(value : float) -> List[Event]:
    events : List[Event] = []
    last = value
    rel_targets = [0.97, 0.995, 0.965, 0.99, 0.96, 0.985, 0.955]
    for r in rel_targets:
        target = value * r
        events.append(Event(random.randrange(4, 10), last, target))
        last = target
    if random.random() < 0.75:
        breakout_target = last * (1 + random.uniform(0.10, 0.15))
    else:
        breakout_target = last * (1 - random.uniform(0.04, 0.08))

    events.append(Event(random.randrange(8,20), last, breakout_target))

    return events


def BEARISH_FLAG(value : float) -> List[Event]:
    events : List[Event] = []
    last = value
    rel_targets = [1.03, 1.005, 1.035, 1.01, 1.04, 1.015, 1.045]

    for r in rel_targets:
        target = value * r
        events.append(Event(random.randrange(4, 10), last, target))
        last = target

    if random.random() < 0.75:
        breakout_target = last * (1 - random.uniform(0.10, 0.15))
    else:
        breakout_target = last * (1 + random.uniform(0.04,0.08))
    
    events.append(Event(random.randrange(8,20),last, breakout_target))
    return events

def BULLISH_PENNANT(value : float) -> List[Event]:
    events: List[Event] = []
    pole_top = value
    
    last = pole_top

    rel_targets = [0.96, 0.995, 0.97, 0.99, 0.98]

    for r in rel_targets:
        target = pole_top * r
        events.append(Event(random.randrange(4, 10), last, target))
        last = target
    if random.random() < 0.75:
        breakout_target = last * (1 + random.uniform(0.08, 0.12))
    else:
        breakout_target = last * (1 - random.uniform(0.04, 0.08))
    events.append(Event(random.randrange(8,20),last, breakout_target))

    return events

def BEARISH_PENNANT(value : float) -> List[Event]:
    events: List[Event] = []
    pole_bottom = value 

    last = pole_bottom
    rel_targets = [1.03, 0.985, 1.02, 0.99, 1.01]

    for r in rel_targets:
        target = pole_bottom * r
        events.append(Event(random.randrange(4,10), last, target))
        last = target
    if random.random() < 0.75:
        breakout_target = last * (1 - random.uniform(0.08, 0.12))
    else:
        breakout_target = last * (1 + random.uniform(0.03, 0.08))
    events.append(Event(random.randrange(8,20), last, breakout_target))

    return events


def DOUBLE_TOP(value : float) -> List[Event]:
    events: List[Event] = []

    top1 = value * (1 + random.uniform(0.09, 0.12))
    events.append(Event(random.randrange(10,16), value, top1))

    neckline = value * (1 + random.uniform(0.04, 0.06))
    events.append(Event(random.randrange(3,6), top1, neckline))
    top2 = value * (1 + random.uniform(0.09, 0.12))
    events.append(Event(random.randrange(3,6), neckline, top2))
    neckline2 = value * (1 + random.uniform(-0.02, 0.02))
    events.append(Event(random.randrange(10,12), top2, neckline2))

    target = neckline2 * (1 - random.uniform(0.09, 0.12))
    events.append(Event(random.randrange(10,12), neckline2, target))
    return events

def DOUBLE_BOTTOM(value : float) -> List[Event]:
    events: List[Event] = []  
    bottom1 = value * (1 - random.uniform(0.09, 0.12))
    events.append(Event(random.randrange(10,16), value, bottom1))

    neckline = value * (1 - random.uniform(0.04, 0.06))
    events.append(Event(random.randrange(3,6), bottom1, neckline))
    bottom2 = value * (1 - random.uniform(0.09, 0.12))
    events.append(Event(random.randrange(3,6), neckline, bottom2))
    neckline2 = value * (1 - random.uniform(-0.02, 0.02))
    events.append(Event(random.randrange(10,12), bottom2, neckline2))

    target = neckline2 * (1 + random.uniform(0.09, 0.12))
    events.append(Event(random.randrange(10,12), neckline2, target))

    return events

def HEAD_AND_SHOULDERS(value : float) -> List[Event]:
    events: List[Event] = []
    left_shoulder = value * (1 + random.uniform(0.04, 0.06))
    events.append(Event(random.randrange(4,6), value, left_shoulder))
    neckline = value * (1 + random.uniform(-0.01, 0.01))
    events.append(Event(random.randrange(4,6), left_shoulder, neckline))
    head = value * (1 + random.uniform(0.06, 0.08))
    events.append(Event(random.randrange(7,10), neckline, head))
    events.append(Event(random.randrange(7,10), head, neckline))
    right_shoulder = left_shoulder
    events.append(Event(random.randrange(4,6), neckline, right_shoulder))
    events.append(Event(random.randrange(4,6), right_shoulder, neckline))

    target = neckline * (1 - random.uniform(0.08, 0.10))
    events.append(Event(random.randrange(10,12), neckline, target))

    return events


def INVERSE_HEAD_AND_SHOULDERS(value : float) -> List[Event]:
    events: List[Event] = []
    left_shoulder = value * (1 - random.uniform(0.04, 0.06))
    events.append(Event(random.randrange(4, 10), value, left_shoulder))
    neckline = value * (1 - random.uniform(-0.01, 0.01))
    events.append(Event(random.randrange(4, 10), left_shoulder, neckline))
    head = value * (1 - random.uniform(0.06, 0.08))
    events.append(Event(random.randrange(7,10), neckline, head))
    events.append(Event(random.randrange(7,10), head, neckline))
    right_shoulder = left_shoulder
    events.append(Event(random.randrange(4,6), neckline, right_shoulder))
    events.append(Event(random.randrange(4,6), right_shoulder, neckline))

    target = neckline * (1 + random.uniform(0.08, 0.10))
    events.append(Event(random.randrange(10,12), neckline, target))

    return events

def RISING_WEDGE(value : float) -> List[Event]:
    events: List[Event] = []
    pole_top = value
    
    last = pole_top

    rel_targets = [1.03, 0.98, 1.035, 0.99, 1.04]

    for r in rel_targets:
        target = pole_top * r
        events.append(Event(random.randrange(4, 8), last, target))
        last = target
    events.append(Event(random.randrange(2,4), last,pole_top * 1 ))
    events.append(Event(random.randrange(1,3), pole_top * 1,pole_top * 1.045 ))
    last = pole_top * 1.045
    if random.random() < 0.75:
        breakout_target = last * (1 - random.uniform(0.08, 0.10))
    else:
        breakout_target = last * (1 + random.uniform(0.04, 0.06))
    
    events.append(Event(random.randrange(12, 14), last, breakout_target))
    
    return events

def FALLING_WEDGE(value: float) -> List[Event]:
    events: List[Event] = []

    pole_top = value
    
    last = pole_top

    rel_targets = [0.97, 1.02, 0.965, 1.01, 0.96]

    for r in rel_targets:
        target = pole_top * r
        events.append(Event(Event(random.randrange(4, 8), last, target)))
        last = target
    events.append(Event(random.randrange(2,4), last,pole_top * 1 ))
    events.append(Event(random.randrange(1,3), pole_top * 1,pole_top * 0.955 ))
    last = pole_top * 0.955
    if random.random() < 0.75:
        breakout_target = last * (1 + random.uniform(0.08, 0.10))
    else:
        breakout_target = last * (1 - random.uniform(0.04, 0.06))
    
    events.append(Event(random.randrange(12,14), last, breakout_target))
    
        
    return events

def RECTANGLE(value : float) -> List[Event]:
    events: List[Event] = []

    pole_top = value
    
    last = pole_top

    rel_targets = [1.02, 0.98, 1.02, 0.98, 1.02, 0.98, 1.02, 0.98]

    for r in rel_targets:
        target = pole_top * r
        events.append(Event(random.randrange(4, 8), last, target))
        last = target
    if random.random() < 0.5:
        events.append(Event(random.randrange(4,8), last,pole_top * 1.04 ))
        events.append(Event(random.randrange(2,4), pole_top * 1.04, pole_top * 1.02 ))
        breakout_target = pole_top * 1.02 * (1 + random.uniform(0.06, 0.08))
        last = pole_top * 1.02
    else:
        events.append(Event(random.randrange(2,4), last,pole_top * 0.96 ))
        events.append(Event(random.randrange(2,4), pole_top * 0.96,pole_top * 0.98))
        breakout_target = pole_top * 0.98 * (1 - random.uniform(0.06, 0.08))
        last = pole_top * 0.98
    
    events.append(Event(random.randrange(12, 14), last, breakout_target))

    return events

def CUP_AND_HANDLE(value : float) -> List[Event]:
    events : List[Event] = []

    events.append(Event(random.randrange(3,5), value, value * 0.97))
    events.append(Event(random.randrange(3,5), value * 0.97, value * 0.95))
    events.append(Event(random.randrange(3,5), value * 0.95, value * 0.94))
    events.append(Event(random.randrange(4,8), value * 0.94, value * 0.96))
    events.append(Event(random.randrange(4,8), value * 0.96, value))
    events.append(Event(random.randrange(2,4), value, value * 0.98))
    events.append(Event(random.randrange(2,4), value * 0.98, value))
    events.append(Event(random.randrange(10,15), value, value * (1 + random.uniform(0.08, 0.1))))
    return events

def INVERTED_CUP_AND_HANDLE(value : float) -> List[Event]:
    events: List[Event] = []

    events.append(Event(random.randrange(3,5), value, value * 1.03))
    events.append(Event(random.randrange(3,5), value * 1.03, value * 1.05))
    events.append(Event(random.randrange(3,5), value * 1.05, value * 1.06))
    events.append(Event(random.randrange(4,8), value * 1.06, value * 1.04))
    events.append(Event(random.randrange(4,8), value * 1.04, value))
    events.append(Event(random.randrange(2,4), value, value * 1.02))
    events.append(Event(random.randrange(2,4), value * 1.02, value))
    events.append(Event(random.randrange(10,15), value, value * (1 - random.uniform(0.08, 0.1))))

    return events
