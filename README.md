# 🚀 Task Manager API

A simple and secure **Task Manager REST API** built with **Node.js**, **Express.js**, and **PostgreSQL**.  
The API allows users to register, log in, and manage their personal tasks with **JWT authentication**, **validation**, and **proper access control**.

---

## 📌 Features

### 🔐 Authentication
- User registration  
- Secure login  
- Password hashing using **bcrypt**  
- JWT-based authentication middleware  

### 📝 Task Management
- Create tasks  
- View all tasks (with pagination & filtering)  
- View a single task  
- Update tasks  
- Delete tasks  
- Users can access **only their own tasks**

### 🧪 Testing
- 8 automated tests using **Jest + Supertest**  
- DB cleanup before each test suite  

### 📘 Documentation
- Complete **Postman collection** included  
- Automatic token saving script  
- Environment variable support  

---

## 🛠️ Tech Stack

- Node.js  
- Express.js  
- PostgreSQL (pg)  
- bcryptjs  
- JSON Web Tokens (JWT)  
- Joi (validation)  
- Jest & Supertest  
- Postman

---

## 📂 Project Structure

```
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
├── .env (ignored)
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/MZ-Mirzaan/task-manager-api.git
cd task-manager-api
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Variables  
Create a `.env` file in the project root:

```
PORT=5000
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/task_manager_api
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

### 4️⃣ Database Setup

In PostgreSQL shell:

```sql
CREATE DATABASE task_manager_db;
\c task_manager_db
```

Create tables:

```sql
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
```

### 5️⃣ Start the Server
```bash
npm run dev
```

---

## 🧪 Running Tests

```bash
npm test
```

Expected:
```
PASS tests/auth.test.js
PASS tests/tasks.test.js
Test Suites: 2 passed
Tests:       8 passed
```

---

## 📮 API Documentation (Postman)

A full Postman collection is included here:

```
(https://documenter.getpostman.com/view/50332286/2sB3dHXtiC)
```

### Environment Variables:
```
base_url = http://localhost:5000/api
token = (auto-filled after login)
```

### Automatic token saving (Login → Post-response script):
```js
let data = pm.response.json();
if (data.token) {
    pm.environment.set("token", data.token);
}
```

---

## 🔗 API Endpoints Summary

### 🔐 Auth
| Method | Endpoint           | Description       |
|--------|--------------------|-------------------|
| POST   | `/auth/register`   | Register user     |
| POST   | `/auth/login`      | Login, get token  |

### 📝 Tasks (Protected)
| Method | Endpoint               | Description          |
|--------|-------------------------|----------------------|
| POST   | `/tasks`                | Create task          |
| GET    | `/tasks`                | List tasks           |
| GET    | `/tasks/:id`            | Get task by ID       |
| PUT    | `/tasks/:id`            | Update task          |
| DELETE | `/tasks/:id`            | Delete task          |

---

## 🛡️ Error Handling

The API returns consistent JSON errors:

```json
{
  "message": "Error description here"
}
```

Examples:
- Missing token → `401 Unauthorized`
- Invalid data → `400 Bad Request`
- Resource not found → `404 Not Found`

---

## 👨‍💻 Author
**Mirzan Zuhair**  

GitHub: https://github.com/MZ-Mirzaan

---

## 📄 License
This project is open-source under the **MIT License**.
