import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import "./guides.css";
import fireflyIcon from "./assets/firefly-removebg-preview.png";

// Page to show a list of all the guides for HSR
export const HsrGuides = () => {
    const navigate = useNavigate();
    const [guideList, setGuideList] = useState([]);
    const [character, setCharacter] = useState("");
    const [characterList, setCharactersList] = useState([]);
    const hsrVersions = [
        '1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6',
        '2.0', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7',
        '3.0', '3.1', '3.2'
      ];

    useEffect(() => {
            // Fetches all characters name from star rail api.
            fetch("http://localhost:3000/Star-Rail/characters")
            .then(res => res.json())
            .then(data => {console.log(data); setCharactersList(data);}); 
    }, []);

    useEffect(() => {
            const fetchGuides = async () => {
            const response = await fetch(`http://localhost:3000/v1/Star-Rail/Guides?character=${character}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })

            const result =  await response.json();
            setGuideList(result.guideList);
        }

        fetchGuides();
        console.log("Guide List", guideList);
    }, [character]);

    const handleClick = (guide) => {
        navigate(`/Star-Rail/Guides/${guide.id}`, {state: {guide}});
    }

    const handlePost = () => {
        if (!localStorage.getItem('authToken')) navigate("/Login");
        else navigate("/Star-Rail/Guide/createPost");
    }

    return (
        <div className="guide-list-holder">
            <div className="sort-bar">
            <select 
                        value={character} 
                        onChange={(e) => setCharacter(e.target.value)} 
                        className="top-input"
                    >
                        <option value="">Select Character</option>
                        {characterList.map((char, index) => (
                            <option key={index} value={char.name}>{char.name}</option>
                        ))}
            </select>
            </div>
            <button className="post-button" onClick={handlePost}>Create Post</button>
            {guideList.length != 0 ? (
            <div className="guide-list">
            {guideList.map((guide, index) => 
                <div key={index} className="guide-box" style={{cursor: "pointer"}} onClick={() => {handleClick(guide);}}>
                    <h1>{guide.name}</h1>
                    <p>By: {guide.username}</p>
                    <p>Version: {guide.gameVersion}</p>
                    <p>Created: {guide.creationDate}</p>
                </div>
            )}
            </div>
            ) : (
                <div className="guide-list-empty">
                    <img src={fireflyIcon} alt="" className="loading-image"></img>
                    <h1>Loading Guides...</h1>
                </div>
            )}
        </div>
    )
}