import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./userPosts.css";

export const UserPosts = () => {
    const [usersPosts, setUsersPosts] = useState([]);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            setToken(localStorage.getItem('authToken'));
        }
    }, []);

    useEffect(() => {
        if (token) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/v1/userPosts`, {
                        method: 'GET',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` 
                        },
                    });

                    const result = await response.json();
                    console.log(result);  
                    if (result.guidesList) {
                        setUsersPosts(result.guidesList.reverse());  
                    }
                } catch (err) {
                    console.log("Error fetching posts:", err);
                }
            };

            fetchData();
        }
    }, [token]);  

    useEffect(() => {
        console.log(usersPosts);
    }, [usersPosts]); 

    const handleClick = (guide) => {
        navigate(`/Star-Rail/Guides/${guide.id}`, {state: {guide}});
    }
    return (
        <div>
            {usersPosts.length !== 0 ? (  
                <div className="user-posts-holder">
                    <h1>Your Posts</h1>
                    <div className="guide-list">
                        {usersPosts.map((guide, index) => (
                            <div key={index} className="guide-box" style={{ cursor: "pointer" }} onClick={() => handleClick(guide)}>
                                <h1>{guide.name}</h1>
                                <p>By: {guide.username}</p>
                                <p>Version: {guide.gameVersion}</p>
                                <p>Created: {guide.creationDate}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="user-posts-holder">
                <h1>You have no posts</h1>
                </div>
            )}
        </div>
    );
};
