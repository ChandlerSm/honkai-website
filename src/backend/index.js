const { getCharacters } = require("./star-rail.js");
const express = require("express");
const flatted = require("flatted");

const app = new express();

const cors = require("cors");
app.use(cors());

app.use(express.json());

app.get("/Star-Rail/characters", (req, res) => {
    const characterList = getCharacters();
    const cleanCharacterList = flatted.stringify(characterList); 
    res.json(flatted.parse(cleanCharacterList)); 
})

const test = () => {
    const hsr_chars = getCharacters();
}

// getCharacters();

app.listen("3000", () => {
    console.log("Open server on 3000");
});