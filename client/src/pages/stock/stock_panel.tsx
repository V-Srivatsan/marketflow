import { useState } from "react";
import type { Stock, StockEntry } from "../../lib/types"; 

type StockPanelProps = {
    stocks: Record<string, Stock>
    entries: Record<string, StockEntry[]>
    curr: string
    setCurr: (v: string) => void
}

const StockPanel = ({ curr, setCurr, stocks, entries }: StockPanelProps) => {

    const [search, setSearch] = useState("")

    return (
        <section className="w-[300px] border-r border-border flex flex-col shrink-0 bg-background relative z-10">
            <div className="p-4 border-b border-border">
                <div className="relative">
                    <input
                        type="text" onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search stocks..."
                        className="w-full bg-card border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {Object.keys(stocks).filter(stock_id =>
                    stocks[stock_id].name.toLowerCase().includes(search.toLowerCase())
                ).map(stock_id => {

                    const stock = stocks[stock_id]
                    const e = entries[stock_id] ?? []

                    const price = e[e.length - 1]?.close ?? 0, prev = e[e.length - 2]?.close ?? 0
                    const change = prev != 0 ? 100 * (price - prev) / prev : 0

                    return (
                        <button
                            key={stock_id}
                            onClick={() => setCurr(stock_id)}
                            className={`w-full text-left px-4 py-3 flex items-center justify-between border-b border-border/50 transition-colors relative ${curr === stock.name ? 'bg-primary/10' : 'hover:bg-card'}`}
                        >
                            {stock_id === curr && (
                                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />
                            )}
                            <div>
                                <div className="font-semibold">{stock.name}</div>
                            </div>
                            <div className="text-right">
                                <div className="tabular-nums font-medium">₹{price.toFixed(2)}</div>
                                <div className={`text-xs tabular-nums px-1.5 py-0.5 rounded-sm inline-block mt-1 ${change >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                                    {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </section>
    )
}

export default StockPanel