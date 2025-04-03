import React, {useContext} from "react";
import "./landingPage.css";
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
    const navigate = useNavigate();
    const navigateHsr = () => {
    
    }
    return (
        <div id="landing-page-holder">
            <div className="game-name-holder"><p>Genshin Impact</p></div>
            <div className="game-name-holder" onClick={() => navigate("/Star-Rail")}><p>Honkai Star Rail</p></div>
        </div>
    )
}

export default LandingPage;