import { useState } from "react"
import { Link } from "react-router-dom"
import Login from "./pages/login"
import Signup from "./pages/signup"

export default function Navbar({
    user = null,
    cartCount = 0,
    currrentView = 'home',
    onNavigate = () => {},
    onOpenCart = () => {},
    onOpenAuth = () => {},
    onLogout = () => {},
    
}) {
    
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const handleNavClick = (view) => {
        onNavigate(view);
        setMobileMenuOpen(false);
    };
    
    const [activeTab, setActiveTab] = useState('login')

    return(
        <>
            <header className="py-4 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md top-0 z-40 text-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <button
                    type='button'
                    onClick={() => handleNavClick('home')}
                    className="flex items-center gap-2.5 text-left group focus:outline-none"
                    >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 t0-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition">
                           <i className="fa-solid fa-utensils text-white"></i> 
                        </div>
                        <div>
                            <span className="text-xl font-extrabold tracking-tight text-white">
                                Crave<span className="text-sky-400">Dash</span>
                            </span>
                        </div>
                    </button>
                    
                    <button
                    type='button'
                    onClick={() => setMobileMenuOpen(true)}
                    className="hover:scale-105 transition duration-300 flex items-center justify-center"
                    >
                        <i 
                    className="fa-solid fa-bars text-2xl text-sky-500"
                    ></i>
                    </button>
                        
                    
                </div>
            </div>
                
                {mobileMenuOpen && (
                    <div className="bg-black absolute w-40 text-slate-400 px-3 py-2 right-2 border-l-2 border-sky-400/80">
                        <ul className="space-y-3">
                            <li>
                                <button
                                type='button'
                                onClick={() => setActiveTab('login')}
                                className={`uppercase px-3 py-2 rounded-xl w-full border border-slate-400 font-semibold hover:scale-105 ${activeTab === 'login' ? 'bg-sky-400 text-slate-700' : ''} transition duration-300`}
                                >
                                    Log In
                                </button>
                            </li>
                            <li>
                                <button
                                type='button'
                                onClick={() => setActiveTab('signup')}
                                className={`uppercase px-3 py-2 rounded-xl w-full border border-slate-400 font-semibold hover:scale-105 ${activeTab === 'signup' ? 'bg-sky-400 text-slate-700' : ''} transition duration-300`}
                                >
                                    Register
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </header>
        </>
    )
}