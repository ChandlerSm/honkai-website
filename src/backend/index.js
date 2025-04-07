require("dotenv").config();

const { getCharacters, StarRailPosts } = require("./star-rail.js");
const  GenshinPosts  = require("./Genshin.js");
const {createUser} = require("./user.js");
const express = require("express");
const flatted = require("flatted");
const app = new express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  // MIDDLEWARE authenticate JWT for security
  // Should be used for any data sensitive data pull related to the user.
  function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get the authorization token from the header
    if (token === null) return res.status(400).send("Token invalid");

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => { // Verifies if the signed token matches the .env secret token
        if (err) return res.sendStatus(401);
        req.user = user;
        next();
    })
  }

// Everything related to user is below
// Create a user
// Parameters: username, password
// Output: status message
app.post("/user/create", async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        createUser(db, username, hashedPassword);
        return res.status(200).json({message: "created user successfully"});
    } catch (err) {
        return res.status(500).json({message: "Internal Server Error", error: err.message});
    }
})

// User login REST Api
// Checks the encrypted password and then signs a JWT to be sent back to frontend.
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
            const isMatching = await bcrypt.compare(password, user.password); // True of false if inputted password matches
            if (isMatching) {
                const accessToken = jwt.sign(user.username, process.env.ACCESS_SECRET_TOKEN); // Sign a access JWT for future use.
                return res.status(200).json({message: "Successful login", accessToken: accessToken}); // Returns success message and JWT
            } else {
                return res.status(401).send("Invalid Login Information");
            }
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


// Everything below is for Genshin
const GenshinPost = new GenshinPosts();

app.post("/Genshin-Impact/postGuide", (request, response) => {
    try {
        GenshinPost.post("db", "", "details", "username", 1);
        response.sendStatus(200);
    } catch (err) {
        console.log("Could not post");
    }
});

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

const StarRailPost = new StarRailPosts();

app.post("/Star-Rail/postGuide", (request, response) => {
    try {
        StarRailPost.post("db", "", "details", "username", 1);
        response.sendStatus(200);
    } catch (err) {
        console.log("Could not post");
    }
})

app.get("/Star-Rail/Guides", async (request, response) => {
    try {
        const character = request.query.character;
        const guideList = await StarRailPost.getPosts(db, "", character, 10);
        response.status(200).json({message: "Got guide list", guideList: guideList});
    } catch (err) {
        response.status(404).json({message: "Could not get guide list", err});
    }
})

app.listen("3000", () => {
    console.log("Open server on 3000");
});