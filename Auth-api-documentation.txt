**Authentication API Documentation**

---

## **1. Register User**
**Endpoint:** `POST /api/auth/register`

**Description:** Registers a new user in the system.

### **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "role": "admin" // or "teacher", "student"
}
```

### **Response:**
**Success (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully"
}
```
**Error Responses:**
- 409 Conflict - User already exists

---

## **2. Login User**
**Endpoint:** `POST /api/auth/login`

**Description:** Logs in a user and returns an access token.

### **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### **Response:**
**Success (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "Id": "67d0481290ff5acf65d25e6c",
      "email": "user@example.com",
      "role": "admin"
    },
    "token": "access_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```
**Error Responses:**
- 401 Unauthorized - Invalid credentials
- 404 Not Found - User not found

---

## **3. Verify OTP (For Admin 2FA Login)**
**Endpoint:** `POST /api/auth/verify-otp`

**Description:** Verifies OTP sent to the admin's email.

### **Request Body:**
```json
{
  "email": "admin@example.com",
  "otp": "123456"
}
```

### **Response:**
**Success (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "OTP verified successfully",
  "data": {
    "token": "new_access_token_here"
  }
}
```
**Error Responses:**
- 401 Unauthorized - Invalid or expired OTP

---

## **4. Refresh Token**
**Endpoint:** `POST /api/auth/refresh`

**Description:** Generates a new access token using a refresh token.

### **Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

### **Response:**
**Success (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Access token refreshed",
  "data": {
    "token": "new_access_token_here"
  }
}
```
**Error Responses:**
- 401 Unauthorized - Invalid or expired refresh token

---

## **5. Logout User**
**Endpoint:** `POST /api/auth/logout`

**Description:** Logs out a user by deleting their refresh token from Redis.

### **Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

### **Response:**
**Success (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged out successfully"
}
```
**Error Responses:**
- 400 Bad Request - Refresh token required

---

## **6. Get User Profile**
**Endpoint:** `GET /api/auth/profile`

**Description:** Retrieves the authenticated user's profile.

### **Headers:**
```json
{
  "Authorization": "Bearer access_token_here"
}
```

### **Response:**
**Success (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "Id": "67d0481290ff5acf65d25e6c",
    "email": "user@example.com",
    "role": "admin"
  }
}
```
**Error Responses:**
- 401 Unauthorized - Missing or invalid token

