# SACCO Management System

A complete SACCO (Savings and Credit Cooperative Organization) management system consisting of a Django REST API backend and a React Native  application.

## Project Overview

This project provides a comprehensive solution for managing SACCO operations, including user accounts, loan applications, savings tracking, and transaction history. The system is divided into two main components:

1. **Backend (Django REST API)**: Handles data management, business logic, authentication, and provides API endpoints for the  application.
2. **Frontend (React Native App)**: Provides a user-friendly interface for SACCO members to interact with the system.

## Demo Video

[Watch Demo Video Here](https://www.awesomescreenshot.com/video/38686218?key=9a3feb21495a263189b9c88bd2eac215)

## Components

### Backend

The backend is built with Django and Django REST Framework, providing robust API endpoints for:
- User authentication and management
- Loan application processing and tracking
- Transaction recording and history
- User profile management

See the [backend README](./backend/README.md) for detailed setup and documentation.

### Frontend Application

The  app is built with React Native and Expo, featuring:
- Clean, modern UI with dark/light mode support
- Intuitive navigation using Expo Router
- Secure authentication flow
- Loan application and tracking
- Transaction history viewing
- Account management

See the [SACCOApp README](./SACCOApp/README.md) for detailed setup and documentation.

## Getting Started

### Prerequisites

- **Backend**:
  - Python 3.8+
  - Django and Django REST Framework
  - PostgreSQL (recommended) or SQLite
  
- **Frontend**:
  - Node.js 14+
  - npm or Yarn
  - Expo CLI
  - React Native development environment

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd kanzu_code
   ```

2. **Set up the backend**:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

   Once the server is running, you can access:
   - Admin interface: http://localhost:8000/admin/
   - Swagger API documentation: http://localhost:8000/swagger/

3. **Set up the  app**:
   ```bash
   cd SACCOApp
   npm install
   # Configure .env file
   npx expo start
   ```

## API Endpoints

Key API endpoints include:

- **Authentication**:
  - `POST /api/login/`: User login
  - `POST /api/register/`: User registration

- **Loans**:
  - `GET /api/loan-applications/`: List all user loan applications
  - `POST /api/loan-applications/`: Submit a new loan application

- **Transactions**:
  - `GET /api/transactions/`: List all user transactions

### API Documentation

The backend includes Swagger documentation for easy API testing and exploration:

- **Swagger UI**: Available at `http://localhost:8000/swagger/` when the backend server is running
- Use this interactive interface to test API endpoints, view request/response formats, and understand the available operations

See the full API documentation in the backend README for more details.

## Project Structure

```
kanzu_code/
├── backend/              # Django REST API backend
│   ├── api/              # API endpoints and logic
│   ├── sacco_management/ # Core backend functionality
│   └── ...
│
└── SACCOApp/             # React Native  application
    ├── app/              # Main application screens
    ├── components/       # Reusable UI components
    ├── hooks/            # Custom React hooks
    └── ...
```

## Running Tests

Instructions for running tests are provided in the respective README files for each component.

## Assumptions Made

1. Users have a stable internet connection to communicate with the backend API.
2. The SACCO has a predefined interest rate for loans (currently set at 15% per annum).
3. All monetary values are in Ugandan Shillings (UGX).
4. User authentication is JWT token-based with tokens stored securely.
5. Loan applications require approval by SACCO administrators before being activated.

## Contributors

- Naggayi Daphne Pearl

## License


---
