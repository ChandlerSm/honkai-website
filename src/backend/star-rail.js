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

        // console.log("eidolon array:", eidolonArray);

        // console.log(character);
        // console.log(character.description.get()); 
        const charArt = character.icon.url;

        // console.log("Character Image:", charArt);
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
                }
            ;
            // console.log(`Skill ${index + 1}:`); // Skill index
            // console.log("Skill ID:", skill.id); // Skill ID
            // console.log("Skill Name:", skill.name.get()); // Skill name
            // const skillType = skill.skillType === "Ultra" ? "Ultimate" : skill.skillType === "Maze" ? "Technique" : skill.skillType === "BPSkill" ? "Skill" : skill.skillType;
            //  console.log("Skill Type:", skillType); // skill type
            // console.log("Skill Effect Type:", skill.effectType); // skill effect type
            // const skillIconUrl = skill.skillIcon.url;
            // console.log("Skill Icon URL:", skillIconUrl);
            const maxLevel = skill.maxLevel; // The max level of the current skill
            for (let i = 0, level = 1; i < maxLevel; i++, level++) { // until level === maxLevel it will print the level variants of the skill
                let skillLevel = new SkillLevel(level, 0); // Constructs a skillLevel object to pass, level is the current level of the skill, and 0 for added levels.
                let leveledSkill = skill.getSkillByLevel(skillLevel); // leveledSkill gets the skill by the current skill level.
                // console.log("Leveled Skill Description:", leveledSkill.description.getReplacedText()); // Will log the description of the current skill and it's level variant.
                // skillByLevel.push(leveledSkill.description.getReplacedText());
                skillArray.skillLevels.push({
                    level: level,
                    description: leveledSkill.description.getReplacedText()});
            }
            descriptionArray.push(skillArray);
            // console.log(descriptionArray);

        // // Create a SkillLevel object for a specific level (e.g., level 3 with no extra points).
        // const skillLevel = new SkillLevel(1, 0);

        // // Fetch the skill at that level.
        // const leveledSkill = firstSkill.getSkillByLevel(skillLevel);

        // // Log the details of the leveled skill.
        // console.log("Leveled Skill ID:", leveledSkill.id);
        // console.log("Leveled Skill Name:", leveledSkill.name.get());
        // console.log("Leveled Skill Description:", leveledSkill.description.getReplacedText());
        // console.log("Leveled Skill Effect Type:", leveledSkill.effectType);
        // console.log("Leveled Skill Type:", leveledSkill.skillType);
        });
        // console.log(JSON.stringify(descriptionArray, null, 2));
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

testingChar();

// Initialize cache directory, kind of bricks the whole thing, so cache doesn't really work that well.
// sr_client.cachedAssetsManager.cacheDirectorySetup();

// // Fetch the content to populate the cache
// sr_client.cachedAssetsManager.fetchAllContents()
//   .then(() => {
//     console.log("Cache updated successfully!");
//     const characters = sr_client.getAllCharacters();
//     console.log(characters);
//   })
//   .catch((error) => {
//     console.error("Error updating cache:", error);
//   });

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
    post(db, tableName, character, username, postDetails, userId, postName, element, version) {
        super.post(db, tablename, character, username, postDetails, userId, postName, element, version);
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