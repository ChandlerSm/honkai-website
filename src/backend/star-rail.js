const { StarRail } = require("starrail.js");
const Posts = require("./posts.js");
const sr_client = new StarRail({defaultLanguage: "en"});

// More so for testing and reading data from api
// async function fetchCharacters() {
//     try {
//         const characters = await sr_client.getAllCharacters();
//         console.log(characters);  // Log the entire object
//         // console.log(typeof characters);  // Log the type of the object
//         // // If you want to check the type of a specific path or property:
//         // console.log(characters[0]);  // Check the first character object
//         // console.log(typeof characters[0].name);  // Check the type of the 'name' property
//     } catch (error) {
//         console.error("Error fetching characters:", error);
//     }
// }

// fetchCharacters();


// Returns JSON data of all characters in Honkai Star Rail
function getCharacters() {
    const characters = sr_client.getAllCharacters();
    
    const characterData = characters.map(character => {
        const name = character.name.get();
        if (name === "{NICKNAME}") {
            return null; // Skip characters with the nickname "{NICKNAME}"
        }

        const element = character.combatType.name.get();
        const path = character.path.name.get();
        
        // Return an object with the name, element, and path
        return {
            name,
            element,
            path
        };
    }).filter(character => character !== null); // Remove any null values if skipped

    // Return the new array with the relevant data
    return characterData;
}

// Star rail Child class of posts to post to the db.
const tablename = 'StarRailGuides';
class StarRailPosts extends Posts {
    post(db, tableName, character, username, postDetails, userId, postName, element, version) {
        super.post(db, tablename, character, username, postDetails, userId, postName, element, version);
    }

    getPosts(db, tableName, character, index) {
        return super.getPosts(db, tablename, character, index);
    }

    getYourPosts(db, tableName, userId) {
        return super.getYourPosts(db, tablename, userId);
    }
}

module.exports = {getCharacters, StarRailPosts};