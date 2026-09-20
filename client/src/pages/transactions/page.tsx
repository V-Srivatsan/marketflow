import { useEffect, useState } from "react"
import type { Transaction } from "../../lib/types"
import { getBuyPrice, getSellPrice, makeRequest } from "../../lib/utils"

const formatCurrency = (v: number) =>
  v.toLocaleString("en-IN", { style: "currency", currency: "INR" })

const dateFormatter = Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true    
})

type UserType = {
  portfolio: number
  balance: number
  pnl: number
}

const TransactionPage = () => {
  const [user, setUser] = useState<UserType | null>(null)
  const [rows, setRows] = useState<Transaction[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const run = async () => {
      try {
        const res = await makeRequest('transact', 'GET', undefined, true)
        const data = res["transactions"] as Transaction[]
        setUser(res["user"])
        setRows(data)
      } catch (e) {
        console.error(e)
      }
    }
    run()
  }, [])

  const filtered = rows.filter(row => row.stock.toLowerCase().includes(search.toLowerCase()))

  return (
    <main className="flex-1 bg-background p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="text-sm text-secondary-foreground mb-1">Portfolio Value</div>
            <div className="text-2xl font-semibold tabular-nums">{formatCurrency(user?.portfolio ?? 0)}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="text-sm text-secondary-foreground mb-1">Cash Available</div>
            <div className="text-2xl font-semibold tabular-nums">{formatCurrency(user?.balance ?? 0)}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="text-sm text-secondary-foreground mb-1">Investment Value</div>
            <div className="text-2xl font-semibold tabular-nums">{formatCurrency(user === null ? 0 : user.portfolio - user.balance)}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="text-sm text-secondary-foreground mb-1">Total P&L</div>
            <div className={"text-2xl font-semibold tabular-nums " + ((user?.pnl ?? 0) >= 0 ? 'text-success' : 'text-destructive')}>{user === null ? 0 : user.pnl >= 0 ? '+' : ''}{formatCurrency(user?.pnl ?? 0)}</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="ms-auto relative">
              <input 
                type="text" onChange={(e) => setSearch(e.currentTarget.value)}
                placeholder="Search Stock" 
                className="bg-background border border-border rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:border-primary w-[200px]"
              />
            </div>
          </div>
          
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-secondary-foreground">
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium text-right">Quantity</th>
                <th className="p-4 font-medium text-right">Price</th>
                <th className="p-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {filtered.map((row, idx) => 
                <tr key={idx} className="border-b border-border/50 bg-primary/5 hover:bg-primary/10 transition-colors">
                  <td className="p-4 text-secondary-foreground">{dateFormatter.format(Date.parse(row.timestamp))}</td>
                  <td className="p-4 font-semibold text-foreground">{row.stock}</td>
                  <td className="p-4">
                    {row.units > 0 ? 
                      <span className="px-2 py-1 bg-success/10 text-success rounded text-xs font-bold">BUY</span> :
                      <span className="px-2 py-1 bg-destructive/10 text-destructive rounded text-xs font-bold">SELL</span>
                    }
                  </td>
                  <td className="p-4 text-right">{Math.abs(row.units)}</td>
                  <td className="p-4 text-right">{formatCurrency(row.price)}</td>
                  <td className="p-4 text-right">{formatCurrency((row.units > 0 ? getBuyPrice : getSellPrice)(row.price, Math.abs(row.units)))}</td>  
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

export default TransactionPage
