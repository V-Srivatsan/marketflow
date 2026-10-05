import { useState, useEffect } from "react";
import { Play, Square, ShieldAlert, Settings2, Activity } from "lucide-react";
import { makeRequest, showMessage } from "../../lib/utils";

const Control = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isOpen, setMarketStatus] = useState(true);

    useEffect(() => {
        makeRequest("admin/stock", "GET", undefined, true)
            .then((data) => setMarketStatus(data.active))
    }, [])

    const toggleMarket = () => {
        makeRequest("admin/stock", isOpen ? "DELETE" : "POST", undefined, true)
            .then(() => setMarketStatus(!isOpen))
            .catch(err => { console.error(err); showMessage("An error occurred") })
    }

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-[640px] bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 text-center border-b border-border relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 ${isOpen ? 'bg-success' : 'bg-destructive'}`} />

                    <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner ${isOpen ? 'bg-success/10 text-success shadow-success/20' : 'bg-destructive/10 text-destructive shadow-destructive/20'}`}>
                        {isOpen ? <Play className="w-10 h-10 ml-1" /> : <Square className="w-8 h-8" />}
                    </div>

                    <h2 className={`text-3xl font-bold mb-2 ${isOpen ? 'text-success' : 'text-destructive'}`}>
                        Market is {isOpen ? 'OPEN' : 'HALTED'}
                    </h2>
                    <p className="text-secondary-foreground mb-8">
                        {isOpen ? 'Trading is active. MIRA is running.' : 'Trading is paused for all users.'}
                    </p>

                    <button
                        onClick={() => setShowConfirm(true)}
                        className={`w-full max-w-sm mx-auto py-4 rounded-xl font-semibold text-lg transition-all shadow-lg ${isOpen ? 'bg-destructive hover:bg-destructive/90 text-white shadow-destructive/20' : 'bg-success hover:bg-success/90 text-white shadow-success/20'}`}
                    >
                        {isOpen ? 'Stop market' : 'Start market'}
                    </button>
                </div>

                <div className="p-8 bg-background">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">When market is halted:</h3>
                    <ul className="space-y-4">
                        <li className="flex gap-4 items-start">
                            <div className="mt-0.5 bg-secondary text-secondary-foreground p-1.5 rounded"><ShieldAlert className="w-4 h-4" /></div>
                            <div>
                                <div className="font-medium">Trading disabled</div>
                                <div className="text-sm text-secondary-foreground">No buy or sell orders can be placed by any user.</div>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="mt-0.5 bg-secondary text-secondary-foreground p-1.5 rounded"><Activity className="w-4 h-4" /></div>
                            <div>
                                <div className="font-medium">MIRA paused</div>
                                <div className="text-sm text-secondary-foreground">AI agents halt all automated trading and analysis.</div>
                            </div>
                        </li>
                        <li className="flex gap-4 items-start">
                            <div className="mt-0.5 bg-secondary text-secondary-foreground p-1.5 rounded"><Settings2 className="w-4 h-4" /></div>
                            <div>
                                <div className="font-medium">Prices frozen</div>
                                <div className="text-sm text-secondary-foreground">Charts and prices remain visible but stop updating.</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={"fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 " + (showConfirm ? '' : 'hidden')}>
                <div className="bg-popover border border-border rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                    <h3 className="text-xl font-semibold mb-2">
                        {isOpen ? 'Halt the market?' : 'Start the market?'}
                    </h3>
                    <p className="text-secondary-foreground mb-6">
                        {isOpen
                            ? 'Trading will be disabled for everyone and MIRA will pause. Charts stay visible but frozen at the last price.'
                            : 'Trading will resume for all verified users. MIRA agents will restart their activity.'}
                    </p>
                    <div className="flex gap-3 justify-end">
                        <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded-lg font-medium hover:bg-secondary transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={() => { toggleMarket(); setShowConfirm(false); }}
                            className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${isOpen ? 'bg-destructive hover:bg-destructive/90' : 'bg-success hover:bg-success/90'}`}
                        >
                            {isOpen ? 'Halt market' : 'Start market'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Control