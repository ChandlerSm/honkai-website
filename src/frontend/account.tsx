import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import "./account.css";

export const Account = () => {
    const [token, setToken] = useState(null);
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setToken(token);
            const payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payload));
            setUserId(decodedPayload.id);
            setUsername(decodedPayload.username);
        }
        // console.log(guide.posterID);
    }, []);

    const handleDelete = async function() {
        const isConfirmed = window.confirm('Are you sure you want to delete your account?');
        if (isConfirmed) {
        if (!token) {
            alert("Not logged in");
            return
        }
        else {
            try {
            const response = await fetch(`http://localhost:3000/user/delete/${userId}/${username}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            })

            if (response.ok) {
                console.log("Deleted Account");
                localStorage.removeItem('authToken');
                navigate("/Home");
                window.location.reload();
            } else {
                alert("Could not delete account");
            }
        } catch (err) {
            console.log("Error deleting account:", err);
        }
        }
    }
    }   
    return (
        <div className="account-holder">
        {token !== null ? (
            <div className="account-login-holder">
            <div>{username}</div>
            <div>{userId}</div>
            <h2>Settings</h2>
            <div className="settings">
            <button className="delete-account-btn" onClick={handleDelete}>Delete Account</button>
            </div>
            </div>
        ) : (
            <div>Not Logged in</div>
        )}
        </div>
    )
}