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
const fs = require('fs');

const path = require('path');
const multer = require('multer');

app.use(cors());
app.use(express.json());

const sqlite3 = require("sqlite3").verbose();

const cache = new Map();

function setCacheExpiration(key, value, time = 3600) {
    const expiryTime = Date.now() + time * 1000;
    cache.set(key, {value, expiryTime})
}

function checkExpiration(key) {
        const cached =  cache.get(key);
        if (cached) {
            if (Date.now() >= cached.expiryTime) {
                cache.delete(key);
                return null;
            }
        else return cached.value;
    }
    return null;
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store uploaded files in the 'uploads' directory
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Use the original filename for the image
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const deleteImage = (imagePath) => {
  const fullImagePath = imagePath; // Construct the full file path
    console.log(fullImagePath);

  fs.unlink(fullImagePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return;
    }
    console.log('File deleted successfully');
  });
};

// test for uploading
app.post('/upload', upload.single('image'), (req, res) => {
    const imagePath = path.join('uploads', req.file.filename); // Path to store in DB
    res.status(200).send("successful upload");
});

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
        const cacheKey = "characterList";

        const cachedCharacters = checkExpiration(cacheKey);
        if (cachedCharacters) {
            console.log("Characters are currently cached.");
            return res.status(200).json(cachedCharacters);
        }
        const characterList = getCharacters(); // get all characters names, elements, path for Star Rail
        if (!characterList.length) {
            return res.status(404).json({message: "No characters found"});
        }
        const cleanCharacterList = flatted.stringify(characterList); // Cleans it from circular references to allow for readable json
        const parsedList = flatted.parse(cleanCharacterList);
        setCacheExpiration(cacheKey, parsedList);
        return res.status(200).json(parsedList); 
    }
    catch (err) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
})

// Get the data of a single character
app.get("/Star-Rail/character", async (req, res) => {
    try {
        const {characterName, element} = req.query;
        const cacheKey = `${characterName}:${element}`
        // if (cache.has(characterName)) {
        //     console.log(`${characterName} is currently in cache.`)
        //             // console.log(cache);
        //     return res.status(200).json(cache.get(characterName))
        // }
        const cacheCharacter = checkExpiration(cacheKey); 
        if (cacheCharacter) {
            console.log(`${characterName} with ${element} is cached`);
            return res.status(200).json(cacheCharacter);
        }
        const characterData = await fetchCharacter(characterName, element);
        // console.log(characterData);
        if (!characterData.length) return res.status(404).send("Could not find character");
        setCacheExpiration(cacheKey, characterData);
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

app.use('/uploads', express.static('uploads')); // Serve images from the 'uploads' directory

app.post("/v1/Star-Rail/postGuide", authenticateToken, upload.single('image'), (request, response) => {
    try {
        const { postName, character, element, version, details } = request.body;
        const imagePath = request.file ? `uploads/${request.file.filename}` : ''; // Corrected path
        console.log(request.body);
        StarRailPost.post(db, "", character, request.user.username, details, request.user.id, postName, element, version, imagePath);
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
        const { userId, posterId, role, imagePath } = request.body;
        console.log(userId, posterId);

        if (userId !== posterId && role !== 'admin') { // Checks if your id is the same as the poster id.
            return response.status(403).send("Invalid delete, not your post");
        }
        
        StarRailPost.deletePost(db, "", id);
        deleteImage(imagePath);
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