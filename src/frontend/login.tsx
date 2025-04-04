import React, {useState} from "react";

export const Login = () => {
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

            const data = response.json();

            console.log(data);
        }
            catch (err) {
                console.log(err);
            }
        }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}