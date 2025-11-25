📘 Task Manager API – README
📌 Overview

The Task Manager API is a backend system built using Node.js, Express.js, and PostgreSQL, designed to manage authenticated users and their personal task lists.
This project demonstrates core backend development concepts such as:

RESTful API design

JWT-based authentication

Database modeling & SQL queries

Error handling & validation

Unit testing with Jest

API documentation via Postman

This project was completed as an internship assessment task.

🛠️ Tech Stack

Node.js

Express.js

PostgreSQL (pg)

JWT Authentication

bcryptjs for password hashing

Joi for validation

Jest + Supertest for automated testing

Postman for API documentation

📂 Project Structure
task-manager-api/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   └── validation/
│       ├── authValidation.js
│       └── taskValidation.js
│
├── tests/
│   ├── auth.test.js
│   ├── tasks.test.js
│   └── setup.js
│
├── postman/
│   └── TaskManagerAPI.postman_collection.json
│
├── .env
├── package.json
├── README.md
└── LICENSE (optional)

⚙️ Features
🔐 Authentication

User registration

Secure login

Password encryption using bcrypt

JWT-based session management

Authorization middleware

📝 Task Management

Create tasks

View all tasks (with pagination & filtering)

View a single task

Update tasks

Delete tasks

Each user can only access their own tasks

🧪 Testing

8 automated tests using Jest & Supertest

Database reset before each test suite

📘 Documentation

Complete Postman collection included (/postman folder)

Environment variables and automatic token saving

🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/MZ-Mirzaan/task-manager-api.git
cd task-manager-api

2️⃣ Install Dependencies
npm install

3️⃣ Setup Environment Variables

Create a .env file in the project root:

PORT=5000
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/task_manager_api
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d


Update username/password accordingly.

4️⃣ Create PostgreSQL Database

In psql:

CREATE DATABASE task_manager_db;


Connect to the database:

\c task_manager_db


Create required tables:

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

5️⃣ Start the Server
npm run dev


Server will run at:

http://localhost:5000

🧪 Running Tests
npm test


Expected output:

PASS tests/auth.test.js
PASS tests/tasks.test.js
Test Suites: 2 passed
Tests:       8 passed

📮 Postman Documentation

A full Postman collection is included:

/postman/TaskManagerAPI.postman_collection.json

Includes:

All endpoints

Sample payloads

Automatic token saving

Environment variable support

Detailed usage instructions

Import the collection into Postman and set environment variables:

base_url = http://localhost:5000/api
token = (auto-filled after login)

📑 API Endpoints Summary
🔐 Auth
Method	Endpoint	Description
POST	/auth/register	Register new user
POST	/auth/login	Login and receive JWT
📝 Tasks (Requires: Authorization: Bearer <token>)
Method	Endpoint	Description
POST	/tasks	Create a task
GET	/tasks?page=&limit=&status=	List tasks (with filters)
GET	/tasks/:id	Get specific task
PUT	/tasks/:id	Update task
DELETE	/tasks/:id	Delete task
🛡️ Error Handling

This API includes a global error handler that returns consistent JSON:

{
  "message": "Error description"
}


Examples:

Missing token → 401 Unauthorized

Invalid token → 401 Unauthorized

Missing fields → 400 Bad Request

Not found → 404 Not Found

🧑‍💻 Author

Your Name
Backend Developer Intern Applicant
GitHub: https://github.com/MZ-Mirzaan

📝 License

This project is open-source under the MIT License.