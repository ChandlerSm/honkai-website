import React, {useEffect} from "react";
import { useLocation } from "react-router-dom";
import "./characterGuide.css";

export const CharacterGuide = () => {
    const location = useLocation();
    const guide = location.state?.guide;  
    useEffect(() => {
        console.log(guide);
    })
    
    return (
        <div className="character-guide-holder">
            <h1>{guide.name}</h1>
            <h1>{guide.gameCharacter}</h1>
                <p>By: {guide.username}</p>
                <p>Version: {guide.gameVersion}</p> 
                <p>Created: {guide.creationDate}</p>
                <div className="underline"></div>
                <p>{guide.postDetails}</p>
            </div>
    )
}