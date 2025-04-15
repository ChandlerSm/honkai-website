```markdown
# posts.js API Documentation

This file contains the base class `Posts` used for posting and retrieving game-related guides. It includes methods to interact with the database for posting new guides, retrieving guides by character, and fetching all the posts made by a specific user.

---

## Overview

The `Posts` class provides functionality for:
- Posting guides to a database.
- Retrieving guides from a database by character.
- Fetching a user's own posted guides.
- Editing and deleting posts.

## **Class: Posts**

### 1. `post(db, tableName, character, username, postDetails, userId, postName, element, version)`
- **Description**: Posts a new guide to the specified database table. It inserts the guide's name, details, the username of the poster, user ID, character name, element type, and game version.
- **Parameters**:
  - `db`: The database object needed to post data.
  - `tableName`: The name of the table to post the data to (e.g., `StarRailGuides`).
  - `character`: The character related to the guide.
  - `username`: The username of the person posting the guide.
  - `postDetails`: The textual content of the guide.
  - `userId`: The ID of the user posting the guide.
  - `postName`: The name/title of the guide.
  - `element`: The character’s element (e.g., Fire, Ice, etc.).
  - `version`: The version of the game the guide pertains to.

- **Example**:
  ```js
  const postInstance = new Posts();
  postInstance.post(db, 'StarRailGuides', 'Himeko', 'user123', 'Guide content...', 1, 'Star Rail Guide', 'Fire', '1.0');
  ```

- **Response**:
  - Logs the success message `successfully uploaded` if the guide is posted successfully.
  - Logs `Could not make post` if an error occurs during the posting process.

### 2. `getPosts(db, tableName, character, index)`
- **Description**: Retrieves a list of guides from the specified database table, optionally filtering by character. Pagination is handled by the `index` parameter to avoid fetching the entire database at once.
- **Parameters**:
  - `db`: The database object needed to fetch data.
  - `tableName`: The name of the table from which to fetch data (e.g., `StarRailGuides`).
  - `character`: The character related to the guides to fetch. If `null`, it fetches all guides.
  - `index`: Pagination index used to limit the number of results returned (e.g., to prevent pulling the entire database).
  
- **Returns**: A Promise that resolves to an array of guide objects.

- **Example**:
  ```js
  const postInstance = new Posts();
  postInstance.getPosts(db, 'StarRailGuides', 'Himeko', 10)
    .then(guides => console.log(guides))
    .catch(error => console.error(error));
  ```

- **Response**:
  - Resolves with the list of guides.
  - Rejects with the message `Could not get guides` if an error occurs.

### 3. `getYourPosts(db, tableName, id)`
- **Description**: Retrieves all the guides posted by a specific user, identified by their `userId`.
- **Parameters**:
  - `db`: The database object needed to fetch data.
  - `tableName`: The name of the table from which to fetch data (e.g., `StarRailGuides`).
  - `id`: The ID of the user whose posts are to be fetched.

- **Returns**: A Promise that resolves to an array of guides posted by the user.

- **Example**:
  ```js
  const postInstance = new Posts();
  postInstance.getYourPosts(db, 'StarRailGuides', 1)
    .then(userGuides => console.log(userGuides))
    .catch(error => console.error(error));
  ```

- **Response**:
  - Resolves with the list of the user's guides.
  - Rejects with the message `Could not get guides` if an error occurs.

### 4. `editPost(db, tableName, id, updatedData)`
- **Description**: Edits an existing post by updating the `postDetails` for a specified row in the database.
- **Parameters**:
  - `db`: The database object used to update the data.
  - `tableName`: The name of the table to update data in (e.g., `StarRailGuides`).
  - `id`: The unique ID of the post to update.
  - `updatedData`: The new content for the `postDetails` field.

- **Example**:
  ```js
  const postInstance = new Posts();
  postInstance.editPost(db, 'StarRailGuides', 1, 'Updated guide content');
  ```

- **Response**:
  - Logs `Updated post` if the post is successfully updated.
  - Logs `Could not update post` if an error occurs during the update process.

### 5. `deletePost(db, tableName, id)`
- **Description**: Deletes a post from the specified table in the database based on the given `id`.
- **Parameters**:
  - `db`: The database object used to delete the post.
  - `tableName`: The name of the table to delete data from (e.g., `StarRailGuides`).
  - `id`: The unique ID of the post to delete.

- **Example**:
  ```js
  const postInstance = new Posts();
  postInstance.deletePost(db, 'StarRailGuides', 1);
  ```

- **Response**:
  - Logs `Successfully deleted post` if the post is deleted successfully.
  - Logs `Could not delete post` if an error occurs during the deletion process.

---

## **Usage Example**

```js
const Posts = require('./posts.js');
const db = require('some-database-connection'); // Your database connection

const postInstance = new Posts();

// Posting a new guide
postInstance.post(db, 'StarRailGuides', 'Himeko', 'user123', 'Guide content...', 1, 'Star Rail Guide', 'Fire', '1.0');

// Fetching guides by character
postInstance.getPosts(db, 'StarRailGuides', 'Himeko', 10)
  .then(guides => console.log(guides))
  .catch(error => console.error(error));

// Fetching a user's own posts
postInstance.getYourPosts(db, 'StarRailGuides', 1)
  .then(userGuides => console.log(userGuides))
  .catch(error => console.error(error));

// Editing an existing post
postInstance.editPost(db, 'StarRailGuides', 1, 'Updated guide content');

// Deleting a post
postInstance.deletePost(db, 'StarRailGuides', 1);
```

---

## **Notes**
- The `post()` method assumes the `StarRailGuides` table exists in the database. Adjust the table name if using a different table.
- The database query strings in `getPosts()` and `getYourPosts()` rely on the structure of the `StarRailGuides` table, including fields like `gameCharacter`, `posterID`, and `gameVersion`.
- The pagination mechanism ensures that only a subset of posts is fetched at once, improving performance when the number of posts is large.

---

## **Exports**
- **Posts**: The main class responsible for posting and retrieving guides.

```js
module.exports = Posts;
```

---