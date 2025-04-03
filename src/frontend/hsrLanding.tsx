import React from "react";
import { useNavigate} from "react-router-dom";
import "./hsrLanding.css";

export const HsrLanding = () => {
    const navigate = useNavigate();


    return (
    <div className="hsr-holder">
        <div className="game-name-holder" onClick={() => navigate("/Star-Rail/characters")}><p>Characters</p></div>
        <div className="game-name-holder" onClick={() => navigate("/Star-Rail/Guides")}><p>Guides</p></div>
    </div>
    )
}