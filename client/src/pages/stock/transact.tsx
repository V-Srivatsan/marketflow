import { useState, useEffect } from "react";
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

  const transact = async (num_units?: number) => {
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
        showMessage(res.detail.message, true);
      } else {
        showMessage(res.message);
        userStore.update(res.balance, {
          ...userStore.stocks,
          [stockId]: {
            quantity: (userStore.stocks[stockId]?.quantity ?? 0) + num_stocks,
            avg_price: res.avg_price
          }
        });
      }
    } catch {
      showMessage("Transaction failed", true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex shrink-0 border-l border-border bg-background relative z-10 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.3)]">
      <div className="w-[340px] flex flex-col border-r border-border bg-card/30">
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
                  onClick={() => setUnits(units-1)}
                  className="w-6 h-6 rounded bg-background border border-border flex items-center justify-center hover:bg-secondary">-</button>
                <span className="tabular-nums font-medium w-8 text-center">{units}</span>
                <button
                  disabled={units == 100}
                  onClick={() => setUnits(units+1)}
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
            disabled={loading || (
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
    </div>
  );
};

export default Transact;
