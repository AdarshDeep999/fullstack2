# 📘 Student Management REST API using Spring Boot

This project demonstrates the implementation of a REST API using Spring Boot to perform CRUD (Create, Read, Update, Delete) operations on student data stored in a MySQL database.

---

## Technologies Used
Java, Spring Boot, Spring Data JPA (Hibernate), MySQL, Postman, Apache Tomcat (Embedded Server), Eclipse IDE

---

## Aim
To develop a RESTful web service that performs CRUD operations on student data using Spring Boot and MySQL.

---

## Project Workflow
Run the Spring Boot application → Create MySQL database → Create student table → Connect application to database → Perform CRUD operations using Postman → Verify data in database

---

## Running the Spring Boot Application
The application was run as a Java Application in Eclipse and the embedded Tomcat server started on port 8080.

<img width="1037" height="406" alt="Screenshot 2026-03-23 105301" src="https://github.com/user-attachments/assets/242ca71d-87e0-486f-9d73-11c241daafe7" />

---

## Database Creation
A database named **fullstack** was created.

CREATE DATABASE fullstack;
<img width="383" height="477" alt="Screenshot 2026-03-23 103656" src="https://github.com/user-attachments/assets/9a4e6f2d-e41f-4e7f-8ad8-7faeb3ab9583" />




---

## Table Creation
A table named **student** was created.

CREATE TABLE student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

Table Structure:
<img width="1015" height="566" alt="Screenshot 2026-03-23 103644" src="https://github.com/user-attachments/assets/745c77d7-51bc-4514-b91a-8c097588956b" />




## CRUD Operations
<img width="203" height="121" alt="Screenshot 2026-03-23 102859" src="https://github.com/user-attachments/assets/2238d05e-fef6-41f8-b50f-fb3077e6fc6c" />

### CREATE (POST)
POST http://localhost:8080/api/students  

<img width="1266" height="700" alt="Screenshot 2026-03-23 103055" src="https://github.com/user-attachments/assets/a2395fdf-3e38-42cf-a659-956fe518390d" />

### READ (GET)

GET ALL:
GET http://localhost:8080/api/students  

<img width="1266" height="806" alt="Screenshot 2026-03-23 103023" src="https://github.com/user-attachments/assets/5f6c5b32-c9cf-4e4c-adab-c96ecc0aa664" />

<img width="435" height="383" alt="Screenshot 2026-03-23 103002" src="https://github.com/user-attachments/assets/c8f06a2e-01fa-4632-8b1e-93c7cef29bba" />


<img width="435" height="383" alt="Screenshot 2026-03-23 103002" src="https://github.com/user-attachments/assets/78017dc0-0f92-4404-809b-c8dec49b28e4" />


### UPDATE (PUT)
PUT http://localhost:8080/api/students/1  

Request Body:
{
  "name": "Updated Name",
  "email": "updated@gmail.com"
}

<img width="1287" height="638" alt="Screenshot 2026-03-23 103232" src="https://github.com/user-attachments/assets/8453d844-e4b2-423b-8426-5ba7a08f202b" />


---

### DELETE (DELETE)
DELETE http://localhost:8080/api/students/1  

<img width="1270" height="713" alt="Screenshot 2026-03-23 103304" src="https://github.com/user-attachments/assets/1473238e-3919-4645-b5fa-83122cd0e420" />


---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/students      | Create student |
| GET    | /api/students      | Get all students |
| GET    | /api/students/{id} | Get student by ID |
| PUT    | /api/students/{id} | Update student |
| DELETE | /api/students/{id} | Delete student |

---

## Result
The REST API was successfully implemented and tested. All CRUD operations were performed and verified using Postman and MySQL database.

---

## Learning Outcome
Learned REST API development, Spring Boot integration, MySQL connectivity, JPA usage, and API testing using Postman.

---
