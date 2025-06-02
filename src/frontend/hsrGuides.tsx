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
    const [isLoading, setIsLoading] = useState(false);

    const [totalPosts, setTotalPosts] = useState(0);  
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5); 
      

    useEffect(() => {
            // Fetches all characters name from star rail api.
            fetch("http://localhost:3000/Star-Rail/characters")
            .then(res => res.json())
            .then(data => {console.log(data); setCharactersList(data);}); 
    }, []);

    const fetchGuides = async () => {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/v1/Star-Rail/Guides?character=${character}&page=${currentPage}&limit=${postsPerPage}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        const result =  await response.json();
        setGuideList(result.guideList.guides);
        setTotalPosts(result.guideList.totalPages);
        setIsLoading(false);
}

    useEffect(() => {
        fetchGuides();
        console.log("Guide List", guideList);
    }, [character, currentPage]);

    const handleClick = (guide) => {
        navigate(`/Star-Rail/Guides/${guide.id}`, {state: {guide}});
    }

    const handlePost = () => {
        if (!localStorage.getItem('authToken')) navigate("/Login");
        else navigate("/Star-Rail/Guide/createPost");
    }

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);  
    };

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
            {isLoading ? (
                <div className="guide-list-empty">
                    <img src={fireflyIcon} alt="" className="loading-image" />
                    <h1>Loading Guides...</h1>
                </div>
            ) : guideList.length > 0 ? (
                <div className="guide-list">
                    {guideList.map((guide, index) => (
                        <div key={index} className="guide-box" style={{ cursor: "pointer" }} onClick={() => { handleClick(guide); }}>
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
            ) : (
                <div className="guide-list-empty">
                    <h1>No Guides Found</h1>
                </div>
            )}
            <div className="pagination-container">
            <Pagination postsPerPage={postsPerPage} totalPosts={totalPosts} paginate={paginate} />
            </div>
        </div>
    );
    
}

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