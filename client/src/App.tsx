import { useEffect } from 'react'
import { useAuthStore, useUserStore } from './lib/store'
import { makeRequest } from './lib/utils'
import { NavLink, BrowserRouter, Routes, Route, useLocation } from 'react-router'
import { SERVER_HOST, PROD, showMessage } from './lib/utils'

import Stock from './pages/stock/page'
// import Portfolio from './pages/portfolio/page'
import HomePage from './pages/auth/page'
import TransactionPage from './pages/transactions/page'
import Leaderboard from './pages/leaderboard/page'


const ProtectedRoute = ({ elem }: { elem: React.ReactNode }) => {
	const logged = useAuthStore(state => state.logged)

	return (logged ? elem :
		<div className='text-white mt-[6rem] px-10'>
			You are not logged in. Please <NavLink className="underline" to="/">login</NavLink> to continue.
		</div>
	)
}


const App = () => {
	const login = useAuthStore(state => state.setLogged)
	const profile = useUserStore(state => state.update)

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			login(true)
			makeRequest('user', 'GET', undefined, true)
				.then(res => profile(res["balance"], res["owned"]))

		}

		const socket = new WebSocket(`${PROD ? 'wss' : 'ws'}://${SERVER_HOST}/news/`)
		socket.onmessage = (ev: MessageEvent) => showMessage(JSON.parse(ev.data).message)
		socket.onclose = () => { if (socket.readyState === WebSocket.CLOSED) alert("Connection interrupted! Please refresh!") }

		return () => { if (socket.readyState === WebSocket.OPEN) socket.close() }
	}, [login, profile])

	return (
		<>
			<div id="toast" className="text-white py-3 px-5 fixed transition right-[25px] w-[300px] rounded z-[99999]"></div>

			<BrowserRouter>
				<Navbar />

				<Routes>
					<Route path="/stocks" element={<ProtectedRoute elem={<Stock />} />} />
					{/* <Route path="/portfolio" element={<Portfolio />} /> */}
					<Route path="/transactions" element={<ProtectedRoute elem={<TransactionPage />} />} />
					<Route path="/leaderboard" element={<Leaderboard />} />
					<Route path="/" element={<HomePage />} />
				</Routes>
			</BrowserRouter>
		</>
	)
}

const Navbar = () => {
	const logged = useAuthStore(state => state.logged)
	const loc = useLocation()

	return (
		<header className="h-14 border-b border-border flex items-center px-4 md:px-28 justify-between shrink-0 bg-background z-40 fixed top-0 left-0 right-0">
			<div className="flex items-center gap-8">
				<div className="font-semibold text-2xl flex items-center gap-2">
					<NavLink to='/'>Marketflow</NavLink>
				</div>
			</div>

			<div className="flex items-center gap-4 text-sm">
				{!logged ? <></> : 
					<>	
						<NavLink
							to='/stocks'
							className={`pb-4 pt-4 border-b-2 font-medium transition-colors ${loc.pathname === '/stocks' ? 'border-primary text-foreground' : 'border-transparent hover:text-foreground'}`}
						>Trade</NavLink>
						<NavLink
							to='/transactions'
							className={`pb-4 pt-4 border-b-2 font-medium transition-colors ${loc.pathname === '/transactions' ? 'border-primary text-foreground' : 'border-transparent hover:text-foreground'}`}
						>Transactions</NavLink>
						<button onClick={() => {
							localStorage.removeItem('token')
							window.location.href = '/'
						}} className="pb-4 pt-4 border-b-2 font-medium transition-colors border-transparent hover:text-foreground">
							Logout
						</button>
					</>
				}
			</div>
		</header>
	)
}

export default App
