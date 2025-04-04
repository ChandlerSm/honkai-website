import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from "./frontend/landingPage.tsx"
import { GenshinLanding } from './frontend/genshin-landing.tsx';
import { ThemeProvider } from './frontend/ThemeProvider.tsx'; 
import { HsrLanding } from './frontend/hsrLanding.tsx';
import { HsrCharacters } from './frontend/hsrCharacters.tsx';
import { Login } from './frontend/login.tsx';
import {Navbar} from './frontend/navbar.tsx';
import {useState} from 'react';


function App() {
  const [isOpen, setIsOpen] = useState(true); 

  const toggleNavbar = () => {
    setIsOpen(prev => !prev); 
  };
  return (
      <ThemeProvider>
      <Router>
      <div className="App">
      <Navbar toggleNavbar={toggleNavbar} isOpen={isOpen} />
      <div className={`content ${isOpen ? 'collapsed' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/Home" />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/Home" element={<LandingPage />}></Route>
          <Route path="/Genshin-Impact" element={<GenshinLanding />} />
          <Route path="/Star-Rail" element={<HsrLanding />} />
          <Route path='/Star-Rail/characters' element={<HsrCharacters />} />
        </Routes>
        </div>
        </div>
      </Router>

      </ThemeProvider>
  );
}

export default App;
