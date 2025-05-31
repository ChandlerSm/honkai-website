// Inherit base class related to posting guides for each game.
class Posts {
    // Parameters: 
    // db: the db object needed to post
    // tableName, name of the table to post to.
    // postDetails: The text of the post being made
    // username: username of the poster
    // userId: user ID of the poster
    post(db, tableName, character, username, postDetails, userId, postName, element, version, imagePath) {
            db.all(`INSERT INTO StarRailGuides (name, username, postDetails, posterID, gameCharacter,
                charElement, gameVersion, imagePath) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?);`, [postName, username, postDetails, userId, character, element, version, imagePath], 
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
    getPosts(db, tableName, character, offset, limit) {
        return new Promise((resolve, reject) => {
            let params;
            let query;
            if (character === "") {
                query = `SELECT * FROM ${tableName} ORDER BY creationDate DESC LIMIT ? OFFSET ?`;
                params = [limit, offset];
            }
            else {
                query = `SELECT * FROM ${tableName} WHERE gameCharacter = ? ORDER BY creationDate DESC LIMIT ? OFFSET ?`;
                params = [character, limit, offset];
            }
            db.get(`SELECT COUNT(*) as total FROM ${tableName}`, (err, countResult) => {
                if (err) {
                    reject(err);
                } else {
                    const totalPosts = countResult.total; // Total number of posts
                    const totalPages = Math.ceil(totalPosts / limit); // Calculate total pages
                    
                db.all(query, params, (err, guides) => {
                    if (err) reject("Could not get guides");
                    else {
                        resolve({guides, totalPages});
                    }
                })
            }
        })
    })
    }

    editPost(db, tableName, id, updatedData) {
        db.run(`UPDATE ${tableName} SET postDetails = ? WHERE id = ?`, [updatedData, id], (err) => {
            if (err) return console.log("Could not update post", err);
            console.log("Updated post");
        })
    }

    deletePost(db, tableName, id) {
        db.all(`DELETE FROM ${tableName} WHERE id = ?`, [id], (err) => {
            if (err) return console.log("Could not delete post: ", err);
            console.log("Successfully deleted post");
        })
    }

    getYourPosts(db, tableName, character, id, offset, limit) {
        return new Promise((resolve, reject) => {
            let params;
            let query;
                if (character === "") {
                query = `SELECT * FROM ${tableName} WHERE posterID = ? ORDER BY creationDate DESC LIMIT ? OFFSET ?`;
                params = [id, limit, offset];
            } else {
                query = `SELECT * FROM ${tableName} WHERE gameCharacter = ? AND posterID = ? ORDER BY creationDate DESC LIMIT ? OFFSET ?`;
                params = [character, id, limit, offset];
            }
    
            const countQuery = character === "" 
                ? `SELECT COUNT(*) as total FROM ${tableName} WHERE posterID = ?`
                : `SELECT COUNT(*) as total FROM ${tableName} WHERE gameCharacter = ? AND posterID = ?`;
    
            const countParams = character === "" ? [id] : [character, id];
    
            db.get(countQuery, countParams, (err, countResult) => {
                if (err) {
                    reject(err);
                } else {
                    const totalPosts = countResult.total; 
                    const totalPages = Math.ceil(totalPosts / limit); 
    
                    db.all(query, params, (err, guides) => {
                        if (err) {
                            reject("Could not get guides");
                        } else {
                            resolve({ guides, totalPages });
                        }
                    });
                }
            });
        });
    }
    
}

module.exports = Posts; 