import { ThemeContext } from "./ThemeProvider.tsx"; 
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation, useSubmit } from "react-router-dom";
import homeIcon from "./assets/image-removebg-preview.png"; // Import image
import fireflyIcon from "./assets/firefly-removebg-preview.png";
import homeIcon2 from "./assets/both-games.png";
import "./navbar.css";

export const Navbar = ({ toggleNavbar, isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currPrefix = location.pathname.includes("Genshin-Impact") ? "Genshin-Impact" : location.pathname.includes("Star-Rail") ? "Star-Rail" : "";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [icon, setIcon] = useState(homeIcon2);
  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      setIsLoggedIn(true);
    }

    if (currPrefix === "") {
      setIcon(homeIcon2);
    }
    else if (currPrefix === "Genshin-Impact") {
      setIcon(homeIcon);
    }
    else {
      setIcon(fireflyIcon);
    }
  })


  const { toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`navbar-holder ${isOpen ? 'open' : 'closed'}`}>
      <div id="top-navbar"></div>
      <div id="left-navbar">
      <button className="home-button" onClick={() => navigate("Home")}><img src={icon} alt=""/></button>
        <button className="nav-buttons" onClick={toggleNavbar}>{isOpen ? "close" : "open"}</button>
        <button className="nav-buttons" onClick={toggleTheme}>Light / Dark</button>
        <button className="nav-buttons" onClick={() => navigate(`Your-Posts`)}>Your Guides</button>
        {!isLoggedIn && (
          <button className="nav-buttons" onClick={() => navigate("/Login")}>Login</button>
        )}

        {isLoggedIn && (
          <div>
          <button className="nav-buttons" onClick={() => {localStorage.removeItem('authToken'); setIsLoggedIn(false); window.location.reload()}}>Logout</button>
          <button className="nav-buttons" onClick={() => {navigate("/Account")}}>Account</button>
          </div>
        )}
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
