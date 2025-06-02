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
    const [filteredCharacterData, setFilteredCharacterData] = useState([]);
    const [elementByColor, setElementByColor] = useState("");
    const elementsToColors = {
        "Imaginary": "yellow",
        "Fire": "red",
        "Ice": "lightblue",
        "Wind": "green",
        "Quantum": "purple",
        "Lightning": "purple",
        "Physical": "Gray"
    };

    // console.log(characterName, element);
    useEffect(() => {
        // Fetch data based on characterName and element
        fetch(`http://localhost:3000/Star-Rail/character?characterName=${characterName}&element=${element}`)
            .then(res => res.json())
            .then(data => 
                {
                    if (!element) {
                        console.log("Element is not defined");
                        return;
                    }
                    setCharacterData(data);
                    if (data[0]) {
                        // Set description after fetching
                        let desc = data[0].characterDesc;
                        // Remove <unbreak> tags and replace them with nothing
                        desc = desc.replace(/\\n/g, ' ');
                        setCharacterDesc(desc);
                        setElementByColor(elementsToColors[element]);
                    }
                })
            .catch(error => console.error("Error fetching character data:", error));
    }, [characterName, element]);

    useEffect(() => {
        if (characterData && characterData.length > 0) {
            // Filter out any skills of type "MazeNormal" (or whatever condition you want)
            const filteredData = characterData.filter(item => item.skillType !== "MazeNormal");
            setFilteredCharacterData(filteredData);
        }
    }, [characterData]); // This effect runs when `characterData` is updated

    if (!characterData || filteredCharacterData.length === 0) {
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
        text = text.replace(/#/g, '');
        text = text.replace(/\[i\]/g, '');
        return DOMPurify.sanitize(text);
    };

    const sanitizedCharacterDesc = DOMPurify.sanitize(characterDesc);

    return (
        <div className="characterHolder">
            <div className="char-desc-holder">
                <img className="char-image" src={characterData[0].icon} alt=""></img>
                <h1 className="charName">{characterData[0].name || 'Character not found'}</h1>
                <p className="desc-text" dangerouslySetInnerHTML={{ __html: sanitizedCharacterDesc }}></p>
            </div>
            <h1 className="box-header">Skills</h1>
            <div className="skill-container">
                {filteredCharacterData.slice(1).map((skill, index) => (
                    <div className="skill-box">
                        <h1 className="skill-name"
                            dangerouslySetInnerHTML={{
                                __html: sanitizeSkillText(
                                    skill.skillName
                                ),
                            }}
                        />
                        <p className="skill-type" style={{color: `${elementByColor}`}}>{skill.skillType}</p>
                    <div>
                        <label htmlFor={`slider-${index}`}>Select Skill Level: {selectedSkillLevel[index] || 1}</label>
                        {/* Conditionally render the slider only if skillLevels length is greater than 0 */}
                        {skill.skillLevels.length > 1 && (
                            <>
                            <input
                                type="range"
                                id={`slider-${index}`}
                                min="1"
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
            <h1 className="box-header">Eidolons</h1>
            <div className="skill-container"> 
                {filteredCharacterData[0]?.eidolons?.map((eidolon, index) => (
                    <div key={index} className="skill-box">
                        <h1 className="skill-name">{eidolon.name}</h1>
                        <p className="skill-type">E{index+1}</p>
                        <p
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeSkillText(
                                        eidolon.description
                                    ),
                                }}
                            />
                    </div>
                ))}
            </div>
        </div>
    )
}