# SACCO Mobile Application

A modern mobile application for managing SACCO (Savings and Credit Cooperative Organization) operations. This application enables users to perform various tasks such as account management, loan applications, savings tracking, and transaction history viewing.

## Features

- **User Authentication**: Secure login system
- **Dashboard**: Overview of account balance, loans, and recent transactions
- **Loan Management**: Apply for loans, view pending applications and active loans
- **Transaction History**: View all account transactions with detailed information
- **Savings Management**: Track savings, make deposits, and view growth over time
- **Profile Management**: Update personal information and account settings

## Demo Video

[Watch Demo Video Here](https://www.awesomescreenshot.com/video/38686218?key=9a3feb21495a263189b9c88bd2eac215)

## Screenshots

<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <!-- Add screenshots of your app here -->
</div>

## Technology Stack

- **Frontend**: React Native with Expo
- **UI Components**: Custom themed components with dark/light mode support
- **Navigation**: Expo Router for seamless navigation
- **State Management**: React hooks and Context API
- **API Communication**: Fetch API
- **Backend**: Django REST Framework
- **Authentication**: JWT Token-based authentication

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Python](https://www.python.org/) (v3.8 or newer, for backend)
- [Django](https://www.djangoproject.com/) and Django REST Framework

## Installation and Setup

### Frontend (React Native App)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd SACCOApp
   ```

2. Install dependencies:
   ```bash
   npm install
   # or if you're using yarn
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory with the following variables:
     ```
     API_URL=http://127.0.0.1:8000/api
     ```

4. Start the Expo development server:
   ```bash
   npx expo start
   ```

5. Use the Expo Go app on your mobile device to scan the QR code or run on an emulator.

### Backend (Django REST API)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows, use: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up database:
   ```bash
   python manage.py migrate
   ```

5. Create a superuser (admin):
   ```bash
   python manage.py createsuperuser
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

## API Endpoints

The application interacts with the following API endpoints:

- **Authentication**:
  - `POST /api/login/`: User login
  - `POST /api/register/`: User registration

- **Loans**:
  - `GET /api/loan-applications/`: List all user loan applications
  - `POST /api/loan-applications/`: Submit a new loan application
  - `GET /api/loan-applications/{id}/`: Get details of a specific loan

- **Transactions**:
  - `GET /api/transactions/`: List all user transactions

- **User Profile**:
  - `GET /api/user/`: Get current user profile
  - `PUT /api/user/`: Update user profile

### API Documentation

For testing and exploring the API endpoints:

- **Swagger UI**: Visit `http://localhost:8000/swagger/` when the backend server is running
- This interactive documentation allows you to:
  - See all available endpoints
  - Test API calls directly from the browser
  - View request/response formats
  - Understand authentication requirements

## Assumptions

1. Users have a stable internet connection to communicate with the backend API.
2. The SACCO has a predefined interest rate for loans (currently set at 15% per annum).
3. All monetary values are in Ugandan Shillings (UGX).
4. User authentication is JWT token-based with tokens stored in AsyncStorage.
5. Loan applications require approval by SACCO administrators before being activated.

## Project Structure

```
SACCOApp/
├── app/                  # Main application screens using Expo Router
│   ├── auth/             # Authentication screens (login, register)
│   ├── dashboard/        # Dashboard and main application screens
│   ├── loans/            # Loan application and management screens
│   └── transactions/     # Transaction history screens
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
├── constants/            # Application constants and theme settings
├── assets/               # Images, fonts, and other static assets
└── ...
```