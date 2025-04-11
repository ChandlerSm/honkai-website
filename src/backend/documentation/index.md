```markdown
# API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication

### JWT Authentication
All endpoints that deal with user-specific data or sensitive operations require a valid JWT token. The token should be sent in the `Authorization` header as a Bearer token.

Example:
```bash
Authorization: Bearer <your-jwt-token>
```

---

## User Endpoints

### 1. Create User
- **Method**: `POST`
- **Endpoint**: `/user/create`
- **Description**: Creates a new user with the provided username and password. The password is hashed before storing.
- **Request Body**:
  ```json
  {
    "username": "exampleUser",
    "password": "examplePassword"
  }
  ```
- **Response**:
  - **200 OK**: User created successfully.
    ```json
    {
      "message": "created user successfully"
    }
    ```
  - **500 Internal Server Error**: If there is an issue with the server.
    ```json
    {
      "message": "Internal Server Error",
      "error": "<error-message>"
    }
    ```

### 2. User Login
- **Method**: `POST`
- **Endpoint**: `/user/login`
- **Description**: Logs in a user by verifying their credentials (username and password) and returns a JWT token if the login is successful.
- **Request Body**:
  ```json
  {
    "username": "exampleUser",
    "password": "examplePassword"
  }
  ```
- **Response**:
  - **200 OK**: Successful login with access token.
    ```json
    {
      "message": "Successful login",
      "accessToken": "<jwt-token>"
    }
    ```
  - **401 Unauthorized**: Invalid login credentials.
    ```json
    "Invalid Login Information"
    ```
  - **500 Internal Server Error**: If there is an error during login.
    ```json
    {
      "message": "Internal Server Error",
      "error": "<error-message>"
    }
    ```

---

## Genshin Impact Endpoints

### 3. Post Guide (Genshin Impact)
- **Method**: `POST`
- **Endpoint**: `/Genshin-Impact/postGuide`
- **Description**: Posts a new guide for Genshin Impact.
- **Authentication**: Requires a valid JWT token.
- **Request Body**:
  - **Required**: None, the guide will be posted under the authenticated user's username.
- **Response**:
  - **200 OK**: Guide posted successfully.
    ```json
    {
      "message": "Guide posted successfully"
    }
    ```
  - **500 Internal Server Error**: If there is an issue with posting the guide.
    ```json
    {
      "message": "Could not post",
      "error": "<error-message>"
    }
    ```

---

## Star Rail Endpoints

### 4. Get Characters (Star Rail)
- **Method**: `GET`
- **Endpoint**: `/Star-Rail/characters`
- **Description**: Retrieves a list of all characters along with their names, elements, and paths in Star Rail.
- **Response**:
  - **200 OK**: A list of all characters.
    ```json
    {
      "characters": [
        {
          "name": "Character Name",
          "element": "Element",
          "path": "Path"
        }
      ]
    }
    ```
  - **404 Not Found**: If no characters are found.
    ```json
    {
      "message": "No characters found"
    }
    ```
  - **500 Internal Server Error**: If there is an issue with retrieving the characters.
    ```json
    {
      "message": "Internal Server Error",
      "error": "<error-message>"
    }
    ```

### 5. Post Guide (Star Rail)
- **Method**: `POST`
- **Endpoint**: `/v1/Star-Rail/postGuide`
- **Description**: Posts a new guide for Star Rail, including details like post name, character, element, and version.
- **Authentication**: Requires a valid JWT token.
- **Request Body**:
  ```json
  {
    "postName": "Post Title",
    "character": "Character Name",
    "element": "Element",
    "version": "Version Number",
    "details": "Guide Details"
  }
  ```
- **Response**:
  - **200 OK**: Guide posted successfully.
    ```json
    {
      "message": "Guide posted successfully"
    }
    ```
  - **500 Internal Server Error**: If there is an issue with posting the guide.
    ```json
    {
      "message": "Could not upload to server",
      "error": "<error-message>"
    }
    ```

### 6. Get Guides (Star Rail)
- **Method**: `GET`
- **Endpoint**: `/v1/Star-Rail/Guides`
- **Description**: Retrieves a list of guides for a specific character in Star Rail.
- **Request Parameters**:
  - **character**: The name of the character to filter the guides.
- **Response**:
  - **200 OK**: A list of guides.
    ```json
    {
      "message": "Got guide list",
      "guideList": [
        {
          "postName": "Guide Title",
          "details": "Guide Details"
        }
      ]
    }
    ```
  - **404 Not Found**: If no guides are found.
    ```json
    {
      "message": "Could not get guide list",
      "error": "<error-message>"
    }
    ```

### 7. Get User Posts (Star Rail)
- **Method**: `GET`
- **Endpoint**: `/v1/userPosts`
- **Description**: Retrieves all posts made by the authenticated user.
- **Authentication**: Requires a valid JWT token.
- **Response**:
  - **200 OK**: A list of the user’s posts.
    ```json
    {
      "message": "Got your posts!",
      "guidesList": [
        {
          "postName": "Guide Title",
          "details": "Guide Details"
        }
      ]
    }
    ```
  - **404 Not Found**: If no posts are found.
    ```json
    {
      "message": "Could not find data",
      "error": "<error-message>"
    }
    ```

---

## Server Configuration

- **Port**: `3000`
- **Database**: SQLite, located at `./database/database.db`
- **Required Environment Variables**:
  - `ACCESS_SECRET_TOKEN`: Secret key for signing JWT tokens.

---

### Conclusion
This API allows users to manage accounts (create and log in), post guides for Genshin Impact and Star Rail, and view character and guide information. JWT authentication is required for all endpoints that deal with user-specific data.
```