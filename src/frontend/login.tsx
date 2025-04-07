import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";
import homeIcon from "./assets/image-removebg-preview.png"; // Import image


export const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            return console.log("Need a username/password");
        }
        try {
            const response = await fetch('http://localhost:3000/user/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password }),
            });
            const result = await response.json();
            localStorage.setItem('authToken', result.accessToken);
            const data = localStorage.getItem('authToken');
            console.log(`${result.message}: ${data}`);
        }
            catch (err) {
                console.log(err);
            }
        }

    return (
        <div className="login-holder">
            <button className="home-user-button" onClick={() => navigate("/Home")}><img src={homeIcon} alt=""/></button>
            <form onSubmit={handleSubmit} className="login-form">
                <input className="input-holder" type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                <input className="input-holder" type="text" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <button className="user-button" type="submit">Login</button>
                <p onClick={() => navigate("/create-user")} style={{cursor: "pointer"}}>Create an Account</p>
            </form>
        </div>
    )
}