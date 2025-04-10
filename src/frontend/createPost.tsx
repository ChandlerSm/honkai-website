import React, { useState, useEffect } from 'react';
import "./createPost.css";

export const CreatePost = () => {
    const [character, setCharacter] = useState("");
    const [postName, setPostName] = useState("");
    const [element, setElement] = useState("");
    const [version, setVersion] = useState(0);
    const [details, setDetails] = useState("");
    const [token, setToken] = useState(null);
    const [errorMessage, setErrorMessage] = useState(""); // State for error messages

    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            setToken(localStorage.getItem('authToken'));
        }
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

        try {
            const response = await fetch('http://localhost:3000/Star-Rail/postGuide', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ postName, character, element, version, details }),
            });
            const result = await response.json();
            // Handle the response after post creation, e.g., reset form or show success message
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="create-post-holder">
            <h2>Create Post</h2>
            <form className="post-form" onSubmit={createPost}>
                <div className="top-holder">
                    <input 
                        value={postName} 
                        placeholder="Post name" 
                        onChange={(e) => setPostName(e.target.value)} 
                        className="top-input" 
                    />
                    <input 
                        value={character} 
                        placeholder="Character" 
                        onChange={(e) => setCharacter(e.target.value)} 
                        className="top-input" 
                    />
                    <input 
                        value={element} 
                        placeholder="Element" 
                        onChange={(e) => setElement(e.target.value)} 
                        className="top-input" 
                    />
                    <input 
                        value={version} 
                        placeholder="Version" 
                        onChange={(e) => setVersion(e.target.value)} 
                        className="top-input" 
                    />
                </div>
                <input 
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
