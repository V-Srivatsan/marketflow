import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

const Holding = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#050827] to-[#0b1230] text-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-start justify-between mb-8">
                    <h1 className="text-4xl font-bold mt-8 mb-4">Portfolio Holdings</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#0f1530]/60 backdrop-blur rounded-xl p-6">
                        <div className="text-sm text-slate-400">Total Portfolio Value</div>
                        <div className="mt-4 text-3xl font-medium">$38,819.50</div>
                    </div>

                    <div className="bg-[#0f1530]/60 backdrop-blur rounded-xl p-6">
                        <div className="text-sm text-slate-400">Unrealized P/L</div>
                        <div className="mt-4 text-2xl font-semibold text-emerald-400 flex items-center gap-2">
                            +$1,252.00 <span className="text-emerald-300"><TrendingUp /></span>
                        </div>
                    </div>

                    <div className="bg-[#0f1530]/60 backdrop-blur rounded-xl p-6">
                        <div className="text-sm text-slate-400">Total Positions</div>
                        <div className="mt-4 text-2xl font-medium">5</div>
                        <div className="mt-2 text-sm">
                            <span className="text-emerald-400">4 Long</span>
                            <span className="mx-2 text-slate-500">|</span>
                            <span className="text-rose-400">1 Short</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0c1230]/60 border border-[#23263a] rounded-2xl overflow-x-auto">
                    <table className="w-full table-fixed">
                        <thead className="bg-[#0d1328]/70">
                            <tr className="text-xs text-slate-400 uppercase">
                                <th className="py-4 px-6 text-left">Symbol</th>
                                <th className="py-4 px-6 text-left">Type</th>
                                <th className="py-4 px-6 text-center">Quantity</th>
                                <th className="py-4 px-6 text-right">Avg Price</th>
                                <th className="py-4 px-6 text-right">Current Price</th>
                                <th className="py-4 px-6 text-right">Market Value</th>
                                <th className="py-4 px-6 text-right pr-8">P/L</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-[#1b2136] hover:bg-[#0d1328]/40 transition">
                                <td className="px-6 py-5 align-middle">
                                    <div className="font-semibold">AAPL</div>
                                    <div className="text-xs text-slate-400 mt-1">Apple Inc.</div>
                                </td>
                                <td className="px-6 py-5 align-middle">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-800/40 text-emerald-300 gap-1"><ArrowUp width={14}/> Long</span>
                                </td>
                                <td className="px-6 py-5 text-center align-middle">50</td>
                                <td className="px-6 py-5 text-right align-middle">$175.20</td>
                                <td className="px-6 py-5 text-right align-middle">$182.50</td>
                                <td className="px-6 py-5 text-right align-middle">$9,125.00</td>
                                <td className="px-6 py-5 text-right align-middle pr-8">
                                    <div className="font-medium text-emerald-300">+$365.00</div>
                                    <div className="text-xs mt-1 text-emerald-200">(+4.17%)</div>
                                </td>
                            </tr>

                            <tr className="border-t border-[#1b2136] hover:bg-[#0d1328]/40 transition">
                                <td className="px-6 py-5 align-middle">
                                    <div className="font-semibold">GOOGL</div>
                                    <div className="text-xs text-slate-400 mt-1">Alphabet Inc.</div>
                                </td>
                                <td className="px-6 py-5 align-middle">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-800/40 text-emerald-300 gap-1"><ArrowUp width={14}/> Long</span>
                                </td>
                                <td className="px-6 py-5 text-center align-middle">25</td>
                                <td className="px-6 py-5 text-right align-middle">$142.30</td>
                                <td className="px-6 py-5 text-right align-middle">$138.90</td>
                                <td className="px-6 py-5 text-right align-middle">$3,472.50</td>
                                <td className="px-6 py-5 text-right align-middle pr-8">
                                    <div className="font-medium text-rose-300">-$85.00</div>
                                    <div className="text-xs mt-1 text-rose-200">(-2.39%)</div>
                                </td>
                            </tr>

                            <tr className="border-t border-[#1b2136] hover:bg-[#0d1328]/40 transition">
                                <td className="px-6 py-5 align-middle">
                                    <div className="font-semibold">TSLA</div>
                                    <div className="text-xs text-slate-400 mt-1">Tesla Inc.</div>
                                </td>
                                <td className="px-6 py-5 align-middle">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-800/40 text-red-300 gap-1"><ArrowDown width={14}/> Long</span>
                                </td>
                                <td className="px-6 py-5 text-center align-middle">30</td>
                                <td className="px-6 py-5 text-right align-middle">$245.80</td>
                                <td className="px-6 py-5 text-right align-middle">$238.20</td>
                                <td className="px-6 py-5 text-right align-middle">$7,146.00</td>
                                <td className="px-6 py-5 text-right align-middle pr-8">
                                    <div className="font-medium text-emerald-300">+$228.00</div>
                                    <div className="text-xs mt-1 text-emerald-200">(+3.09%)</div>
                                </td>
                            </tr>

                            <tr className="border-t border-[#1b2136] hover:bg-[#0d1328]/40 transition">
                                <td className="px-6 py-5 align-middle">
                                    <div className="font-semibold">MSFT</div>
                                    <div className="text-xs text-slate-400 mt-1">Microsoft Corp.</div>
                                </td>
                                <td className="px-6 py-5 align-middle">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-800/40 text-emerald-300 gap-1"><ArrowUp width={14}/> Long</span>
                                </td>
                                <td className="px-6 py-5 text-center align-middle">40</td>
                                <td className="px-6 py-5 text-right align-middle">$380.50</td>
                                <td className="px-6 py-5 text-right align-middle">$395.75</td>
                                <td className="px-6 py-5 text-right align-middle">$15,830.00</td>
                                <td className="px-6 py-5 text-right align-middle pr-8">
                                    <div className="font-medium text-emerald-300">+$610.00</div>
                                    <div className="text-xs mt-1 text-emerald-200">(+4.01%)</div>
                                </td>
                            </tr>

                            <tr className="border-t border-[#1b2136] hover:bg-[#0d1328]/40 transition">
                                <td className="px-6 py-5 align-middle">
                                    <div className="font-semibold">AMZN</div>
                                    <div className="text-xs text-slate-400 mt-1">Amazon.com Inc.</div>
                                </td>
                                <td className="px-6 py-5 align-middle">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-800/40 text-emerald-300 gap-1"><ArrowUp width={14}/> Long</span>
                                </td>
                                <td className="px-6 py-5 text-center align-middle">20</td>
                                <td className="px-6 py-5 text-right align-middle">$155.60</td>
                                <td className="px-6 py-5 text-right align-middle">$162.30</td>
                                <td className="px-6 py-5 text-right align-middle">$3,246.00</td>
                                <td className="px-6 py-5 text-right align-middle pr-8">
                                    <div className="font-medium text-emerald-300">+$134.00</div>
                                    <div className="text-xs mt-1 text-emerald-200">(+4.31%)</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Holding