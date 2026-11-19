import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Menu from './pages/menu';
import Checkout from './pages/checkout';
import Signup from './pages/signup';
import Navbar from './navbar';
import './App.css'

function App() {

  return (
      <>
      <Navbar />
      <div
      className='py-24 px-5'
      >
        <Login />
      </div>
      
      </>
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
