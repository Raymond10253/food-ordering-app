import React, { useState, useEffect } from 'react';

import Home from './pages/home';
import Login from './pages/login';
import Menu from './pages/menu';
import Checkout from './pages/checkout';
import Signup from './pages/signup';
import Navbar from './navbar';
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cravedash_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('cravedash_token') || '');

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('cravedash_user', JSON.stringify(user));
      localStorage.setItem('cravedash_token', token);
    }
  }, [user, token]);

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
        i.id === item.id ? {...i, quantity: i.quantity + 1} : i);
      }
      return [...prev, {...item, quantity: 1}];
    });
  };

  const handleUpdateQty = (id, delta) => {
    setCart((prev) => 
    prev
      .map((item) =>
        item.id === id ? {...item, quantity: item.quantity + delta } : item
      )
      .filter((item) => item.quantity > 0)
    );
  };

  const handleClearCart = () =>setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleAuthSuccess = ({user: loggedUser, token: jwtToken}) => {
    setUser(loggedUser);
    setToken(jwtToken);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('cravedash_user');
    localStorage.removeItem('cravedash_token');
    setUser(null);
    setToken('');
    setCurrentPage('login');
  };

  const handleOrderSuccess = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCurrentPage('orders');
  };



  return (
      <div className='min-h-screen bg-slate-950 text-slate-100 flex flex-col'>
        <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onLogout={handleLogout}
        />

        <div className='flex-1'>
          {currentPage === 'home' && (
            <Home 
            onAddToCart={handleAddToCart}
            cartCount={cartCount}
            onOpenCart={() => setIsCartOpen(true)}
            />
          )}

          {currentPage === 'login' && (
            <Login 
            onLoginSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setCurrentPage('login')}
            />
          )}

          {currentPage === 'checkout' && (
            <Checkout 
            cart={cart}
            user={user}
            token={token}
            onOrderSuccess={handleOrderSuccess}
            onBack={() => setCurrentPage('home')}
            onClearCart={handleClearCart}
            />
          )}

          {currentPage === 'signup' && (
            <Signup />
          )}

          {currentPage === 'orders' && (
            <div className='max-w-4xl mx-auto px-4 py-10'>
              <h1 className='text-2xl font-extrabold mb-6 flex items-center'>
                <i className="fa-solid fa-box"></i>
                My Orders
              </h1>

              {orders.length === 0 ? (
                <div className='bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center'>
                  <p className='text-slate-400 mb-4'>You haven't any orders yet.</p>
                  <button
                  type='button'
                  onClick={() => setCurrentPage('home')}
                  className='px-5 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-500 text-white text-sm font-bold'
                  >
                    Browse Menus
                  </button>
                </div>
              ) : (
                <div className='space-y-4'>
                  {orders.map((order) => (
                    <div
                    key={order.id}
                    className='bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'
                    >
                      <div>
                        <div className='flex items-center gap-2.5 mb-1'>
                          <span className='font-bold text-white`'>Order #{order.id}</span>
                          <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'>
                            <i className='fa-solid fa-circle-check'></i>
                            {order.status}
                          </span>
                        </div>
                        <p className='text-xs text-slate-400'>
                          Delivery to: {order.delivery_address} . Payment: {order.payment_method?.toUppercase()}
                        </p>
                        <p className='text-sm text-slate-300 mt-2'>
                          {(order.items || []).map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>
                      </div>
                      <div
                      className='text-left sm:text-right'
                      >
                        <p
                        className='text-xs text-slate-400'
                        >
                          Total Paid
                        </p>
                        <p
                        className='text-lg font-extrabold text-sky-400'
                        >
                          KES {Number(order.total_amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {isCartOpen && (
          <div
          className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end'
          >
            <div
            className='w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between p-6'
            >
              <div>
                <div
                className='flex items-center justify-between pb-4 border-b border-slate-800'
                >
                  <h2
                  className='text-lg font-bold flex items-center gap-2'
                  >
                    <i className='fa-solid fa-cart-shopping' />
                    Your Cart ({cartCount})
                  </h2>
                  <button
                  type='button'
                  onClick={() => setIsCartOpen(false)}
                  className='p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white'
                  >
                    <i
                    className='fa-solid fa-xmark'
                    ></i>
                  </button>
                </div>

                {cart.length === 0 ? (
                  <p
                  className='text-sm text-slate-400 text-center py-12'
                  >
                    Your cart is currently empty. Add Items from the Home menu!
                  </p>
                ) : (
                  <div
                  className='mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1'
                  >
                    {cart.map((item) => (
                      <div
                      key={item.id}
                      className='flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800'
                      >
                        <div>
                          <p
                          className='text-sm font-semibold text-white truncate'
                          >
                            {item.name}
                          </p>
                          <p
                          className='text-xs text-sky-300 font-bold'
                          >
                            KES {(Number(item.price) * item.quality).toFixed(2)}
                          </p>
                        </div>
                        <div
                        className='flex items-center gap-2'
                        >
                          <button
                          type='button'
                          onClick={() => handleUpdateQty(item.id, -1)}
                          className='p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200'
                          >
                            {item.quantity === 1 
                            ? <i className="fa-solid fa-trash"></i>
                            : <i className="fa-solid fa-minus"></i>}
                          </button>
                          <span
                          className='text-sm font-bold w-5 text-center'
                          >
                            {item.quantity}
                          </span>
                          <button
                          type='button'
                          onClick={() => handleUpdateQty(item.id, 1)}
                          className='p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200'
                          >
                            <i
                            className='fa-solid fa-plus'
                            ></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div
                  className='pt-4 border-t border-slate-800 space-y-4'
                >
                  <div
                  className='flex justify-between text-base font-bold'
                  >
                    <span
                    className='text-slate-300'
                    >
                      Subtotal
                    </span>
                    <span
                    className='text-sky-400'
                    >
                      KES {cartSubtotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                  type='button'
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentPage('checkout');
                  }}
                  className='w-full py-3.5 px-4 rounded-xl bg-sky-400 hover:bg-sky-500 text-white font-bold flex items-center justify-center gap-2 transition'
                  >
                    Proceed to Checkout
                    <i
                    className='fa-solid fa-arrow-right'
                    ></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
  )
}

export default App

/*
export default function App() {
  return (
    <Router>
      <Navbar />
      <div className='py-24 px-5'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />}/>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/menu' element={<Menu />}></Route>
          <Route path='/checkout' element={<Checkout />}></Route>
        </Routes>
      </div>
    </Router>
  )
}
  */
