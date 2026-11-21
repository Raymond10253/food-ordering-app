import { useState } from "react"
import Login from "./pages/login"
import Signup from "./pages/signup"

export default function Navbar({
    user = null,
    cartCount = 0,
    currrentPage = 'home',
    onNavigate = () => {},
    onOpenCart = () => {},
    onOpenAuth = () => {},
    onLogout = () => {},
    
}) {
    
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const handleNavClick = (page) => {
        onNavigate(page);
        setMobileMenuOpen(false);
    };

    
    

    return(
        <>
            <header className="py-4 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md top-0 z-40 text-slate-100 fixed w-full">
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

                    <nav className="hidden md:flex items-center space-x-2">
                        <button
                        type='button'
                        onClick={() => handleNavClick('home')}
                        className={
        `inline-flex items-center space-x-2 px-3.5 rounded-xl text-sm font-semibold transition ${
            currrentPage === 'home'
            ? 'bg-sky-400/15 text-sky-300 border border-sky-400/30'
            : 'text-slate-300 hover:text-white hover:bg-slate-900'
        }
        `}
                        >
                            <i className="fa-solid fa-house"></i>
                            Menus
                        </button>
                        <button
                        type='button'
                        onClick={() => handleNavClick('orders')}
                        className={`inline-flex items-center space-x-2 px-3.5 rounded-xl text-sm font-semibold transition ${
                            currrentPage === 'orders'
                            ? 'bg-sky-400/15 text-sky-300 border border-sky-400/30'
                            : 'text-slate-300 hover:text-white hover:bg-slate-900'
                        }`}
                        >
                            <i className="fa-solid fa-box"></i>
                            My Orders
                        </button>
                        <button
                        type='button'
                        onClick={() => handleNavClick('checkout')}
                        className={`inline-flex items-center space-x-2 px-3.5 rounded-xl text-sm font-semibold transition ${
                            currrentPage === 'checkout'
                            ? 'bg-sky-400/15 text-sky-300 border border-sky-400/30'
                            : 'text-slate-300 hover:text-white hover:bg-slate-900'
                        }`}
                        >
                            <i className="fa-solid fa-credit-card"></i>
                            Checkout
                        </button>
                    </nav>
                    
                    <div className="flex items-center gap-3">
                        <button
                        type='button'
                        onClick={onOpenCart}
                        aria-label="Open shopping cart"
                        >
                            <i className="fa-solid fa-cart-shopping"></i>
                            <span className="hidden sm:inline">Cart</span>
                            {cartCount > 0 && (
                                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-orange-500 text-white text-xs font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <button
                            type='button'
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            aria-label="Toggle menu"
                            className="md:hidden hover:scale-105 transition duration-300 flex items-center justify-center"
                            >
                            {mobileMenuOpen ? <i className="fa-solid fa-xmark text-2xl text-sky-500"></i> : <i 
                            className="fa-solid fa-bars text-2xl text-sky-500"
                            ></i>}    
                        </button>

                        <div className="hidden md:flex items-center gap-2">
                            {user ? (
                                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                                        <div className="w-6 h-6 rounded-full bg-sky-400/20 text-sky-300 flex items-center justify-center text-xs font-bold">
                                            {user.name ? user.name.charAt(0).toUpperCase() : <User className='w-3.5 h-3.5'/>}
                                        </div>
                                        <span className="text-sm font-medium text-slate-200 max-w-[120px]">
                                            {user.name || 'Account'}
                                        </span>
                                    </div>
                                    <button
                                    type='button'
                                    onClick={onLogout}
                                    title="log out"
                                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                                    >
                                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <button
                                type='button'
                                onClick={onOpenAuth}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-400 hover:bg-sky-500 text-white text-sm font-bold shadow-md shadow-sky-400/20 transition"
                                >
                                    Sign In
                                </button>
                            ) }
                        </div>

                        
                    </div>

                    
                </div>
            </div>
                
                {mobileMenuOpen && (
                    <div className="md:hidden bg-black/75 backdrop-blur-md absolute w-40 text-slate-400 px-4 py-2 right-2 border-l-2 border-sky-400/80 space-y-3">
                        <button
                        type='button'
                        onClick={() => handleNavClick('home')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                            currrentPage === 'home'
                            ? 'bg-sky-400/15 text-sky-300 border border-sky-400/30'
                            : 'text-slate-300 hover:bg-slate-900'
                        }`}
                        >
                            <i className="fa-solid fa-house"></i>
                            Browse Menus
                        </button>
                        <button
                        type='button'
                        onClick={() => handleNavClick('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                            currrentPage === 'orders'
                            ? 'bg-sky-400/15 text-sky-300 border border-sky-400/30'
                            : 'text-slate-300 hover:bg-slate-900'
                        }`}
                        >
                            <i className="fa-solid fa-box"></i>
                            My Orders
                        </button>
                        <button
                        type='button'
                        onClick={() => handleNavClick('checkout')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                            currrentPage === 'checkout'
                            ? 'bg-sky-400/15 text-sky-300 border border-sky-400/30'
                            : 'text-slate-300 hover:bg-slate-900'
                        }`}
                        >
                            <i className="fa-solid fa-credit-card"></i>
                            Checkout
                        </button>
                        <div className="pt-2 border-t border-slate-800/80">
                            {user ? (
                                <div className="flex items-center justify-between px-3 py-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-sky-400/20 text-sky-300 flex items-center justify-center text-sm font-bold">
                                            {user.name ? user.name.charAt(0).toUppercase() : 'U'}
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-semibold text-white">{user.name}</p>
                                            {user.email && <p className="text-xs text-slate-400">{user.email}</p>}
                                        </div>
                                    </div>
                                    <button
                                    type='button'
                                    onClick={() => {
                                        onLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold"
                                    >
                                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                        type='button'
                        onClick={() => handleNavClick('signup')}
                        className={`uppercase px-3 py-2 rounded-xl w-full border font-semibold hover:scale-105 ${
                            currrentPage = 'signup'
                            ? 'bg-sky-400 text-slate-700 border-sky-400' 
                            : 'border-sky-400 text-sky-400'}`}
                        >
                            Register
                        </button>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    )
}