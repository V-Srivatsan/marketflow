import Graph from "./graph/graph";
import type { Stock as StockType, StockEntry } from "../../lib/types";
import { useUserStore } from "../../lib/store";

type StockProps = {
  stocks: Record<string, StockType>;
  entries: Record<string, StockEntry[]>;
  curr: string;
}

const Stock = ({ stocks, entries, curr }: StockProps) => {
  const data: StockEntry[] = entries[curr] ?? [];
  const last = data.length - 1;

  const owned = useUserStore(state => state.stocks[curr]) ?? { quantity: 0, avg_price: 0 };

  const price = last >= 0 ? data[last].close : 0;
  const prevClose = last > 0 ? data[last - 1].close : price;

  const candleChange = price - prevClose;
  const candlePct = prevClose ? (candleChange / prevClose) * 100 : 0;

  return (
    <section className="flex-1 flex flex-col min-w-0 bg-card/50 relative z-0">

      <div className="p-6 border-b border-border relative">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-3 mb-1">
              <h2 className="text-4xl font-semibold">{stocks[curr].name}</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl tabular-nums font-medium">₹{price.toFixed(2)}</span>
              <span className={`text-lg tabular-nums ${candleChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {candleChange >= 0 ? '+' : ''}{(price * (candleChange / 100)).toFixed(2)} ({candleChange >= 0 ? '+' : ''}{candlePct.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4 bg-background grid grid-cols-5 gap-4 text-sm relative z-10">
        <div><div className="text-muted-foreground mb-1">Open</div><div className="tabular-nums font-medium">₹{(data[last].open).toFixed(2)}</div></div>
        <div><div className="text-muted-foreground mb-1">High</div><div className="tabular-nums font-medium">₹{(data[last].high).toFixed(2)}</div></div>
        <div><div className="text-muted-foreground mb-1">Low</div><div className="tabular-nums font-medium">₹{(data[last].low).toFixed(2)}</div></div>
        <div><div className="text-muted-foreground mb-1">Prev Close</div><div className="tabular-nums font-medium">₹{(last < 1 ? 0 : data[last-1].close).toFixed(2)}</div></div>
        <div><div className="text-muted-foreground mb-1">Your Position</div><div className="tabular-nums font-medium">{owned.quantity} shares</div></div>
      </div>

      <div className="flex-1 p-6 relative min-h-[300px]">
        <Graph data={data} curr={curr} indicatorData={null} />
      </div>
    </section>
  );
};

export default Stock;
