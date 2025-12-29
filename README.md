# Control Room - Backend API

## 📖 Project Overview
This is the server-side application for the Control Room User Management System. It implements a RESTful API with secure authentication, role-based authorization, and database management for user accounts. [cite_start]It is built to handle user lifecycles, including creation, updates, and administrative status controls[cite: 17, 31].

**Live API Base URL:** https://control-room-backend.onrender.com  
[cite_start]**API Documentation:** [Link to Postman Collection/Swagger] [cite: 147]

## 🚀 Tech Stack
* **Runtime:** Node.js
* [cite_start]**Framework:** Express.js [cite: 23]
* [cite_start]**Database:** MongoDB Atlas (Cloud-hosted) [cite: 24, 136]
* [cite_start]**Authentication:** JWT (JSON Web Tokens) [cite: 26]
* [cite_start]**Security:** Bcrypt (Password Hashing), CORS, Helmet [cite: 27, 130]
* [cite_start]**Deployment:** Render [cite: 28]

## 🔐 Security & Architecture
* [cite_start]**Password Hashing:** Uses `bcrypt` to salt and hash passwords before storage[cite: 53].
* [cite_start]**JWT Authentication:** Stateless authentication strategies using Bearer tokens[cite: 128].
* [cite_start]**RBAC Middleware:** Custom middleware to verify `admin` vs `user` roles before granting access to sensitive endpoints[cite: 55].
* [cite_start]**Validation:** Input validation on all API endpoints to prevent malformed data injection[cite: 56].

## 🛠️ Setup Instructions

### Prerequisites
* Node.js (v18+)
* MongoDB Connection URI (Atlas)

### Installation
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/control-room.git](https://github.com/your-username/control-room.git)
    cd control-room/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the `backend` root. [cite_start]**Do not share actual values in the repo**[cite: 129, 144].
    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/controlroom
    JWT_SECRET=your_super_secret_key_here
    NODE_ENV=development
    ```

### Running Locally
* **Development Mode:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

* **Run Tests:**
    (Includes 5 unit tests for backend logic) [cite_start][cite: 131]
    ```bash
    npm test
    ```

## [cite_start]📡 API Endpoints [cite: 146, 182]

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/signup` | Register a new user (hash password, validate email) |
| `POST` | `/api/v1/auth/login` | Authenticate user and return JWT |
| `POST` | `/api/v1/auth/logout` | Clear session/cookie |

### User Management (Protected)
| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users/me` | Get current user profile | User/Admin |
| `PUT` | `/api/v1/users/me` | Update name or email | User/Admin |
| `PUT` | `/api/v1/users/password` | Change password | User/Admin |

### Admin Operations (Protected)
| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/users` | Get all users (Paginated) | Admin Only |
| `PATCH` | `/api/v1/admin/users/:id/status` | Activate/Deactivate user | Admin Only |

## 📦 Deployment Instructions (Render)
1.  Push code to GitHub.
2.  Create a new **Web Service** on [Render](https://render.com).
3.  Connect the repository and select the `backend` folder as the root.
4.  **Build Command:** `npm install`
5.  **Start Command:** `npm start`
6.  [cite_start]Add the environment variables (`MONGO_URI`, `JWT_SECRET`) in the Render dashboard[cite: 136, 156].

---
[cite_start]*Submitted by: Aryaman Singh for Purple Merit Technologies* [cite: 11]
