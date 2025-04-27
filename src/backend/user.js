const express = require("express");
const app = new express();
      const createUser = async (db, username, hashedPassword) => {
        try {
            const userExists = await checkIfUserExists(db, username);
            if (userExists) {
                console.log("User already exists");
                return -1;  
            }

            await db.run("INSERT INTO user (username, password) VALUES (?, ?)", [username, hashedPassword]);
            console.log("User added successfully");
            return 1;
            // const users = await getAllUsers(db);
            // console.log("All users:", users);
        } catch (err) {
                console.error("Could not create user:", err.message);
                return -1;
        }
    };

    const checkIfUserExists = async (db, username) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT 1 FROM user WHERE username = ?", [username], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row !== undefined); // If row is undefined, the user doesn't exist
                }
            });
        });
    };

    // FOR TESTING ONLY
    const getAllUsers = (db, callback) => {
        db.all("SELECT * FROM user", (err, row) => {
            if (err) {
                console.log("Could not find users");
                callback(null);
            }
            else {
                callback(row);
            }
        })
    }

    const deleteUser = (db, id, username) => {
        db.all('DELETE FROM user WHERE id = ? AND username = ?', [id, username], (err) => {
            if (err) {
                console.log("Could not delete user", err);
            } 
            else {
                console.log(`Deleted user: ${username} (${id})`);
            }
        })
    }

module.exports = {createUser, deleteUser};