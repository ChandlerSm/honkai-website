require("dotenv").config();

const { getCharacters, StarRailPosts, fetchCharacter } = require("./star-rail.js");
const  GenshinPosts  = require("./Genshin.js");
const {createUser, deleteUser} = require("./user.js");
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
        const result = await createUser(db, username, hashedPassword);
        if (result === -1) {
            return res.status(409).json({ message: "User Already Exists" });
        }
        return res.status(201).json({ message: "Created user successfully" });
    } catch (err) {
        return res.status(500).json({message: "Internal Server Error", error: err.message});
    }
})

// Deletes a user
// Should be restricted by authenticateToken, only not for testing
// Parameters:
// id: ID of the user requesting the delete
// Username: Username of the user requesting the delete
// Output: Status if deleted account or not.
app.delete("/user/delete/:id/:username", authenticateToken, async (req, res) => {
    try {
        // Send token and verify that the token id and id in the param are the same.
        const { id, username } = req.params;
        const {user} = req; // Should hold id and username from JWToken to verify
        // if (user.id !== id) return res.status(403).send("Cannot delete a different account");
        deleteUser(db, id, username);
        res.status(200).send("Successfully deleted account");
    } catch (err) {
        return res.status(404).send("Could not delete user");
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
                const accessToken = jwt.sign({username: user.username, id: user.id, role: user.role}, process.env.ACCESS_SECRET_TOKEN); // Sign a access JWT for future use.
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

app.post("/Genshin-Impact/postGuide", authenticateToken, (request, response) => {
    try {
        GenshinPost.post("db", "", "details", request.user.username, 1);
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

// Get the data of a single character
app.get("/Star-Rail/character", async (req, res) => {
    try {
        const {characterName, element} = req.query;
        const characterData = await fetchCharacter(characterName, element);
        console.log(characterData);
        if (!characterData.length) return res.status(404).send("Could not find character");
        return res.status(200).json(characterData);
    } catch (err) {
        return res.status(500).send("Internal Server error");
    }
})

const StarRailPost = new StarRailPosts();

// Post a guide to the StarRailGuides DB table.
// Only usable if you are logged in.
// Parameters:
// postName: The name of the post.
// character: The character the user made the guide for.
// Element: The element that the character is.
// Version: The version of the game you are making the guide for.
// details: The main details/body of the post.
app.post("/v1/Star-Rail/postGuide", authenticateToken, (request, response) => {
    try {
        const { postName, character, element, version, details } = request.body;
        console.log(request.body);
        StarRailPost.post(db, "", character, request.user.username, details, request.user.id, postName, element, version);
        response.sendStatus(200);
    } catch (err) {
        response.status(500).json({message: "Could not upload to server"});
    }
})

// Get the guides of all characters under Star Rail
// url parameters:
// character: The character you want to sort by.
app.get("/v1/Star-Rail/Guides", async (request, response) => { // Preferably would like to add element={element} for querying by element
    try {
        const {character, page = 1, limit = 5} = request.query;
        const offset = (page - 1) * limit;
        const guideList = await StarRailPost.getPosts(db, "", character, offset, limit);   
        console.log(guideList);
        // Reverse the list using two pointers
        // let start = 0;
        // let end = guideList.length - 1; 
        // while (start < end) { 
        //     [guideList[start], guideList[end]] = [guideList[end], guideList[start]];
        //     start++;
        //     end--;
        // }
        response.status(200).json({message: "Got guide list", guideList: guideList});
    } catch (err) {
        response.status(404).json({message: "Could not get guide list", err});
    }
})

// Deletes a post by id.
// Only usable on posts made by the current user.
// authenticateToken to verify you can delete the post under your-posts.
// Parameters:
// id: The id of the post you want to delete.
app.delete("/v1/Star-Rail/deletePost/:id", authenticateToken, (request, response) => {
    try {
        const {id} = request.params;
        const { userId, posterId, role } = request.body;
        console.log(userId, posterId);

        if (userId !== posterId && role !== 'admin') { // Checks if your id is the same as the poster id.
            return res.status(403).send("Invalid delete, not your post");
        }
        
        StarRailPost.deletePost(db, "", id);
        response.status(200).send("Successfully deleted post");
    }
    catch (err) {
        response.status(404).send("Could not delete post");
    }
})

// Edits a post by id.
// Only usable on posts made by the current user.
// authenticateToken to verify you can delete the post under your-posts.
// Parameters:
// id: The id of the post you want to update
// updatedData: JSON data holding the things you want to update (e.g. "updatedData" : "Updated post details");
app.put("/v1/Star-Rail/update/:id", authenticateToken, async (request, response) => {
    try {
        const { id } = request.params;
        const updatedData = request.body.updatedData;
        await StarRailPost.editPost(db, "", id, updatedData);
        response.status(200).send("Updated post");
    } catch (err) {
        response.status(404).send("Could not find post");
    }
})

// Pulls the current users posts to display
app.get("/v1/userPosts", authenticateToken, async (request, response) => {
    try {
        const { character, page = 1, limit = 5 } = request.query;
        const offset = (page - 1) * limit;
        const guides = await StarRailPost.getYourPosts(db, "", character, request.user.id, offset, limit);
        console.log(guides);
        response.status(200).json({message: "Got your posts!", guidesList: guides});
    } catch (err) {
        response.status(404).json({message: "Could not find data", err: err});
    }
})

app.listen("3000", () => {
    console.log("Open server on 3000");
});