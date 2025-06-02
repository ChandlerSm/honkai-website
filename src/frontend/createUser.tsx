import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";
import homeIcon from "./assets/image-removebg-preview.png"; // Import image

export const CreateUser = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            return console.log("Need a username/password");
        }
        try {
            const response = await fetch('http://localhost:3000/user/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password }),
            });

            const result = await response.json();
            if (response.status === 200 || response.status === 201) {
                navigate("/Login");  
            } else if (response.status === 409) {
                alert(result.message);  
            } else {
                alert("Something went wrong");
            }
        }
            catch (err) {
                console.log("Could not create user", err);
            }
        }

    return ( 
        <div className="login-holder">
        <button className="home-user-button" onClick={() => navigate("/home")}><img src={homeIcon} alt=""/></button>
        <form className="login-form" onSubmit={handleSubmit}>
        <input className="input-holder" type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <input className="input-holder" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <button className="user-button" type="submit">Create User</button>
    </form>
    </div>
    )
}