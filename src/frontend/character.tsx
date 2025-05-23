import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import "./character.css";
import fireflyIcon from "./assets/firefly-removebg-preview.png";
import DOMPurify from "dompurify"; // Import DOMPurify for sanitizing HTML

export const Character = () => {
    const { characterName, element } = useParams(); // Get the params from the URL
    const [characterData, setCharacterData] = useState(null);
    const [characterDesc, setCharacterDesc] = useState("");
    const [selectedSkillLevel, setSelectedSkillLevel] = useState({}); // To track selected skill levels

    console.log(characterName, element);
    useEffect(() => {
        // Fetch data based on characterName and element
        fetch(`http://localhost:3000/Star-Rail/character?characterName=${characterName}&element=${element}`)
            .then(res => res.json())
            .then(data => setCharacterData(data))
            .catch(error => console.error("Error fetching character data:", error));
    }, [characterName, element]);

    useEffect(() => {
        if (characterData && characterData[0]) {
            let desc = characterData[0].characterDesc;
            
            // Remove <unbreak> tags and replace them with nothing
            // Replace \n with a space
            desc = desc.replace(/\\n/g, ' ');

            // Set the final transformed description
            setCharacterDesc(desc);
            console.log(characterData);
        }
    }, [characterData]); // This effect runs when `characterData` is updated

    if (!characterData) {
        return  (              
        <div className="characterHolder-loading">
        <img src={fireflyIcon} alt="Loading" className="loading-image" />
        <h1>Loading Guides...</h1>
        </div>  // Show a loading message until data is available
        )
    }

    const handleSliderChange = (skillIndex, levelIndex) => {
        setSelectedSkillLevel(prev => ({
            ...prev,
            [skillIndex]: levelIndex  // Set the selected level independently for each skill
        }));
    };

    const sanitizeSkillText = (text) => {
        if (!text) return ''; 

        text = text.replace(/\\n/g, ' ');
        return DOMPurify.sanitize(text);
    };

    const sanitizedCharacterDesc = DOMPurify.sanitize(characterDesc);

    return (
        <div className="characterHolder">
            <div className="char-desc-holder">
                <img className="char-image" src={characterData[0].icon}></img>
                <h1 className="charName">{characterData[0].name || 'Character not found'}</h1>
                <p className="desc-text" dangerouslySetInnerHTML={{ __html: sanitizedCharacterDesc }}></p>
            </div>

            <div className="skill-container">
                {characterData.slice(1).map((skill, index) => (
                    <div className="skill-box">
                        <h1 className="skill-name">{skill.skillName}</h1>
                        <p className="skill-type">{skill.skillType}</p>
                    <div>
                        <label htmlFor={`slider-${index}`}>Select Skill Level: {selectedSkillLevel[index]}</label>
                        {/* Conditionally render the slider only if skillLevels length is greater than 0 */}
                        {skill.skillLevels.length > 1 && (
                            <>
                            <input
                                type="range"
                                id={`slider-${index}`}
                                min="0"
                                max={skill.skillLevels.length - 1}
                                value={selectedSkillLevel[index] || 0}
                                onChange={(e) => handleSliderChange(index, e.target.value)}
                                style={{ width: '100%' }}
                            />
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeSkillText(
                                        skill.skillLevels[selectedSkillLevel[index] || 0]?.description
                                    ),
                                }}
                            />
                            </>
                        )}
                            {skill.skillLevels.length === 1 && (
                                    <p
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeSkillText(
                                            skill.skillLevels[selectedSkillLevel[index] || 0]?.description
                                        ),
                                    }}
                                />
                            )}
                    </div>
                    </div>
                ))}
            </div>
        </div>
    )
}