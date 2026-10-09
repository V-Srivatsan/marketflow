import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

import type { StockEntry } from "../../../lib/types"
import { makeRequest, showMessage } from "../../../lib/utils"

const PriceShock = ({ uid, stock, data }: { uid: string, stock: string, data: StockEntry[] }) => {

    if (data.length <= 0) return <></>
    
    const price = data.at(-1)!.close
    const [target, setTarget] = useState(price)
    const [candles, setCandles] = useState(5)

    useEffect(() => { setTarget(price) }, [uid])

    const maxShockPrice = price * 1.5
    const minShockPrice = price * 0.5
    
    
    let minClose = target, maxClose = target
    data.forEach(e => {
        minClose = Math.floor(Math.min(minClose, e.close))
        maxClose = Math.floor(Math.max(maxClose, e.close))
    })
    const skew = (y: number) => 50 - Math.floor(50 * (y - minClose) / (maxClose - minClose))
    
    const submitShock = () => {
        makeRequest("admin/events", "POST", { "events": [{ "id": uid, "to": target, "duration": candles }] }, true)
            .then((res) => {
                showMessage(res.message)
            })
    }
    
    const shock = target - price

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background rounded-lg p-4 border border-border">
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Current Price</div>
                            <div className="text-2xl tabular-nums font-medium">${price.toFixed(2)}</div>
                        </div>
                        <div className="relative">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Target Price</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-foreground font-medium">₹</span>
                                <input
                                    type="number" value={target.toFixed(2)}
                                    min={minShockPrice} max={maxShockPrice}
                                    onChange={e => setTarget(parseFloat(e.target.value) || price)}
                                    className="w-full bg-background border border-border focus:ring-primary rounded-lg pl-8 pr-12 py-3 text-lg tabular-nums focus:outline-none focus:ring-1 transition-all"
                                />
                            </div>

                            <div className={`text-sm font-medium mt-2 flex items-center gap-1 ${shock >= 0 ? 'text-success' : 'text-destructive'}`}>
                                {shock >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                {shock >= 0 ? '+' : ''}{(100 * shock / price).toFixed(2)}%
                            </div>

                        </div>
                    </div>


                    <div>
                        <label className="text-sm font-medium mb-2 block">Number of candles</label>
                        <div className="flex items-center gap-3">
                            <button
                                disabled={candles - 5 <= 0}
                                onClick={() => setCandles(candles - 5)}
                                className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-secondary"
                            >-</button>
                            <input
                                type="number" min={1} max={200}
                                value={candles}
                                onChange={e => setCandles(Math.max(1, Math.min(200, parseInt(e.target.value) ?? 1)))}
                                className="w-24 bg-background border border-border rounded-lg text-center py-2 tabular-nums font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <button
                                disabled={candles + 5 > 200}
                                onClick={() => setCandles(Math.min(200, candles + 5))}
                                className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-secondary"
                            >+</button>

                        </div>

                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                            <div className="text-sm flex-1">
                                <span className="font-semibold">{stock}</span> will move from <span className="tabular-nums font-semibold">₹{price.toFixed(2)}</span> to <span className="tabular-nums font-semibold text-primary">₹{target.toFixed(2)}</span> over <span className="font-semibold">{candles} candles</span>.
                            </div>
                            <div className="flex-1">
                                <button
                                    disabled={Math.abs(shock / price) < 0.01 || Math.abs(shock / price) > 1 || target < minShockPrice || target > maxShockPrice}
                                    onClick={submitShock}
                                    className="float-right px-6 py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-lg shadow-primary/20 transition-all"
                                >
                                    Apply Price Shock
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex-1 bg-background border border-border rounded-xl p-4 flex flex-col">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Preview</div>
                    <div className="flex-1 min-h-[120px] relative flex items-center">
                        {/* Mock minimal SVG chart representation for Shock */}
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                            <path d={`M 4,${skew(data[0].close)} Q ${data.map((e, idx) => (idx+1)*4 + "," + skew(e.close)).join(' ')}`} fill="none" stroke="#5F6778" strokeWidth="0.5" />
                            <path d={`M 80,${skew(data.at(-1)!.close)} L 95,${skew(target)}`} fill="none" stroke="#7C5CFF" strokeWidth="1" strokeDasharray="4 2" />
                            <circle cx="80" cy={skew(data.at(-1)?.close ?? 0)} r="2" fill="#F2F4F8" />
                            <circle cx="95" cy={skew(target)} r="2.5" fill="#7C5CFF" />
                        </svg>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default PriceShock