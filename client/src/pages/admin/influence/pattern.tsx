import { useState } from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { makeRequest, showMessage } from "../../../lib/utils"

const PatternInjection = ({ uid }: { uid: string }) => {

    const [selectedPattern, setSelectedPattern] = useState("bullish_flag")

    const patterns = [
        { name: "Bullish Flag", id: 'bullish_flag', type: "Bullish", path: () => <path d="M0,25 L20,5 L35,15 L50,10 L65,20 L80,15 L100,0" fill="none" stroke={selectedPattern === "bullish_flag" ? "#7C5CFF" : "#9AA3B5"} strokeWidth="1.5" strokeLinejoin="round" /> },
        { name: "Bearish Flag", id: 'bearish_flag', type: "Bearish", path: () => <path d="M0,5 L20,25 L35,15 L50,20 L65,10 L80,15 L100,30" fill="none" stroke={selectedPattern === "bearish_flag" ? "#7C5CFF" : "#9AA3B5"} strokeWidth="1.5" strokeLinejoin="round" /> },
        { name: "Bullish Pennant", id: 'bullish_pennant', type: "Bullish", path: () => <path d="M0,25 L25,5 L40,20 L55,10 L70,15 L100,0" fill="none" stroke={selectedPattern === "bullish_pennant" ? "#7C5CFF" : "#9AA3B5"} strokeWidth="1.5" strokeLinejoin="round" /> },
        { name: "Bearish Pennant", id: 'bearish_pennant', type: "Bearish", path: () => <path d="M0,5 L25,25 L40,10 L55,20 L70,15 L100,30" fill="none" stroke={selectedPattern === "bearish_pennant" ? "#7C5CFF" : "#9AA3B5"} strokeWidth="1.5" strokeLinejoin="round" /> },
        { name: "Double Top", id: 'double_top', type: "Bearish", path: () => <path d="M0,25 L20,15 L35,5 L50,15 L65,5 L80,15 L100,25" fill="none" stroke={selectedPattern === "double_top" ? "#7C5CFF" : "#9AA3B5"} strokeWidth="1.5" strokeLinejoin="round" /> },
        { name: "Double Bottom", id: 'double_bottom', type: "Bullish", path: () => <path d="M0,5 L20,15 L35,25 L50,15 L65,25 L80,15 L100,5" fill="none" stroke={selectedPattern === "double_bottom" ? "#7C5CFF" : "#9AA3B5"} strokeWidth="1.5" strokeLinejoin="round" /> },
        { name: "Head and Shoulders", id: 'head_and_shoulders', type: "Bearish", path: () => <path d="M0,25 L20,10 L35,20 L50,2 L65,20 L80,10 L100,25" fill="none" stroke={selectedPattern === "head_and_shoulders" ? "#7C5CFF" : "#9AA3B5"} strokeWidth="1.5" strokeLinejoin="round" /> },
        { name: "Inverse Head and Shoulders", id: 'inverse_head_and_shoulders', type: "Bullish", path: () => <path d="M0,5 L20,20 L35,10 L50,28 L65,10 L80,20 L100,5" fill="none" stroke={selectedPattern === "inverse_head_and_shoulders" ? "#7C5CFF" : "#9AA3B5"} strokeWidth="1.5" strokeLinejoin="round" /> },
        { name: "Rising Wedge", id: 'rising_wedge', type: "Bearish", path: () => <path d="M0,25 L20,5 L35,12 L50,6 L65,11 L80,8 L100,25" fill="none" stroke={selectedPattern === "rising_wedge" ? "#7C5CFF" : "#9AA3B5"} strokeWidth="1.5" strokeLinejoin="round" /> },
        { name: "Falling Wedge", id: 'falling_wedge', type: "Bullish", path: () => <path d="M0,5 L20,25 L35,18 L50,24 L65,19 L80,22 L100,5" fill="none" stroke={selectedPattern === "falling_wedge" ? "#7C5CFF" : "#9AA3B5"} strokeWidth="1.5" strokeLinejoin="round" /> },
        { name: "Rectangle", id: 'rectangle', type: "Neutral", path: () => <path d="M0,15 L15,5 L35,25 L55,5 L75,25 L100,15" fill="none" stroke={selectedPattern === "rectangle" ? "#7C5CFF" : "#9AA3B5"} strokeWidth="1.5" strokeLinejoin="round" /> },
        { name: "Cup and Handle", id: 'cup_and_handle', type: "Bullish", path: () => <path d="M0,15 L10,5 Q 40,35 70,5 L80,12 L100,0" fill="none" stroke={selectedPattern === "cup_and_handle" ? "#7C5CFF" : "#9AA3B5"} strokeWidth="1.5" strokeLinejoin="round" /> },
        { name: "Inverted Cup and Handle", id: 'inverted_cup_and_handle', type: "Bearish", path: () => <path d="M0,15 L10,25 Q 40,-5 70,25 L80,18 L100,30" fill="none" stroke={selectedPattern === "inverted_cup_and_handle" ? "#7C5CFF" : "#9AA3B5"} strokeWidth="1.5" strokeLinejoin="round" /> },
    ]

    const inject_pattern = () => {
        makeRequest(
            "admin/patterns", "POST",
            { "events": [{ "id": uid, "pattern": selectedPattern }] },
            true
        ).then(data => { showMessage(data.message) })
    }

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-medium">Pattern picker</h1>
                <button
                    onClick={inject_pattern}
                    className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg shadow-lg shadow-primary/20 transition-all"
                >
                    Inject Pattern
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-2 pb-2">
                {patterns.map(p => (
                    <button
                        key={p.id}
                        onClick={() => setSelectedPattern(p.id)}
                        className={`text-left p-3 rounded-xl border transition-all ${selectedPattern === p.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background hover:border-secondary-foreground'}`}
                    >
                        <div className="h-10 mb-2 w-full flex items-center opacity-60">

                            <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                                {p.path()}
                            </svg>
                        </div>
                        <div className="text-sm font-semibold truncate">{p.name}</div>
                        <div className={`text-[10px] mt-1 inline-flex items-center gap-1 font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-sm ${p.type === 'Bullish' ? 'bg-success/10 text-success' :
                            p.type === 'Bearish' ? 'bg-destructive/10 text-destructive' :
                                'bg-secondary text-secondary-foreground'
                            }`}>
                            {p.type === 'Bullish' && <TrendingUp className="w-3 h-3" />}
                            {p.type === 'Bearish' && <TrendingDown className="w-3 h-3" />}
                            {p.type === 'Neutral' && <Minus className="w-3 h-3" />}
                            {p.type}
                        </div>
                    </button>
                ))}
            </div>
        </div >
    )
}

export default PatternInjection