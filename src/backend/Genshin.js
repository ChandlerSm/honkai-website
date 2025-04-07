const Posts = require("./posts.js");

// Child class of posts to post to the db.
class GenshinPosts extends Posts {
    post(db, tableName, postDetails, username, userId) {
        const tablename = "GenshinPosts";
        super.post(db, tablename, postDetails, username, userId);
    }
}

// const GenshinPosts1 = new GenshinPosts();
// GenshinPosts1.post("db", "", "details", "username", 1);

module.exports = GenshinPosts;