const { StarRail, LeveledSkill, SkillLevel } = require("starrail.js");
const Posts = require("./posts.js");
const sr_client = new StarRail({defaultLanguage: "en", cacheDirectory: "./cache",  showFetchCacheLog: false });

// More so for testing and reading data from api, will be changed later to fetch a certain character and all their details
// Parameter: Character name, to match names in the character JSON array later.
// What it should return:
// Characters skill at all levels.
// Character eidolons
// Character Stats at specific levels
// Characters Traces
async function fetchCharacter(characterName, element) {
    try {
        const characters = await sr_client.getAllCharacters();
        // console.log(characters);  // Log the entire object
        // console.log(typeof characters);  // Log the type of the object
        // // If you want to check the type of a specific path or property:
        let character = null; // Current character is only March 7th, change to the name of the clicked character later

        character = characters.find(char => char.name.get() === characterName && char.combatType.name.get() === element);

        if (character === null) return [];

        // Get eidolons of character
        const eidolons = character.eidolons;
        const eidolonArray = [];
        eidolons.forEach((eidolon) => {
            eidolonArray.push(
                {
                    name: eidolon.name.get(),
                    description: eidolon.description.get()
                }
            )
        })

        const charArt = character.icon.url;
        const icon = character.splashImage.url; // Gets the image of the character to display on the frontend

        const descriptionArray = [{eidolons: eidolonArray, icon: icon,name: character.name.get(),characterDesc: character.description.get(), characterArt: charArt}];

        // Assuming `character` is already defined and contains skills
        character.skills.forEach((skill, index) => { // Iterates over all the 
            const skillType = skill.skillType === "Ultra" ? "Ultimate" : skill.skillType === "Maze" ? "Technique" : skill.skillType === "BPSkill" ? "Skill" : skill.skillType;
            const skillIconUrl = skill.skillIcon.url;
            const skillArray = 
                {
                    skillIndex: index + 1,
                    skillID: skill.id,
                    skillName: skill.name.get(),
                    skillType: skillType,
                    skillEffectType: skill.effectType,
                    skillIcon: skillIconUrl,
                    skillLevels: []
                };

            const maxLevel = skill.maxLevel; // The max level of the current skill
            for (let i = 0, level = 1; i < maxLevel; i++, level++) { // until level === maxLevel it will print the level variants of the skill
                let skillLevel = new SkillLevel(level, 0); // Constructs a skillLevel object to pass, level is the current level of the skill, and 0 for added levels.
                let leveledSkill = skill.getSkillByLevel(skillLevel); // leveledSkill gets the skill by the current skill level.

                skillArray.skillLevels.push({
                    level: level,
                    description: leveledSkill.description.getReplacedText()});
            }
            descriptionArray.push(skillArray);
        });
        return descriptionArray;
    } catch (error) {
        console.error("Error fetching characters:", error);
    }
}

// fetchCharacter("Welt", "Imaginary");

const testingChar = function() {
        const characters = sr_client.getAllCharacters();
        // // If you want to check the type of a specific path or property:
        let character = characters[0]; // Current character is only March 7th, change to the name of the clicked character later

        // character = characters.find(char => char.name.get() === characterName && char.combatType.name.get() === element);
        // console.log(character.eidolons[0].name.get());
        // console.log(character.eidolons[0].description.get());
        console.log(character.stars.toLocaleString());
        console.log(character._itemData);

         const serverUrl = "http://localhost:3000/static/"; // Change this to your server URL
        console.log("Full Item Icon URL: ", serverUrl + character._itemData.ItemIconPath);

}

// testingChar();

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
        const icon = character.splashImage.url; // Gets the image of the character to display on the frontend
        // Return an object with the name, element, and path
        return {
            name,
            element,
            path,
            icon
        };
    }).filter(character => character !== null); // Remove any null values if skipped

    // Return the new array with the relevant data
    return characterData;
}

// Star rail Child class of posts to post to the db.
const tablename = 'StarRailGuides';
class StarRailPosts extends Posts {
    post(db, tableName, character, username, postDetails, userId, postName, element, version, imagePath) {
        super.post(db, tablename, character, username, postDetails, userId, postName, element, version, imagePath);
    }

    getPosts(db, tableName, character, offset, limit) {
        return super.getPosts(db, tablename, character, offset, limit);
    }

    editPost(db, tableName, id, updatedData) {
        super.editPost(db, tablename, id, updatedData);
    }

    deletePost(db, tableName, id) {
        super.deletePost(db, tablename, id);
    }

    getYourPosts(db, tableName, character, userId, offset, limit) {
        return super.getYourPosts(db, tablename, character, userId, offset, limit);
    }
}

module.exports = {getCharacters, fetchCharacter, StarRailPosts};