```markdown
# star-rail.js API Documentation

This file contains the logic for interacting with the StarRail API and managing Star Rail character and guide data.

## Overview
The `star-rail.js` file provides functions to fetch character data from the StarRail API and a class to manage posting and retrieving guides related to Star Rail characters. It leverages the `StarRail` client to fetch character information and a `StarRailPosts` class that extends the `Posts` class to handle database interactions related to guides.

## Dependencies
- `starrail.js`: A client library for interacting with the Star Rail API.
- `posts.js`: A custom module for handling posts (inherited by the `StarRailPosts` class).

---

## **Functions**

### 1. `getCharacters()`
- **Description**: Fetches all characters from the StarRail API, filters out characters with the nickname `{NICKNAME}`, and returns a list of relevant data for each character, including their name, element, and path.
- **Returns**: `Array` of objects containing character data. Each object includes:
  - `name`: The name of the character.
  - `element`: The character's combat type (e.g., Ice, Fire).
  - `path`: The character's path (e.g., Destruction, Harmony).

**Example**:
```js
const characters = getCharacters();
console.log(characters);
```

### 2. `StarRailPosts`
- **Description**: A class that extends `Posts` to manage the posting and retrieval of Star Rail guides. This class handles interactions with the database for Star Rail-specific guides.
  
#### **Methods:**

##### 2.1 `post(db, tableName, character, username, postDetails, userId, postName, element, version)`
- **Description**: Posts a new Star Rail guide to the database.
- **Parameters**:
  - `db`: The database instance.
  - `tableName`: The table to insert the data into (uses `StarRailGuides` by default).
  - `character`: The name of the character related to the guide.
  - `username`: The name of the user submitting the guide.
  - `postDetails`: Details or content of the guide.
  - `userId`: The ID of the user submitting the guide.
  - `postName`: The title of the guide.
  - `element`: The element type associated with the character.
  - `version`: The version of the guide.
  
- **Example**:
```js
const starRailPost = new StarRailPosts();
starRailPost.post(db, 'StarRailGuides', 'Himeko', 'user123', 'Guide content...', 1, 'Star Rail Guide', 'Fire', '1.0');
```

##### 2.2 `getPosts(db, tableName, character, index)`
- **Description**: Retrieves a list of Star Rail guides from the database based on a character and pagination index.
- **Parameters**:
  - `db`: The database instance.
  - `tableName`: The table to query from (uses `StarRailGuides` by default).
  - `character`: The name of the character related to the guides.
  - `index`: The pagination index (e.g., start from a certain guide).
  
- **Returns**: `Array` of guide objects related to the specified character.

- **Example**:
```js
const starRailPost = new StarRailPosts();
const guides = starRailPost.getPosts(db, 'StarRailGuides', 'Himeko', 0);
console.log(guides);
```

##### 2.3 `getYourPosts(db, tableName, userId)`
- **Description**: Retrieves all guides submitted by a specific user based on their `userId`.
- **Parameters**:
  - `db`: The database instance.
  - `tableName`: The table to query from (uses `StarRailGuides` by default).
  - `userId`: The ID of the user whose posts are to be retrieved.
  
- **Returns**: `Array` of guide objects created by the specified user.

- **Example**:
```js
const starRailPost = new StarRailPosts();
const userGuides = starRailPost.getYourPosts(db, 'StarRailGuides', 1);
console.log(userGuides);
```

#### 2.4 `deletePost(db, tableName, id)`
- **Description**: Deletes a specific post at an id, usuable only on posts made by the user.
- **Parameters**:
  - `db`: The database instance.
  - `tableName`: The table to query from (uses `StarRailGuides` by default).
  - `id`: The ID of the user whose posts are to be retrieved.

- **Example**:
```js
const starRailPost = new StarRailPosts();
const userGuides = starRailPost.deletePost(db, 'StarRailGuides', 1);
console.log(userGuides);
```

#### 2.4 `editPost(db, tableName, id, updatedData)`
- **Description**: Edits a specific post at an id, usuable only on posts made by the user.
- **Parameters**:
  - `db`: The database instance.
  - `tableName`: The table to query from (uses `StarRailGuides` by default).
  - `id`: The ID of the user whose posts are to be retrieved.
  - `updatedData`: The data that you want to update, be it post details, post name, post character.

- **Example**:
```js
const starRailPost = new StarRailPosts();
const userGuides = starRailPost.editPost(db, 'StarRailGuides', 1, {"postDetails": "updated details"});
console.log(userGuides);
```

---

## **Exports**
- **getCharacters**: A function that retrieves a list of all characters from the StarRail API.
- **StarRailPosts**: A class that handles posting and retrieving Star Rail guides from the database.

**Example Usage**:
```js
const { getCharacters, StarRailPosts } = require('./star-rail.js');

const characters = getCharacters();
console.log(characters);

const starRailPost = new StarRailPosts();
starRailPost.post(db, 'StarRailGuides', 'Himeko', 'user123', 'Guide content...', 1, 'Star Rail Guide', 'Fire', '1.0');
```

---

## **Notes**
- Ensure the StarRail API client (`StarRail` from `starrail.js`) is properly initialized and connected to the API.
- The `StarRailPosts` class inherits methods from the `Posts` class, allowing it to interact with a database for guide storage and retrieval.
- The `getCharacters` function filters out any characters that are tagged with the nickname `{NICKNAME}` before returning data.

---

This documentation describes the functions and classes in the `star-rail.js` file. It provides a clear explanation of how to interact with the Star Rail API and manage related guides in your database.
```