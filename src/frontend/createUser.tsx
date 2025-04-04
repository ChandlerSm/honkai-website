import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

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
            if (result && result.message.includes("success")) {
                navigate("/login");
            }
            console.log(result);
        }
            catch (err) {
                console.log("Could not create user", err);
            }
        }

    return ( 
        <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <button type="submit">Create User</button>
    </form>
    )
}