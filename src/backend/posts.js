// Inherit base class related to posting guides for each game.
class Posts {
    // Parameters: 
    // db: the db object needed to post
    // tableName, name of the table to post to.
    // postDetails: The text of the post being made
    // username: username of the poster
    // userId: user ID of the poster
    post(db, tableName, character, username, postDetails, userId, postName, element, version) {
            db.all(`INSERT INTO StarRailGuides (name, username, postDetails, posterID, gameCharacter,
                charElement, gameVersion) 
                 VALUES (?, ?, ?, ?, ?, ?, ?);`, [postName, username, postDetails, userId, character, element, version], 
                 (err) => {
                    if (err) console.log("Could not make post", err);
                    else console.log("successfully uploaded");
                 })
    }

    // Parameters: 
    // db: the db object needed to post
    // tableName, name of the table to post to.
    // character: character to sort by, if null should get all posts
    // index: pagination index for frontend to prevent pulling whole db.
    getPosts(db, tableName, character, index) {
        return new Promise((resolve, reject) => {
            let params;
            let query;
            if (character === "") {
                query = `SELECT * FROM ${tableName} LIMIT ?`;
                params = [index];
            }
            else {
                query = `SELECT * FROM ${tableName} WHERE gameCharacter = ? AND id < ?`;
                params = [character, index];
            }
            db.all(query, params, (err, guides) => {
                if (err) reject("Could not get guides");
                else {
                    resolve(guides);
                }
            })
        })
    }

    getYourPosts(db, tableName, id) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM ${tableName} WHERE posterID = ?`, [id], (err, guides) => {
                if (err) reject("Could not get guides");
                else resolve(guides);
            })
        })
    }
}

module.exports = Posts; 