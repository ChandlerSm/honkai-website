// Inherit base class related to posting guides for each game.
// Parameters: 
// db: the db object needed to post
// tableName, name of the table to post to.
// postDetails: The text of the post being made
// username: username of the poster
// userId: user ID of the poster
class Posts {
    post(db, tableName, postDetails, username, userId) {
        console.log(`${username}(${userId}) posted ${postDetails} to ${tableName}`);
        // Insert SQL query to post to the db
    }
}

module.exports = Posts; 