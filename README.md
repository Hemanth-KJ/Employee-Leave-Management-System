# Employee Leave Management System

A full-stack web application for managing employee leave requests with separate employee and manager portals.

The system allows employees to apply for leave, track leave requests, and receive notifications, while managers can review employees, manage leave requests, and approve or reject applications.

---

## Features

### Employee

- Employee registration and login
- JWT-based authentication
- Employee dashboard
- Apply for leave
- View leave history
- Track leave request status
- Receive notifications
- Secure file upload for leave requests
- Protected employee routes

### Manager

- Manager login
- Manager dashboard
- View employees
- View employee leave requests
- Approve leave requests
- Reject leave requests
- Manager-specific protected routes
- Notification management

### Authentication & Security

- JWT authentication
- Password hashing
- Role-based authorization
- Protected API routes
- Employee and manager access control
- Environment variables for sensitive configuration

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Axios

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT
- bcrypt
- Multer
- REST API

---

## Project Structure

```text
employee-leave-management/
│
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   │
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── leaveController.js
│   │   │   ├── managerController.js
│   │   │   └── notificationController.js
│   │   │
│   │   ├── db/
│   │   │   └── seedManager.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   └── uploadMiddleware.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── leaveRoutes.js
│   │   │   ├── managerRoutes.js
│   │   │   └── notificationRoutes.js
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── leaveService.js
│   │   │   └── managerService.js
│   │   │
│   │   └── utils/
│   │       ├── jwt.js
│   │       └── password.js
│   │
│   ├── uploads/
│   │   └── leaves/
│   │
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
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
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── README.md