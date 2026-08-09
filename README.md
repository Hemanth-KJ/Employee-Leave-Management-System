# Employee Leave Management System

A full-stack **Employee Leave Management System** that allows employees to apply for leaves and track their leave history, while managers can manage employees, review leave requests, approve or reject requests, and manage employee records.

The application uses **role-based authentication and authorization** to provide different functionality for Employees and Managers.

---

## 🚀 Features

### 👨‍💼 Employee Features

* Employee registration
* Secure employee login
* JWT-based authentication
* Employee dashboard
* Apply for leave
* Select leave type
* Specify leave dates
* Add leave reason
* View leave history
* Track leave status

  * Pending
  * Approved
  * Rejected
* Receive notifications
* Logout functionality
* Light/Dark theme support

### 👨‍💻 Manager Features

* Secure manager login
* Manager dashboard
* View all employees
* View employee details
* Delete employees
* View all leave requests
* Review employee leave requests
* Approve leave requests
* Reject leave requests
* Add rejection reason
* Receive notifications
* Role-based access control

### 🔐 Security Features

* JWT authentication
* Password hashing
* Protected routes
* Role-based authorization
* Manager-only routes
* Employee-only routes
* Secure API requests
* Authentication token validation
* User identity validation using UUIDs

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* JavaScript
* CSS
* Axios
* React Router
* JWT Authentication

## Backend

* Node.js
* Express.js
* JavaScript
* JWT
* bcrypt
* PostgreSQL
* REST API

## Database

* PostgreSQL

## Deployment

* Frontend: Vercel
* Backend: Railway
* Database: PostgreSQL / Supabase PostgreSQL

---

# 📁 Project Structure

```text
Employee Leave Management System/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   │
│   │   ├── assets/
│   │   │   └── hero.png
│   │   │
│   │   ├── components/
│   │   │   ├── NotificationDropdown.jsx
│   │   │   ├── NotificationToast.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RoleRoute.jsx
│   │   │   └── ThemeToggle.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   │
│   │   │   ├── employee/
│   │   │   │   ├── ApplyLeave.jsx
│   │   │   │   ├── EmployeeDashboard.jsx
│   │   │   │   └── LeaveHistory.jsx
│   │   │   │
│   │   │   └── manager/
│   │   │       ├── ManagerDashboard.jsx
│   │   │       ├── ManagerEmployees.jsx
│   │   │       └── ManagerLeaves.jsx
│   │   │
│   │   └── services/
│   │       ├── api.js
│   │       ├── authService.js
│   │       ├── leaveService.js
│   │       ├── managerService.js
│   │       └── notificationService.js
│   │
│   ├── package.json
│   └── package-lock.json
│
│
└── backend/
    │
    ├── src/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── routes/
    │   ├── services/
    │   ├── db/
    │   └── app.js
    │
    ├── package.json
    └── package-lock.json
```

> The exact backend folder structure may vary depending on the current implementation.

---

# ⚙️ Prerequisites

Before running the project, install the following:

* Node.js
* npm
* PostgreSQL
* Git

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

Check PostgreSQL:

```bash
psql --version
```

---

# 📥 Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project:

```bash
cd Employee-Leave-Management-System
```

The project contains two applications:

```text
frontend
backend
```

Both applications must be installed separately.

---

# 🎨 Frontend Setup

Open a terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

The Vite terminal will display the exact URL after starting the application.

---

# ⚙️ Backend Setup

Open another terminal.

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm start
```

The backend will run on the port configured in the backend environment variables.

For example:

```text
http://localhost:5000
```

---

# 🔑 Environment Variables

## Frontend

Create a `.env` file inside:

```text
frontend/
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, replace the local backend URL with the deployed Railway backend URL:

```env
VITE_API_URL=https://your-backend.up.railway.app/api
```

---

# 🔐 Backend Environment Variables

Create a `.env` file inside:

```text
backend/
```

Example:

```env
PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173
```

For production, `CLIENT_URL` should contain the deployed frontend URL:

```env
CLIENT_URL=https://your-frontend.vercel.app
```

> Never commit `.env` files to GitHub.

---

# 🗄️ Database Setup

This project uses PostgreSQL.

Create a PostgreSQL database and configure the connection string in the backend `.env` file.

Example:

```env
DATABASE_URL=postgresql://username:password@host:port/database
```

The database contains tables for users, leave requests, and notifications.

The `users` table uses a UUID `id` to identify users.

The application uses the user's UUID consistently when creating relationships and notifications.

---

# 👥 User Roles

The system supports two primary roles.

## Employee

Employees can:

```text
Register
   ↓
Login
   ↓
Employee Dashboard
   ↓
Apply for Leave
   ↓
Track Leave Status
   ↓
View Leave History
```

## Manager

Managers can:

```text
Login
   ↓
Manager Dashboard
   ↓
View Employees
   ↓
Manage Employees
   ↓
View Leave Requests
   ↓
Approve / Reject Leave
```

---

# 🔒 Authentication Flow

The application uses JWT-based authentication.

### Login

The user submits:

```text
Username
Password
```

The backend validates the credentials.

If authentication succeeds, the backend generates a JWT token.

The frontend stores the token and sends it with protected API requests.

Example:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 🛡️ Role-Based Authorization

Protected routes verify whether the authenticated user has the required role.

For example:

```text
Employee → Employee Dashboard
Manager  → Manager Dashboard
```

Employees cannot access manager-only pages.

Managers cannot access employee-only functionality unless explicitly allowed by the application.

---

# 📝 Leave Management Flow

### 1. Employee applies for leave

The employee selects:

```text
Leave Type
Start Date
End Date
Reason
```

The request is stored in PostgreSQL with:

```text
status = pending
```

### 2. Manager reviews the request

The manager opens:

```text
Manager Dashboard
        ↓
Leave Requests
```

The manager can:

```text
Approve
```

or

```text
Reject
```

### 3. Employee receives the result

The employee can view the updated status:

```text
Pending
Approved
Rejected
```

Notifications are also generated when appropriate.

---

# 🔔 Notification System

The application includes a notification system.

Notifications can be generated for events such as:

* Leave application
* Leave approval
* Leave rejection
* Manager notifications
* Employee-related actions

The frontend contains:

```text
NotificationDropdown.jsx
NotificationToast.jsx
```

The notification service communicates with the backend API.

---

# 👨‍💼 Manager Employee Management

Managers can view employees from:

```text
Manager Dashboard
        ↓
Employees
```

The manager can view employee information and delete employees when required.

Employee deletion is protected by manager authorization.

---

# 🧩 Backend Service Architecture

The backend follows a modular structure separating different responsibilities.

Typical structure:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Database
```

For example:

```text
leaveService.js
```

handles leave-related business logic.

The leave service uses the existing `username` column from the `users` table rather than relying on a non-existent `email` column.

The employee identity is obtained using the user's UUID:

```text
users.id
```

The manager's JWT:

```text
req.user.id
```

must correspond to the correct UUID from the `users` table.

This ensures that notification records use valid UUID values.

---

# 🌐 API

The backend exposes REST API endpoints for:

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Leave Management

```text
POST   /api/leaves
GET    /api/leaves
GET    /api/leaves/history
PUT    /api/leaves/:id/approve
PUT    /api/leaves/:id/reject
```

### Manager

```text
GET    /api/manager/employees
DELETE /api/manager/employees/:id
GET    /api/manager/leaves
```

### Notifications

```text
GET    /api/notifications
PUT    /api/notifications/:id/read
```

> The exact API paths depend on the routes configured in the current backend implementation.

---

# ▶️ Running the Complete Application

You need **two terminals**.

## Terminal 1 — Backend

```bash
cd backend
npm install
npm start
```

---

## Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open the frontend URL displayed by Vite, usually:

```text
http://localhost:5173
```

---

# 🏗️ Production Build

To create the production frontend build:

```bash
cd frontend
npm run build
```

This generates:

```text
dist/
```

The `dist` directory contains the production-ready frontend.

---

# ☁️ Deployment

## Frontend — Vercel

The React/Vite frontend can be deployed to Vercel.

Recommended settings:

```text
Framework: Vite

Build Command:
npm run build

Output Directory:
dist
```

Add the production API URL as a Vercel environment variable:

```text
VITE_API_URL=https://your-backend.up.railway.app/api
```

---

## Backend — Railway

The Node.js/Express backend can be deployed to Railway.

Configure the required environment variables:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://your-frontend.vercel.app
```

Railway provides a public backend URL such as:

```text
https://your-backend.up.railway.app
```

Use this URL in the frontend's:

```env
VITE_API_URL
```

---

# 🔄 Production Architecture

After deployment, the application architecture will look like:

```text
                   ┌─────────────────────┐
                   │       User          │
                   │      Browser        │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │       Vercel        │
                   │   React + Vite      │
                   └──────────┬──────────┘
                              │
                              │ HTTPS REST API
                              ▼
                   ┌─────────────────────┐
                   │      Railway        │
                   │ Node.js + Express   │
                   └──────────┬──────────┘
                              │
                              │ PostgreSQL
                              ▼
                   ┌─────────────────────┐
                   │     PostgreSQL      │
                   │      Database       │
                   └─────────────────────┘
```

---

# 🔐 Security

For production deployments:

* Never expose database credentials in frontend code.
* Never commit `.env` files.
* Use a strong JWT secret.
* Use HTTPS.
* Configure CORS correctly.
* Validate user roles on the backend.
* Validate request data.
* Keep database credentials private.
* Do not store sensitive credentials directly in source code.

---

# 📦 .gitignore

The project should ignore:

```gitignore
node_modules/
dist/
.env
.env.local
.env.production
*.log
```

---

# 🐛 Troubleshooting

## Frontend does not start

Run:

```bash
npm install
```

Then:

```bash
npm run dev
```

---

## Backend does not start

Run:

```bash
npm install
```

Then:

```bash
npm start
```

Check that your `.env` file contains the required variables.

---

## Database connection error

Check:

```env
DATABASE_URL=...
```

Make sure:

* PostgreSQL is running
* Database credentials are correct
* Database host is correct
* Database port is correct
* Database name is correct

---

## CORS error

Make sure the backend allows the frontend origin.

For local development:

```text
http://localhost:5173
```

For production:

```text
https://your-frontend.vercel.app
```

---

## API requests fail after Vercel deployment

Check:

```env
VITE_API_URL
```

The frontend must use the deployed Railway backend URL instead of:

```text
localhost
```

For example:

```env
VITE_API_URL=https://your-backend.up.railway.app/api
```

---

# 📌 Development Commands

## Frontend

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build production version:

```bash
npm run build
```

---

## Backend

Install dependencies:

```bash
npm install
```

Run server:

```bash
npm start
```

---

# 🎯 Project Objective

The main objective of this project is to build a practical full-stack leave management platform that demonstrates:

* Full-stack development
* REST API development
* React application development
* PostgreSQL database integration
* JWT authentication
* Role-based authorization
* CRUD operations
* Leave approval workflows
* Notification systems
* Secure API communication
* Cloud deployment

---

# 👨‍💻 Author

**Hemanth KJ**

Software Engineer | Full Stack Developer | Java Developer

### Technologies

```text
Java
Spring Boot
React
Node.js
Express.js
PostgreSQL
MongoDB
Docker
Git
GitHub
Vercel
Railway
```

---

# 📄 License

This project is developed for educational, portfolio, and demonstration purposes.
