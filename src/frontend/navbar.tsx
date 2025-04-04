import { ThemeContext } from "./ThemeProvider.tsx"; 
import React, { useContext } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import homeIcon from "./assets/image-removebg-preview.png"; // Import image
import "./navbar.css";

export const Navbar = ({ toggleNavbar, isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currPrefix = location.pathname.includes("Genshin-Impact") ? "Genshin-Impact" : location.pathname.includes("Star-Rail") ? "Star-Rail" : "";

  const { toggleTheme } = useContext(ThemeContext);
    const navButtonClicked = (destination) => {
        if (destination === "Home") {
            navigate("/Home");
        }   
        else if (destination === "Genshin Impact") {
            navigate("/Genshin-Impact");
        }
        else {
            console.log("That navigation link doesn't exist: ", destination);
        }
    }



  return (
    <div className={`navbar-holder ${isOpen ? 'open' : 'closed'}`}>
      <div id="top-navbar"></div>
      <div id="left-navbar">
      <button className="home-button" onClick={() => navigate("Home")}><img src={homeIcon} alt=""/></button>
        <button className="nav-buttons" onClick={toggleNavbar}>Close</button>
        <button className="nav-buttons" onClick={toggleTheme}>Light / Dark</button>
        {currPrefix !== "" ? (
        <button className="nav-buttons" onClick={() => navigate(`${currPrefix}/characters`)}>Characters</button>
        ) : (
          <button className="nav-buttons" onClick={() => navigate("Genshin-Impact")}>Genshin Impact</button>
        )}
      </div>
    </div>
  );
};
