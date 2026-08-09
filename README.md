# Employee Leave Management System

A full-stack **Employee Leave Management System** that allows employees to apply for leaves and track their leave history, while managers can manage employees, review leave requests, approve or reject requests, delete employee records, and manage supporting documents.

The application uses **role-based authentication and authorization** to provide different functionality for Employees and Managers.

Supporting leave documents are uploaded to **Cloudinary**, while document metadata and Cloudinary URLs are stored in PostgreSQL.

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
* Upload supporting documents
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
* View supporting leave documents
* Review employee leave requests
* Approve leave requests
* Reject leave requests
* Add remarks when reviewing requests
* Receive notifications
* Role-based access control

### 📄 Document Management

* Upload leave supporting documents
* Store uploaded files securely using Cloudinary
* Store document metadata in PostgreSQL
* Open uploaded documents from the manager dashboard
* Automatically clean up Cloudinary documents when:

  * A leave document is deleted
  * An employee is deleted
* Prevent orphaned uploaded documents when employee records are removed

### 🔐 Security Features

* JWT authentication
* Password hashing using bcrypt
* Protected routes
* Role-based authorization
* Manager-only routes
* Employee-only routes
* Secure API requests
* Authentication token validation
* UUID-based user identification
* Backend request validation
* CORS protection
* Environment-based secret configuration

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
* REST API
* Multer / file upload handling

## Database

* PostgreSQL
* Supabase PostgreSQL

## Cloud Storage

* Cloudinary

Cloudinary is used to store uploaded leave-supporting documents.

The database stores the document metadata and Cloudinary URL/public ID information required to access and clean up uploaded files.

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: PostgreSQL / Supabase PostgreSQL
* File Storage: Cloudinary

---

# 📁 Project Structure

```text
Employee-Leave-Management-System/
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
    │   ├── config/
    │   │   ├── db.js
    │   │   └── cloudinary.js
    │   │
    │   ├── controllers/
    │   ├── middleware/
    │   ├── routes/
    │   ├── services/
    │   └── app.js
    │
    ├── package.json
    └── package-lock.json
```

> The exact backend folder structure may vary depending on the current implementation.

---

# ⚙️ Prerequisites

Before running the project locally, install:

* Node.js
* npm
* PostgreSQL
* Git
* Cloudinary account

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

Navigate to the frontend:

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

The Vite terminal displays the exact URL after starting the application.

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

The backend will run on the port configured in the environment variables.

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

For local development:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

> Use the actual Render backend URL in your deployed frontend environment variables.

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

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

For production, update:

```env
CLIENT_URL=https://your-frontend.vercel.app
```

### Cloudinary Variables

The backend uses the following Cloudinary configuration:

```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

These values are obtained from your Cloudinary account.

> Never commit `.env` files or Cloudinary credentials to GitHub.

---

# ☁️ Cloudinary File Storage

The application uses **Cloudinary** for storing supporting documents uploaded by employees when applying for leave.

### Upload Flow

```text
Employee
   │
   │ Upload supporting document
   ▼
React Frontend
   │
   │ Multipart/Form-Data
   ▼
Node.js + Express
   │
   ▼
Cloudinary
   │
   │ Cloudinary URL
   ▼
PostgreSQL
   │
   └── Document metadata + URL
```

The application stores information such as:

```text
original_name
stored_name / public_id
file_path
mime_type
file_size
leave_request_id
```

The actual uploaded document is stored in Cloudinary.

PostgreSQL stores the information required to retrieve the document.

---

# 🗑️ Cloudinary Cleanup

The application also handles document cleanup.

When a manager deletes an employee:

```text
Manager
   │
   ▼
Delete Employee
   │
   ├── Delete employee from PostgreSQL
   │
   ├── CASCADE deletes leave requests
   │
   ├── CASCADE deletes leave documents
   │
   └── Delete corresponding Cloudinary files
```

The backend retrieves the Cloudinary public IDs associated with the employee's leave documents before deleting the database records.

Cloudinary files are then deleted using the Cloudinary API.

This prevents unnecessary files from remaining in Cloudinary after an employee has been removed.

---

# 🗄️ Database Setup

This project uses PostgreSQL.

Create a PostgreSQL database and configure the connection string in the backend `.env`.

Example:

```env
DATABASE_URL=postgresql://username:password@host:port/database
```

The database contains tables for:

```text
users
leave_requests
leave_documents
notifications
```

The `users` table uses UUID values to identify users.

Relationships between users, leave requests, documents, and notifications use these UUIDs.

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
Upload Supporting Document
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
View Supporting Documents
   ↓
Approve / Reject Leave
   ↓
Delete Employees
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

Employees cannot access manager-only APIs.

Managers cannot access employee-only functionality unless explicitly allowed by the application.

Backend middleware is responsible for enforcing authorization.

---

# 📝 Leave Management Flow

### 1. Employee applies for leave

The employee selects:

```text
Leave Type
Start Date
End Date
Reason
Supporting Document
```

The request is stored in PostgreSQL with:

```text
status = pending
```

If a supporting document is uploaded, it is stored in Cloudinary.

---

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

or:

```text
Reject
```

The manager can also provide remarks.

---

### 3. Employee receives the result

The employee can view:

```text
Pending
Approved
Rejected
```

Notifications are generated when the manager approves or rejects the leave request.

---

# 🔔 Notification System

The application includes a notification system.

Notifications can be generated for events such as:

* Leave application
* Leave approval
* Leave rejection
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

When an employee is deleted:

```text
Employee
   ↓
Leave Requests
   ↓
Leave Documents
   ↓
Cloudinary Files
```

The corresponding database records and Cloudinary files are cleaned up.

---

# 🧩 Backend Architecture

The backend follows a modular architecture separating different responsibilities.

```text
Routes
   ↓
Middleware
   ↓
Controllers
   ↓
Services
   ↓
Database / Cloudinary
```

### Routes

Routes define the API endpoints.

### Middleware

Middleware handles:

* JWT authentication
* Role authorization
* Request validation

### Controllers

Controllers handle incoming requests and responses.

### Services

Services contain reusable business logic.

### PostgreSQL

PostgreSQL stores application data.

### Cloudinary

Cloudinary stores uploaded supporting documents.

---

# 🌐 API

The backend exposes REST API endpoints for authentication, leave management, manager operations, and notifications.

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Employee Leave Management

```text
POST   /api/leaves
GET    /api/leaves
GET    /api/leaves/history
```

## Manager

```text
GET    /api/manager/employees
DELETE /api/manager/employees/:id
GET    /api/manager/leaves
GET    /api/manager/leaves/:id/document
PATCH  /api/manager/leaves/:id/status
```

## Notifications

```text
GET /api/notifications
PUT /api/notifications/:id/read
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

Then open the frontend URL displayed by Vite:

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

The React/Vite frontend is deployed using Vercel.

Recommended settings:

```text
Framework:
Vite

Build Command:
npm run build

Output Directory:
dist
```

Add the production backend URL as a Vercel environment variable:

```text
VITE_API_URL=https://your-backend.onrender.com/api
```

After changing environment variables, redeploy the frontend.

---

# 🚀 Backend — Render

The Node.js/Express backend is deployed using Render.

The Render service runs the backend application and exposes a public HTTPS URL.

Example:

```text
https://your-backend.onrender.com
```

Configure the following environment variables in Render:

```env
PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=https://your-frontend.vercel.app

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLOUDINARY_API_KEY=your_cloudinary_api_key

CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

The frontend uses the Render backend URL:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

> Render manages the production backend process, while Cloudinary handles uploaded document storage.

---

# ☁️ Cloudinary Configuration

Create a Cloudinary account and obtain:

```text
Cloud Name
API Key
API Secret
```

Configure them in the backend environment:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

The backend Cloudinary configuration is responsible for connecting the application to Cloudinary.

Example configuration:

```javascript
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
```

---

# 🔄 Production Architecture

After deployment, the application architecture looks like:

```text
                         ┌─────────────────────┐
                         │        User         │
                         │      Browser        │
                         └──────────┬──────────┘
                                    │
                                    │ HTTPS
                                    ▼
                         ┌─────────────────────┐
                         │       Vercel        │
                         │    React + Vite     │
                         └──────────┬──────────┘
                                    │
                                    │ REST API
                                    │ HTTPS
                                    ▼
                         ┌─────────────────────┐
                         │       Render        │
                         │  Node.js + Express  │
                         └──────┬─────────┬────┘
                                │         │
                    PostgreSQL  │         │ Cloudinary API
                                │         │
                                ▼         ▼
                    ┌───────────────┐  ┌───────────────┐
                    │  PostgreSQL   │  │   Cloudinary  │
                    │    Database   │  │ File Storage  │
                    └───────────────┘  └───────────────┘
```

### Responsibilities

**Vercel**

```text
React frontend
Static assets
Production frontend
```

**Render**

```text
Node.js
Express
REST API
JWT authentication
Business logic
```

**PostgreSQL**

```text
Users
Leave requests
Notifications
Document metadata
```

**Cloudinary**

```text
Uploaded supporting documents
Document storage
Document retrieval
Document deletion
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
* Keep Cloudinary API credentials private.
* Never expose `CLOUDINARY_API_SECRET` to the frontend.
* Use environment variables for production secrets.
* Validate uploaded files.
* Restrict manager-only operations on the backend.

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

uploads/
```

> Uploaded documents are stored in Cloudinary, so local uploaded files should not be committed to GitHub.

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

## Cloudinary upload error

Check:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Make sure the Cloudinary credentials are correctly configured in the backend.

---

## Cloudinary document does not open

Check that:

```text
file_path
```

contains the correct Cloudinary URL.

Also verify that the corresponding file still exists in Cloudinary.

---

## Employee deletion does not remove Cloudinary files

Verify that the database stores the Cloudinary public ID in:

```text
stored_name
```

The backend uses this value to delete the Cloudinary resource.

Also check the backend logs for:

```text
Cloudinary cleanup successful
```

or:

```text
Cloudinary cleanup failed
```

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

Configure:

```env
CLIENT_URL=https://your-frontend.vercel.app
```

---

## API requests fail after Vercel deployment

Check the Vercel environment variable:

```text
VITE_API_URL
```

It must point to the Render backend.

Example:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

Do not use:

```text
http://localhost:5000
```

in the production frontend.

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
* File upload handling
* Cloudinary cloud storage
* Cloudinary file cleanup
* Secure API communication
* Cloud deployment
* Vercel frontend deployment
* Render backend deployment

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
Render
Cloudinary
```

---

# 📄 License

This project is developed for educational, portfolio, and demonstration purposes.
