const { getCharacters } = require("./star-rail.js");
const {createUser} = require("./user.js");
const express = require("express");
const flatted = require("flatted");
const app = new express();
const cors = require("cors");
const bcrypt = require("bcrypt");

app.use(cors());
app.use(express.json());

const sqlite3 = require("sqlite3").verbose();

// SQLite Database connecting
const db = new sqlite3.Database('./database/database.db', (err) => {
    if (err) {
      console.log("Error connecting to DB");
    }
    else {
      console.log("Connected to db.")
    }
  });

// Everything related to user is below
// Create a user
// Parameters: username, password
// Output: status message
const username = "testusername";
const password = "testpassword"; // Use Bcrypt for making passwords
app.post("/user/create", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        createUser(db, username, hashedPassword);
        return res.status(200).send("created user successfully");
    } catch (err) {
        return res.status(500).json({message: "Internal Server Error", error: err.message});
    }
})

app.post(`/user/login`, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Fetch the user based on the provided username
        db.get("SELECT * FROM user WHERE username = ?", [username], async (err, user) => {
            if (err) {
                return res.status(500).json({ message: "Error fetching user", error: err.message });
            }

            // If no user is found
            if (!user) {
                return res.status(404).send("User not found");
            }

            // Compare the password using bcrypt
            const isMatching = await bcrypt.compare(password, user.password);
            if (isMatching) {
                return res.status(200).json({message: "Successful login", username: user.username});
            } else {
                return res.status(401).send("Invalid Login Information");
            }
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


// Everything below is for Genshin

// Everything Below is for Star Rail
// Returns a json list of all characters along with name, element, path
app.get("/Star-Rail/characters", (req, res) => {
    try {
    const characterList = getCharacters(); // get all characters names, elements, path for Star Rail
    if (!characterList.length) {
        return res.status(404).json({message: "No characters found"});
    }
    const cleanCharacterList = flatted.stringify(characterList); // Cleans it from circular references to allow for readable json
    res.status(200).json(flatted.parse(cleanCharacterList)); 
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
})

const test = () => {
    const hsr_chars = getCharacters();
}

// getCharacters();

app.listen("3000", () => {
    console.log("Open server on 3000");
});