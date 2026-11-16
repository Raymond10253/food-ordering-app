import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
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
        <Navbar/>
        <Signup />
      </>
  )
}

export default App
