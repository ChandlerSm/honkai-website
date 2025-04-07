const express = require("express");
const app = new express();
  
  // Create a user and then return all users, for testing
    const createUser = (db, username, hashedPassword) => {
    db.all("INSERT INTO user (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
        if (err) {
            if (err.message.includes("UNIQUE")) {
                return console.log("User Already Exists");
            }
            return console.log("Could not create user", err.message)
        }
        else {
        console.log("Added user");
        getAllUsers(db, (users) => {
            console.log(users);
        });
        }
    });
    }

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

module.exports = {createUser};