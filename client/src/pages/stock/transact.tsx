import { useState, useEffect, useRef } from "react";
import { makeRequest, showMessage, getBuyPrice, getSellPrice } from "../../lib/utils";
import { useUserStore } from "../../lib/store";

type Props = {
  stockId: string;
  stockName: string;
  price: number;
};

const Transact = ({ stockId, stockName, price }: Props) => {
  const userStore = useUserStore((state) => state);

  const [units, setUnits] = useState(1);
  const [isBuy, setIsBuy] = useState(true);
  const [loading, setLoading] = useState(false);

  const owned = userStore.stocks[stockId]?.quantity || 0;

  const buyPrice = getBuyPrice(price, units);
  const sellPrice = getSellPrice(price, units);

  const transact = async (num_units?: number, silent?: boolean) => {
    const num_stocks = num_units ?? (units * (isBuy ? 1 : -1))
    if (Math.abs(num_stocks) < 1 || isNaN(num_stocks)) {
      showMessage("Enter a valid number of units", true);
      return;
    }

    if (Math.abs(num_stocks) > 100) {
      showMessage("Cannot transact more than 100 units at once", true);
      return;
    }

    setLoading(true);
    try {
      const res = await makeRequest(`transact/${stockId}`, "POST", { units: num_stocks }, true);

      if (res?.detail) {
        if (!silent) showMessage(res.detail.message, true);
      } else {
        if (!silent) showMessage(res.message);
        userStore.update(res.balance, {
          ...userStore.stocks,
          [stockId]: {
            quantity: (userStore.stocks[stockId]?.quantity ?? 0) + num_stocks,
            avg_price: res.avg_price
          }
        });
      }
    } catch {
      if (!silent) showMessage("Transaction failed", true);
    } finally {
      setLoading(false);
    }
  };

  const tickCount = useRef(0)
  const [miraActive, setMiraActive] = useState(false);
  const [miraPassion, setMiraPassion] = useState(5);

  useEffect(() => {
    tickCount.current = (tickCount.current+1)%miraPassion
    if (tickCount.current === 0)
      makeRequest(`stock/mira/${stockId}`, 'GET', undefined, true)
        .then((data) => {
          if (data.units === 0) return;
          transact(data.units, true)
        })
  }, [price])

  return (
    <section className="col-span-3 shrink-0 border-l border-border bg-background relative z-10 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.3)]">
      <div className="w-full flex flex-col border-r border-border bg-card/30">
        <div className="p-6 flex-1">
          <h3 className="font-semibold text-lg mb-6 flex items-center justify-between">
            Trade {stockName}
          </h3>

          <div className="flex bg-background rounded-md p-1 mb-6 border border-border">
            <button className={`flex-1 py-2 text-sm font-medium rounded-sm transition-colors
              ${isBuy ? 'bg-primary text-primary-foreground' : 'text-secondary-foreground hover:text-foreground'}
            `} onClick={() => setIsBuy(true)}>Buy</button>
            <button className={`flex-1 py-2 text-sm font-medium rounded-sm transition-colors
              ${!isBuy ? 'bg-primary text-primary-foreground' : 'text-secondary-foreground hover:text-foreground'}
            `} onClick={() => setIsBuy(false)}>Sell</button>
          </div>

          <div className="space-y-4 text-sm mb-6">
            <div className="flex justify-between items-center pb-4 border-b border-border/50">
              <span className="text-secondary-foreground">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  disabled={units == 1}
                  onClick={() => setUnits(units - 1)}
                  className="w-6 h-6 rounded bg-background border border-border flex items-center justify-center hover:bg-secondary">-</button>
                <span className="tabular-nums font-medium w-8 text-center">{units}</span>
                <button
                  disabled={units == 100}
                  onClick={() => setUnits(units + 1)}
                  className="w-6 h-6 rounded bg-background border border-border flex items-center justify-center hover:bg-secondary">+</button>
              </div>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-border/50">
              <span className="text-secondary-foreground">Market Price</span>
              <span className="tabular-nums font-medium">₹{(price * units).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-border/50">
              <span className="text-secondary-foreground">Broker Fees</span>
              <span className="tabular-nums font-medium">₹{
                Math.abs((isBuy ? buyPrice : sellPrice) - price * units).toFixed(2)
              }</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-secondary-foreground">Estimated Total</span>
              <span className="tabular-nums text-lg font-semibold">
                ₹{(isBuy ? buyPrice : sellPrice).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() => transact()}
            disabled={loading || miraActive || (
              isBuy ? buyPrice > userStore.balance :
                getSellPrice(price, Math.max(units - owned, 0)) > userStore.balance
            )}
            className={`w-full py-4 rounded-lg font-medium transition-all shadow-lg ${isBuy
              ? 'bg-success hover:bg-success/90 text-white shadow-success/20'
              : 'bg-destructive hover:bg-destructive/90 text-white shadow-success/20'
              }`}
          >{isBuy ? 'Buy' : 'Sell'} shares</button>

          <div className="text-center text-xs text-muted-foreground mt-4">
            Available Balance: <span className="tabular-nums font-medium">₹{userStore.balance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col transition-all duration-300 bg-background">
        <div className="p-6 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-3">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  MIRA
                  {miraActive?
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" /> :
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  }
                </h3>
                <div className="text-xs text-secondary-foreground">Market Intelligence Agent</div>
              </div>
            </div>
            
            <button onClick={() => setMiraActive(!miraActive)} className="w-10 h-6 rounded-full border border-border relative transition-colors bg-primary/20">
              <div className={"w-4 h-4 rounded-full transition-all " + (miraActive ? 'bg-primary ms-auto me-1' : 'bg-muted-foreground ms-1 me-auto')} />
            </button>
            
          </div>
          
          <div className="flex gap-3">
            <span>Aggressive</span>
            <input disabled={miraActive} type="range" step={1} min={1} max={10}
              value={miraPassion} onChange={(e) => setMiraPassion(parseInt(e.currentTarget.value))}
              className="flex-1 accent-primary-hover" />
            <span>Passive</span>
          </div>
        </div>

        {/* <div className="flex border-b border-border text-sm">
          <button className="flex-1 py-3 text-center border-b-2 border-primary text-primary font-medium bg-primary/5">
            Activity
          </button>
          <button className="flex-1 py-3 text-center border-b-2 border-transparent text-secondary-foreground hover:text-foreground">
            Reasoning
          </button>
        </div> */}

        {/* <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
          <div className={`space-y-4 ${isFrozen ? 'opacity-50' : ''}`}>
            <div className="bg-card border border-border rounded-lg p-3 text-sm shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-success/10 text-success rounded text-xs font-bold">BUY</span>
                  <span className="font-semibold">{selectedStock.ticker}</span>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">Just now</span>
              </div>
              <p className="text-secondary-foreground text-xs leading-relaxed">
                MIRA bought 5 shares at ${selectedStock.price.toFixed(2)}. Momentum turned positive over the last 15 candles.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-3 text-sm shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-destructive/10 text-destructive rounded text-xs font-bold">SELL</span>
                  <span className="font-semibold">AXON</span>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">14 mins ago</span>
              </div>
              <p className="text-secondary-foreground text-xs leading-relaxed">
                MIRA sold 12 shares at $114.20. Volatility below recent average, reaching profit target.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border text-xs text-secondary-foreground flex justify-between bg-card/50">
          <div>Trades today: <span className="text-foreground font-medium tabular-nums">12</span></div>
          <div>P&L today: <span className="text-success font-medium tabular-nums">+$284.10</span></div>
        </div> */}
      </div>
    </section>
  );
};

export default Transact;
