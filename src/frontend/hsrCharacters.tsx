import "./hsrCharacters.css";
import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import fireflyIcon from "./assets/firefly-removebg-preview.png";

export const HsrCharacters = () => {
    const [charactersList, setCharactersList] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        // Fetches all characters name from star rail api.
        fetch("http://localhost:3000/Star-Rail/characters")
        .then(res => res.json())
        .then(data => {console.log(data); setCharactersList(data);}); 
    }, []);

    console.log("test", charactersList);

    return (
        <div>
    {charactersList.length !== 0 ? (
        <div className="hsr-char-holder">
            <div>Welcome to the HSR Character List</div>
            <div className="char-holder">
            {charactersList.map((char, index) => (
                <div className="char-box" key={index} onClick={() => navigate(`/Star-Rail/characters/${char.name}/${char.element}`)}>
                    <img src={char.icon} alt=""></img>
                    <p className="character-name">{char.name}</p>
                </div>
            ))}
        </div>
        </div>
    ) : (
        <div className="character-list-empty">
        <img src={fireflyIcon} alt="" className="loading-image"></img>
        <h1>Loading Guides...</h1>
        </div>
    )}
        </div>
    )
}