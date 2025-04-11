import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import "./guides.css"

// Page to show a list of all the guides for HSR
export const HsrGuides = () => {
    const navigate = useNavigate();
    const [guideList, setGuideList] = useState([]);
    const [character, setCharacter] = useState("");
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
            <div className="sort-bar">Sort bar</div>
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
                <div className="guide-list"><h1>No guides available</h1></div>
            )}
        </div>
    )
}