import { useState } from "react"

import LoginForm from "./login"
import Control from "./control"
import News from "./news"
import Users from "./users"
import Influence from "./influence/influence"

const AdminPage = () => {
    const [logged, setLogged] = useState(false)
    const [activeTab, setActiveTab] = useState<'control' | 'users' | 'influence'>('control')

    return (!logged ?
        <main className="flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
            <div className="h-full text-center px-20 py-5">
                <h1 className="text-white text-5xl font-semibold leading-tight">Marketflow Admin</h1>
            </div>

            <div className="w-full max-w-[440px] bg-card border border-border rounded-xl p-6 z-10 shadow-2xl">
                <LoginForm onLogin={() => setLogged(true)} />
            </div>
        </main> :

        <main className="flex-1 flex flex-col overflow-hidden bg-background">

            <header className="fixed top-0 left-0 right-0 h-14 border-b border-border px-4 md:px-28 bg-background z-50">
                <div className="flex justify-between items-center gap-8">
                    <div className="font-semibold text-lg flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            MarketFlow
                        </div>
                        <div className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold tracking-wide">
                            ADMIN
                        </div>
                    </div>
                    <nav className="flex items-center gap-6 text-sm text-secondary-foreground">
                        <button
                            onClick={() => setActiveTab('control')}
                            className={`pb-4 pt-4 border-b-2 font-medium transition-colors ${activeTab === 'control' ? 'border-primary text-foreground' : 'border-transparent hover:text-foreground'}`}
                        >
                            Market Control
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`pb-4 pt-4 border-b-2 font-medium transition-colors ${activeTab === 'users' ? 'border-primary text-foreground' : 'border-transparent hover:text-foreground'}`}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('influence')}
                            className={`pb-4 pt-4 border-b-2 font-medium transition-colors ${activeTab === 'influence' ? 'border-primary text-foreground' : 'border-transparent hover:text-foreground'}`}
                        >
                            Influence
                        </button>
                    </nav>
                </div>
            </header>

            {/* ADMIN CONTENT */}
            <div className="flex-1 overflow-y-auto p-8 relative">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px] pointer-events-none" />
                <div className="max-w-6xl mx-auto relative z-10">
                    {
                        activeTab === 'users' ? <Users /> :
                        activeTab === 'control' ?
                            <div className="flex flex-col lg:flex-row gap-5">
                                <div className="flex-1"><Control /></div>
                                <div className="flex-1 my-auto"><News /></div>
                            </div> :
                            <Influence />
                    }
                </div>
            </div>
        </main>
    )
}

export default AdminPage