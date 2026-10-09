import { useEffect, useState } from "react";
import type { StockEntry } from "../../../lib/types";
import { makeRequest, PROD, SERVER_HOST } from "../../../lib/utils";

import { ChevronDown } from "lucide-react";
import PriceShock from "./shock";
import PatternInjection from "./pattern";

const Influence = () => {

    const [stockSelect, setStockSelect] = useState(false)

    const [stocks, setStocks] = useState<Record<string, { name: string, entries: StockEntry[] }>>({})
    const [selectedStock, setSelectedStock] = useState("")

    useEffect(() => {
        makeRequest('stocks/', 'GET').then((data) => {
            const st: Record<string, { name: string, entries: StockEntry[] }> = {}
            Object.entries(data).forEach(([key, value]) => (
                st[key] = {
                    name: (value as { name: string, entries: StockEntry[] }).name,
                    entries: (value as { name: string, entries: StockEntry[] }).entries
                }
            ))

            setStocks(st)
            setSelectedStock(Object.keys(st)[0])
        })

        const socket = new WebSocket(`${PROD ? 'wss' : 'ws'}://${SERVER_HOST}/stocks/`);

        socket.onmessage = (ev) => {
            const update: Record<string, StockEntry> = JSON.parse(ev.data);

            setStocks((prev) => {
                if (!prev) return prev;
                const res = structuredClone(prev);

                Object.keys(update).forEach((id) => {
                    if (!res[id]) return;
                    const last = res[id].entries.length - 1;
                    if (res[id].entries[last].time === update[id].time)
                        res[id].entries[last] = update[id];
                    else res[id].entries.push(update[id]);
                });
                return res;
            });
        };

        return () => socket.close()
    }, [])

    const [influenceMode, setInfluenceMode] = useState<"shock" | "inject">("shock")

    return (
        <div className="space-y-6">

            <div className="p-6">
                <h1 className="text-2xl font-semibold">Market Influence</h1>
                <p className="text-sm text-secondary-foreground mt-1">Steer individual stocks. Changes are visible to all traders. Traders are not told when an influence is active.</p>
            </div>

            <div className="w-full bg-card border border-border rounded-2xl shadow-xl transition-all relative">

                <div className="flex-1 p-6 lg:border-r border-border min-h-[500px]">

                    <div className="mb-6 z-10">

                        <div className="flex justify-between gap-8">
                            <div className="flex-1 relative">
                                <button
                                    onClick={() => setStockSelect(!stockSelect)}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-primary transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-lg">{stocks[selectedStock]?.name}</span>
                                        <span className="text-sm tabular-nums font-medium ml-2">₹{stocks[selectedStock]?.entries.at(-1)?.close.toFixed(2)}</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                </button>

                                <div className={`${stockSelect ? '' : 'hidden'} absolute z-10 top-full left-0 w-full mt-1 bg-popover border border-border rounded-lg shadow-2xl overflow-hidden max-h-60 overflow-y-auto`}>
                                    {Object.entries(stocks).map(([key, value]) => {
                                        return (
                                            <button
                                                key={key}
                                                className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-secondary transition-colors border-b border-border/50 last:border-0"
                                                onClick={() => { setStockSelect(false); setSelectedStock(key) }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold">{value.name}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm tabular-nums font-medium">₹{value.entries.at(-1)?.close.toFixed(2)}</span>
                                                </div>
                                            </button>

                                        )
                                    })}
                                </div>
                            </div>

                            <div className="my-auto flex flex-1 bg-background rounded-lg p-1 border border-border w-max">
                                <button
                                    onClick={() => setInfluenceMode('shock')}
                                    className={`flex-1 px-6 py-2 text-sm font-medium rounded-md transition-colors ${influenceMode === 'shock' ? 'bg-primary text-white shadow-sm' : 'text-secondary-foreground hover:text-foreground'}`}
                                >
                                    Price Shock
                                </button>
                                <button
                                    onClick={() => setInfluenceMode('inject')}
                                    className={`flex-1 px-6 py-2 text-sm font-medium rounded-md transition-colors ${influenceMode === 'inject' ? 'bg-primary text-white shadow-sm' : 'text-secondary-foreground hover:text-foreground'}`}
                                >
                                    Pattern Injection
                                </button>
                            </div>
                        </div>
                    </div>

                    {influenceMode === 'shock' ?
                        <PriceShock
                            uid={selectedStock}
                            stock={stocks[selectedStock]?.name ?? ""}
                            data={stocks[selectedStock]?.entries.slice(-20) ?? []} /> :
                        <PatternInjection uid={selectedStock} />
                    }
                </div>
            </div>
        </div>
    )
}

export default Influence