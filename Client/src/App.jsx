import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar'
import UnderConstructionPage from './components/UnderConstructionPage';
import Footer from './components/Footer/Footer';


const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/'  element = {<Home/>}/>
        <Route path='/*'  element = {<UnderConstructionPage/>}/>
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;