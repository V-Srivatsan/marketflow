import { useEffect, useMemo, useState } from "react"
import type { Transaction } from "../../types"
import { getBuyPrice, getSellPrice, makeRequest } from "../../lib/utils"

const formatCurrency = (v: number) =>
  v.toLocaleString("en-IN", { style: "currency", currency: "INR" })

type Filter = "ALL" | "BUY" | "SELL"

const TransactionPage = () => {
  const [rows, setRows] = useState<Transaction[]>([]) 
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>("ALL")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const run = async () => {
      try {
        const data = (await makeRequest('transact', 'GET', undefined, true))["transactions"] as Transaction[]
        setRows(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const filtered = useMemo(
    () =>
      rows.filter(t => {
        if (filter === "ALL") return true
        if (filter === "BUY") return t.units > 0  
        return t.units < 0  
      }),
    [rows, filter]
  )

  const totals = useMemo(() => {
    let totalBought = 0
    let totalSold = 0
    filtered.forEach(t => {  
      if (t.units > 0) totalBought += getBuyPrice(t.price, t.units) 
      else totalSold += getSellPrice(t.price, Math.abs(t.units))
    })
    return {
      count: filtered.length,
      totalBought,
      totalSold,
    }
  }, [filtered])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#060739] text-white px-10 py-10">
        <h1 className="text-3xl font-semibold">Transaction History</h1>
        <p className="mt-6 text-slate-300">Loading transactions...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen text-white px-10 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Transaction History</h1>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center justify-between w-48 bg-[#1a1f35] border border-white/10 px-4 py-2 text-sm text-white hover:bg-[#222857] transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
              </svg>
              <span>
                {filter === "ALL" ? "All Transactions" : filter === "BUY" ? "Buy Only" : "Sell Only"}
              </span>
            </div>
            <svg
              className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-none bg-[#1a1f35] border border-white/10 shadow-xl overflow-hidden text-sm z-30">
              {[
                { label: "All Transactions", value: "ALL" },
                { label: "Buy Only", value: "BUY" },
                { label: "Sell Only", value: "SELL" },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilter(option.value as Filter)
                    setDropdownOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    filter === option.value ? "bg-[#4a4a5a] text-white" : "text-[#c0c0c0] hover:bg-white/5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-5 shadow-lg">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Total Transactions
          </p>
          <p className="mt-4 text-4xl font-semibold text-white">
            {totals.count}
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-emerald-400/30 bg-emerald-400/5 backdrop-blur-xl px-6 py-5 shadow-lg">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Total Bought
          </p>
          <p className="mt-4 text-4xl font-semibold text-emerald-400">
            {formatCurrency(totals.totalBought)}
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-sky-400/30 bg-sky-400/5 backdrop-blur-xl px-6 py-5 shadow-lg">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Total Sold
          </p>
          <p className="mt-4 text-4xl font-semibold text-sky-400">
            {formatCurrency(totals.totalSold)}
          </p>
        </div>
      </section>

      <div className="rounded-2xl border border-white/10 bg-[#050631] backdrop-blur-xl shadow-xl overflow-x-auto">
        <div className="min-w-max flex items-center gap-8 px-8 py-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.18em] bg-[#0a0d20]">
          <span className="flex-[2] min-w-[120px]">Name</span>
          <span className="flex-1 min-w-[80px]">Type</span>
          <span className="flex-1 text-right min-w-[80px]">Quantity</span>
          <span className="flex-1 text-right min-w-[80px]">Price</span>
          <span className="flex-1 text-right min-w-[80px]">Total</span>
        </div>

        <div className="divide-y divide-white/5 min-w-max">
          {filtered.map((t, idx) => {
            const quantity = Math.abs(t.units) 
            const isBuy = t.units > 0  
            const total = isBuy ? getBuyPrice(t.price, quantity) : getSellPrice(t.price, quantity)

            return (
              <div
                key={idx}
                className="flex items-center gap-8 px-8 py-5 hover:bg-white/5 transition-colors"
              >
                <div className="flex-[2] min-w-[120px] text-sm font-semibold text-slate-50">
                  {t.stock}
                </div>

                <div className="flex-1 min-w-[80px] flex">
                  <span
                    className={`min-w-[70px] text-center px-4 py-1.5 rounded-full text-xs font-semibold ${
                      isBuy
                        ? "bg-emerald-500/25 text-emerald-200 border border-emerald-400/60"
                        : "bg-sky-500/25 text-sky-200 border border-sky-400/60"
                    }`}
                  >
                    {isBuy ? "Buy" : "Sell"}
                  </span>
                </div>

                <div className="flex-1 min-w-[80px] text-sm text-right text-slate-100">
                  {quantity}
                </div>

                <div className="flex-1 min-w-[80px] text-sm text-right text-slate-100">
                  {formatCurrency(t.price)}
                </div>

                <div className="flex-1 min-w-[80px] text-sm text-right font-semibold text-slate-50">
                  {formatCurrency(total)}
                </div>
              </div>
            )
          })}

          <div className="flex items-center gap-8 px-8 py-4 bg-white/5 border-t border-white/10">
            <div className="flex-[2] min-w-[120px] text-xs font-semibold tracking-[0.18em] uppercase text-slate-300">
              Totals
            </div>

            <div className="flex-1 min-w-[80px]" />
            <div className="flex-1 min-w-[80px]" />

            <div className="flex-1 min-w-[80px] text-right text-xs font-semibold text-slate-300">
              Bought / Sold
            </div>

            <div className="flex-1 min-w-[80px] text-right text-sm font-semibold text-slate-50 whitespace-nowrap">
              {formatCurrency(totals.totalBought)} /{" "}
              {formatCurrency(totals.totalSold)}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default TransactionPage
