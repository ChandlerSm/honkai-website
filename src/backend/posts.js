// Inherit base class related to posting guides for each game.
class Posts {
    // Parameters: 
    // db: the db object needed to post
    // tableName, name of the table to post to.
    // postDetails: The text of the post being made
    // username: username of the poster
    // userId: user ID of the poster
    post(db, tableName, postDetails, username, userId) {
        console.log(`${username}(${userId}) posted ${postDetails} to ${tableName}`);
        // Insert SQL query to post to the db
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
                query = `SELECT * FROM ${tableName} WHERE id < ?`;
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
}

module.exports = Posts; 