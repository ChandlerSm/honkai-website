import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./createPost.css";

export const CreatePost = () => {
    const [character, setCharacter] = useState("");
    const [postName, setPostName] = useState("");
    const [element, setElement] = useState("");
    const [version, setVersion] = useState(0);
    const [details, setDetails] = useState("");
    const [token, setToken] = useState(null);
    const [errorMessage, setErrorMessage] = useState(""); // State for error messages
    const [characterList, setCharactersList] = useState([]);
    const elementList = ["Ice", "Imaginary", "Quantum", "Fire", "Wind", "Lightning", "Physical"];
    const [imagePath, setImagePath] = useState("");
    const hsrVersions = [
        '1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6',
        '2.0', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7',
        '3.0', '3.1', '3.2'
      ];
      const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            setToken(localStorage.getItem('authToken'));
        }
    }, []);

    useEffect(() => {
            // Fetches all characters name from star rail api.
            fetch("http://localhost:3000/Star-Rail/characters")
            .then(res => res.json())
            .then(data => {console.log(data); setCharactersList(data);}); 
    }, []);

    const validateForm = () => {
        if (!postName || !character || !element || !version || !details) {
            setErrorMessage("All fields are required.");
            return false;
        }
        setErrorMessage(""); // Clear error message if validation passes
        return true;
    };

    const createPost = async (e) => {
        e.preventDefault(); // Prevent form submission if validation fails

        if (!validateForm()) {
            return; // Don't proceed with the fetch if validation fails
        }
        
        const formData = new FormData();
        formData.append('postName', postName);
        formData.append('character', character);
        formData.append('element', element);
        formData.append('version', version);
        formData.append('details', details);

        // Append the image file if it's selected
        if (imagePath) {
            formData.append('image', imagePath);
        }

        try {
            const response = await fetch('http://localhost:3000/v1/Star-Rail/postGuide', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}` 
                },
                body: formData,
            });
            const result = await response.json();
            // Handle the response after post creation, e.g., reset form or show success message
        } catch (err) {
            console.log(err);
        }
        navigate("/Your-Posts")
    };

    return (
        <div className="create-post-holder">
            <h2>Create Post</h2>
            <form className="post-form" onSubmit={createPost}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImagePath(e.target.files[0])} // Save the file to the state
                    className="top-input"
                />
                <div className="top-holder">
                    <input 
                        value={postName} 
                        placeholder="Post name" 
                        onChange={(e) => setPostName(e.target.value)} 
                        className="top-input" 
                    />
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
                    <select 
                        value={element} 
                        onChange={(e) => setElement(e.target.value)} 
                        className="top-input"
                    >
                        <option value="">Select Element</option>
                        {elementList.map((el, index) => (
                            <option key={index} value={el}>{el}</option>
                        ))}
                    </select>
                    <select 
                        value={version} 
                        onChange={(e) => setVersion(e.target.value)} 
                        className="top-input"
                    >
                        <option value="">Select Version</option>
                        {hsrVersions.map((version, index) => (
                            <option key={index} value={version}>{version}</option>
                        ))}
                    </select>
                </div>
                <textarea 
                    value={details} 
                    placeholder="Details" 
                    onChange={(e) => setDetails(e.target.value)} 
                    className="details"
                />

                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button className="post-button" type="submit">Create Post</button>
            </form>
        </div>
    );
};
