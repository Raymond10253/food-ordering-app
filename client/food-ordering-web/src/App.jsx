import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Menu from './pages/menu';
import Checkout from './pages/checkout';
import Navbar from './navbar';
import './App.css'

function App() {

  return (
      <>
        <Navbar />
      </>
  )
}

export default App
