import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import LandingPage from "./frontend/landingPage.tsx";
import { GenshinLanding } from './frontend/genshin-landing.tsx';
import { CharacterGuide } from './frontend/characterGuide.tsx';
import { ThemeProvider } from './frontend/ThemeProvider.tsx'; 
import { HsrGuides } from './frontend/hsrGuides.tsx';
import { HsrLanding } from './frontend/hsrLanding.tsx';
import { CreatePost } from './frontend/createPost.tsx';
import { HsrCharacters } from './frontend/hsrCharacters.tsx';
import { UserPosts } from './frontend/usersPosts.tsx';
import { Login } from './frontend/login.tsx';
import { Navbar } from './frontend/navbar.tsx';
import { CreateUser } from './frontend/createUser.tsx';
import { useState } from 'react';

function App() {
  const [isOpen, setIsOpen] = useState(true); 
  const location = useLocation();

  const toggleNavbar = () => {
    setIsOpen(prev => !prev); 
  };

  return (
    <div className="App">
      {/* Conditionally render Navbar based on current route */}
      {location.pathname.includes("/Login") || location.pathname.includes("/create-user") ? (
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/create-user" element={<CreateUser />} />
        </Routes>
      ) : (
        <>
          <Navbar toggleNavbar={toggleNavbar} isOpen={isOpen} />
          <div className={`content ${isOpen ? 'collapsed' : ''}`}>
            <Routes>
              <Route path="/" element={<Navigate to="/Home" />} />
              <Route path="/Home" element={<LandingPage />} />
              <Route path="/Genshin-Impact" element={<GenshinLanding />} />
              <Route path="/Star-Rail/Guide/createPost" element={<CreatePost /> }/>
              <Route path="/Star-Rail" element={<HsrLanding />} />
              <Route path="/Your-Posts" element={<UserPosts />} />
              <Route path="/Star-Rail/characters" element={<HsrCharacters />} />
              <Route path="/Star-Rail/Guides" element={<HsrGuides />} />
              <Route path="/Star-Rail/Guides/:id" element={<CharacterGuide />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <ThemeProvider>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  );
}
