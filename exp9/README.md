# JWT Authentication using Spring Boot

## Overview

This project demonstrates a simple **JWT (JSON Web Token) authentication system** built with **Spring Boot, Spring Security, JPA, and MySQL**.

The application allows users to log in with a username and password. If the credentials are valid, the server generates a **JWT token**, which can be used for authentication in future requests.

---

## Technologies Used

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* MySQL
* JWT (io.jsonwebtoken)
* Maven

---

## Project Structure

```
src/main/java/com/AIML3A/JWTAuth
│
├── config
│   └── SecurityConfig.java
│
├── controller
│   └── AuthController.java
│
├── model
│   └── User.java
│
├── repository
│   └── UserRepository.java
│
├── security
│   └── JwtUtil.java
│
├── service
│   └── AuthService.java
│
└── JwtAuthApplication.java
```

---

## Database Setup

Create the database in MySQL:

```sql
CREATE DATABASE jwtauth;
USE jwtauth;
```

Insert a sample user:

```sql
INSERT INTO users (username, password)
VALUES ('admin', 'admin');
```

Check tables:

```sql
SHOW TABLES;
SELECT * FROM users;
```

---

## Configure Database Connection

Edit `application.properties`:

```
spring.datasource.url=jdbc:mysql://localhost:3306/jwtauth
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## Running the Application

Run the main class:

```
JwtAuthApplication.java
```

Server starts on:

```
http://localhost:8080
```

---

## API Endpoints

### 1. Test Endpoint

**GET**

```
http://localhost:8080/api/hello
```

Response:

```
Hello! JWT Authentication Successful
```

---

### 2. Login API

**POST**

```
http://localhost:8080/api/login
```

Parameters (x-www-form-urlencoded):

```
username=admin
password=admin
```

Response:

```
JWT Token
```

Example:

```
eyJhbGciOiJIUzI1NiJ9...
```

---

## How JWT Works in this Project

1. User sends username and password to `/api/login`
2. Server validates credentials from the database
3. If valid, a JWT token is generated
4. Token can be used for authentication in secured APIs

---

## Sample JWT Utility

The project uses `io.jsonwebtoken` to generate tokens.

Token contains:

* Subject (username)
* Issued time
* Expiration time

Token validity: **1 hour**

Screenshots:
## Screenshots


![Project Running](Screenshots/Screenshot%202026-03-30%20135951.png)


![API Test](Screenshots/Screenshot%202026-03-30%20140437.png)


![Database Users Table](Screenshots/Screenshot%202026-03-30%20140608.png)


![JWT Token](Screenshots/Screenshot%202026-03-30%20140854.png)