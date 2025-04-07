import { ThemeContext } from "./ThemeProvider.tsx"; 
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation, useSubmit } from "react-router-dom";
import homeIcon from "./assets/image-removebg-preview.png"; // Import image
import "./navbar.css";

export const Navbar = ({ toggleNavbar, isOpen }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      setIsLoggedIn(true);
    }
  })
  const navigate = useNavigate();
  const location = useLocation();

  const currPrefix = location.pathname.includes("Genshin-Impact") ? "Genshin-Impact" : location.pathname.includes("Star-Rail") ? "Star-Rail" : "";

  const { toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`navbar-holder ${isOpen ? 'open' : 'closed'}`}>
      <div id="top-navbar"></div>
      <div id="left-navbar">
      <button className="home-button" onClick={() => navigate("Home")}><img src={homeIcon} alt=""/></button>
        <button className="nav-buttons" onClick={toggleNavbar}>{isOpen ? "close" : "open"}</button>
        <button className="nav-buttons" onClick={toggleTheme}>Light / Dark</button>
        {!isLoggedIn && (
          <button className="nav-buttons" onClick={() => navigate("/Login")}>Login</button>
        )}

        {isLoggedIn && (
          <button className="nav-buttons" onClick={() => {localStorage.removeItem('authToken'); setIsLoggedIn(false);}}>Logout</button>
        )}
        {/* <button className="nav-buttons" onClick={() => navigate("/create-user")}>Create Accounts</button> */}
        {currPrefix !== "" ? (
          <div>
        <button className="nav-buttons" onClick={() => navigate(`${currPrefix}/characters`)}>Characters</button>
        <button className="nav-buttons" onClick={() => navigate(`${currPrefix}/Guides`)}>Guides</button>
        </div>
        ) : (
          <div>
          <button className="nav-buttons" onClick={() => navigate("Genshin-Impact")}>Genshin Impact</button>
          <button className="nav-buttons" onClick={() => navigate("Star-Rail")}>Honkai Star Rail</button>
          </div>
        )}
      </div>
    </div>
  );
};
