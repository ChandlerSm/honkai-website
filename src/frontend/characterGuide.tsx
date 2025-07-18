import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./characterGuide.css";

export const CharacterGuide = () => {
    const location = useLocation();
    const guide = location.state?.guide;
    const [token, setToken] = useState(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedGuide, setUpdatedGuide] = useState(guide);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate(); // For navigation after delete
    const [role, setRole] = useState('user');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setToken(token);
            const payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payload));
            setUserId(decodedPayload.id);
            setRole(decodedPayload.role);
        }
        // console.log(guide.imagePath);
    }, []);

    const handleDropdownToggle = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const handleDelete = async () => {
        if (!userId) {
            alert("User ID is not available. Please try again later.");
            return;  // Don't proceed if userId is undefined
        }
        const isConfirmed = window.confirm('Are you sure you want to delete this guide?');
        if (isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3000/v1/Star-Rail/deletePost/${guide.id}`, {
                    method: 'DELETE',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Authorization header with JWT token
                    },
                    body: JSON.stringify({
                        userId: userId, 
                        posterId: guide.posterID,
                        role: role,
                        imagePath: guide.imagePath
                    }),
                }); 
    
                if (response.ok) {
                    // Handle success, maybe show a success message or reset form
                    alert("Post deleted successfully.");
                    if (role !== 'admin') {
                        navigate('/Your-Posts'); // Redirect after successful delete
                    } 
                    else if (role === 'admin') {
                        const currPrefix = location.pathname.includes("Genshin-Impact") ? "Genshin-Impact" : location.pathname.includes("Star-Rail") ? "Star-Rail" : "";
                        navigate(`/${currPrefix}/Guides`)
                    }
                } else {
                    // Handle the error response
                    const errorText = await response.text();
                    alert(`Error: ${errorText}`);
                }
            } catch (err) {
                console.log("Error deleting post:", err);
                alert("There was an error deleting the post.");
            }
        }
    };
    

    const handleEdit = () => {
        setIsEditing(true); // Toggle to show the edit form
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedGuide({ ...updatedGuide, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // // Handle form submission (e.g., API call to update guide)
        // console.log('Updated Guide:', updatedGuide);
        
        try {
            const response = await fetch(`http://localhost:3000/v1/Star-Rail/update/${guide?.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ 'updatedData' : updatedGuide.postDetails }),
            });
            const result = await response.json();
            // Handle the response after post creation, e.g., reset form or show success message
        } catch (err) {
            console.log(err);
        }

        setIsEditing(false); // After saving, stop editing
        navigate("/Your-Posts")
    };

    // useEffect(() => {
    //     if (userId) {
    //         console.log("User ID set:", userId);
    //     } else {
    //         console.log("User ID not yet set.");
    //     }
    // }, [userId]);

    const showEditDeleteOptions = userId === guide?.posterID || role === 'admin';

    return (
        <div className="character-guide-holder">
            {showEditDeleteOptions && (
                <div onClick={handleDropdownToggle} className="dropdown-toggle">
                    <div className="dots"></div>
                    <div className="dots"></div>
                    <div className="dots"></div>
                </div>
            )}

            {isDropdownVisible && showEditDeleteOptions && (
                <div className="dropdown-menu">
                    <div onClick={handleEdit}>Edit</div>
                    <div onClick={handleDelete}>Delete</div>
                </div>
            )}
            <div className="image-holder">
                {guide.imagePath ? (
                    <img src={`http://localhost:3000/${guide.imagePath}`} alt="" className="post-image-individual"/>
                ) : (
                    <p></p> // Or any placeholder content
            )}
            </div>
            <h1>{guide.name}</h1>
            <h2>{guide.gameCharacter}</h2>
            <p>By: {guide.username}</p>
            <p>Version: {guide.gameVersion}</p>
            <p>Created: {guide.creationDate}</p>
            <div className="underline"></div>

            {isEditing ? (
                <form className="edit-form" onSubmit={handleSubmit}>
                    <div>
                        <textarea
                            className="edit-text"
                            name="postDetails"
                            value={updatedGuide.postDetails}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Save Changes</button>
                </form>
            ) : (
                <p>{guide.postDetails}</p>
            )}
        </div>
    );
};
