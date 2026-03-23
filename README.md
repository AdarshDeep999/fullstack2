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





## CRUD Operations

### CREATE (POST)
POST http://localhost:8081/api/students  

![POST](https://github.com/AdarshDeep999/fullstack2/blob/068b60716429441de13e91f7757736bec6a81b2f/Screenshot%202026-03-23%20134542.png)

### READ (GET)

GET ALL:
GET http://localhost:8081/api/students  

![GET](https://github.com/AdarshDeep999/fullstack2/blob/068b60716429441de13e91f7757736bec6a81b2f/Screenshot%202026-03-23%20134629.png)


### UPDATE (PUT)
![PUT](https://github.com/AdarshDeep999/fullstack2/blob/068b60716429441de13e91f7757736bec6a81b2f/Screenshot%202026-03-23%20135117.png)


---

### DELETE (DELETE)
DELETE http://localhost:8081/api/students/1  

![DELETE](https://github.com/AdarshDeep999/fullstack2/blob/068b60716429441de13e91f7757736bec6a81b2f/Screenshot%202026-03-23%20134647.png)


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
