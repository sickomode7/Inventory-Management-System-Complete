# Inventory Management System

A comprehensive Inventory Management System built with a Spring Boot backend and a React (Vite) frontend. This application provides role-based access control, product management, inventory tracking, and email notifications.

## 🚀 Features

-   **Role-Based Access Control (RBAC)**: secure access for Admins, Staff, and Users.
-   **Product Management**: Create, update, delete, and view products.
-   **Inventory Tracking**: Monitor stock levels (Inward/Outward/Transfers).
-   **Currency Conversion**: Real-time currency conversion for product pricing.
-   **Email Notifications**: Automated emails for user registration (integrated with Mailtrap).
-   **Secure Authentication**: JWT-based stateless authentication.
-   **Dashboard Analytics**: Visual overview of inventory status.

## 🛠️ Tech Stack

### Backend
-   **Framework**: Spring Boot (v4.0.2)
-   **Language**: Java 17
-   **Database**: PostgreSQL
-   **Security**: Spring Security + JWT
-   **Build Tool**: Maven

### Frontend
-   **Framework**: React 19
-   **Build Tool**: Vite
-   **HTTP Client**: Axios
-   **State/Data Fetching**: TanStack Query
-   **Routing**: React Router DOM
-   **Icons**: Lucide React
-   **Forms**: React Hook Form + Zod

## ⚙️ Prerequisites

-   **Java 17** SDK installed.
-   **Node.js** (v18+ recommended) & **npm**.
-   **PostgreSQL** database installed and running.

## 🏃‍♂️ Getting Started

### 1. Database Setup
Create a PostgreSQL database named `inventory_db`. The application will automatically create the required tables on startup.

### 2. Backend Setup (`inventory-system`)

1.  Navigate to the root directory.
2.  Update `src/main/resources/application.properties` with your database and mail credentials:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/inventory_db
    spring.datasource.username=your_db_user
    spring.datasource.password=your_db_password

    # Mailtrap Configuration
    spring.mail.username=your_mailtrap_username
    spring.mail.password=your_mailtrap_password
    ```
3.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
    The backend will start on `http://localhost:8080`.

### 3. Frontend Setup (`inventory-system/frontend`)

1.  Navigate to the frontend directory:
    ```bash
    cd inventory-system/frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will start on `http://localhost:5173`.

## 🔌 API Endpoints (Key Examples)

| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user | Public |
| `POST` | `/api/auth/signin` | Login and get JWT | Public |
| `GET` | `/api/products` | Get all products (Paginated) | User/Staff/Admin |
| `POST` | `/api/products` | Create a new product | Admin |
| `GET` | `/api/inventory` | Get inventory status | Staff/Admin |

## 📂 Project Structure

```
Inventory-Management-System/
├── inventory-system/       # Backend (Spring Boot) source
│   ├── src/main/java       # Controllers, Services, Models
│   └── src/main/resources  # Configs (application.properties)
│   └── frontend/           # Frontend (React) source
│       ├── src/            # Components, Pages, API logic
│       └── package.json    # Frontend dependencies
├── pom.xml                 # Maven build configuration
└── README.md               # Project documentation
```
