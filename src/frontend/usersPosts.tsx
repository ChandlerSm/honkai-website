import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./userPosts.css";
import fireflyIcon from "./assets/firefly-removebg-preview.png";

export const UserPosts = () => {
    const [usersPosts, setUsersPosts] = useState([]);
    const [token, setToken] = useState(null);
    const [totalPosts, setTotalPosts] = useState(0);  // State to store total posts
    const navigate = useNavigate();
    const [characterList, setCharactersList] = useState([]);
    const [character, setCharacter] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5); // Adjust as needed

    useEffect(() => {
            // Fetches all characters name from star rail api.
            fetch("http://localhost:3000/Star-Rail/characters")
            .then(res => res.json())
            .then(data => {console.log(data); setCharactersList(data);}); 
    }, []);

    // Fetch user posts when token is available
    useEffect(() => {
        if (localStorage.getItem('authToken')) {
            setToken(localStorage.getItem('authToken'));
        }
    }, []);

    // Fetch posts and totalPages when currentPage or token changes
    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token, currentPage]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/v1/userPosts?character=${character}&page=${currentPage}&limit=${postsPerPage}`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });

            const result = await response.json();
            console.log(result);

            if (result.guidesList) {
                setUsersPosts(result.guidesList.guides);  
            }

            if (result.guidesList.totalPages) {
                setTotalPosts(result.guidesList.totalPages); 
            } 
            setIsLoading(false);
        } catch (err) {
            console.log("Error fetching posts:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [character, currentPage]);

    const handleClick = (guide) => {
        navigate(`/Star-Rail/Guides/${guide.id}`, { state: { guide } });
    }

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);  
        fetchData();
    };

    return (
        <div className="user-post-holder">
            {/* Character selection */}
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
    
            <h1>Your Posts</h1>
    
            {/* Loading state */}
            {isLoading ? (
                <div className="guide-list-empty">
                    <img src={fireflyIcon} alt="Loading" className="loading-image" />
                    <h1>Loading Guides...</h1>
                </div>
            ) : (
                // If not loading, show guides or no posts message
                <div>
                    {usersPosts.length > 0 ? (
                        <div>
                            <div className="guide-list">
                                {usersPosts.map((guide, index) => (
                                    <div key={index} className="guide-box" style={{ cursor: "pointer" }} onClick={() => handleClick(guide)}>
                                        <div className="guide-details">
                                            <h1>{guide.name}</h1>
                                            <p>By: {guide.username}</p>
                                            <p>Version: {guide.gameVersion}</p>
                                            <p>Created: {guide.creationDate}</p>
                                        </div>
                                        <div className="image-holder">
                                            {guide.imagePath ? (
                                                <img src={`http://localhost:3000/${guide.imagePath}`} alt="" className="post-image"/>
                                            ) : (
                                                <p></p> // Or any placeholder content
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Pagination postsPerPage={postsPerPage} totalPosts={totalPosts} paginate={paginate} />
                        </div>
                    ) : (
                        <div className="user-posts-holder">
                            <h1>You have no posts</h1>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
    
};

// Pagination component
const Pagination = ({ postsPerPage, totalPosts, paginate }: { postsPerPage: number; totalPosts: number; paginate: (pageNumber: number) => void }) => {
    const pageNumbers: number[] = [];

    for (let i = 1; i <= totalPosts; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <div className='pagination'>
                {pageNumbers.map(number => (
                        <button onClick={() => paginate(number)} className='page-link'>
                            {number}
                        </button>
                ))}
            </div>
        </nav>
    );
};
