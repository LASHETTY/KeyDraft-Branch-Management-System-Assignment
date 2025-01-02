# Branch Management System

A comprehensive branch management system that allows users to manage branch information with features like CRUD operations, data import/export, and various viewing options.

## Features

- User Authentication
- Create, Read, Update, and Delete branch entries
- Excel file import/export functionality
- Real-time search and filtering
- Sortable columns
- Pagination (10 rows per page)
- Grid/List view toggle
- Full-screen mode
- Responsive design

## Tech Stack

### Frontend
- React.js
- Material-UI for modern UI components
- Axios for API requests
- XLSX for Excel operations

### Backend
- Node.js
- Express.js
- MongoDB for database
- Mongoose for object modeling
- Multer for file uploads

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/LASHETTY/KeyDraft-Branch-Management-System-Assignment.git
cd KeyDraft-Branch-Management-System-Assignment
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create .env file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/branch-management
NODE_ENV=development
```

## Running the Application

1. Start MongoDB service on your machine

2. Start the backend server:
```bash
cd backend
npm start
```

3. In a new terminal, start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Login Credentials
- Username: barath
- Password: 12345

## API Endpoints

### Authentication
- POST /api/auth/login - Login with credentials

### Branches
- GET /api/branches - Get all branches (with pagination)
- POST /api/branches - Create new branch
- PUT /api/branches/:id - Update branch
- DELETE /api/branches/:id - Delete branch
- POST /api/branches/import - Import branches from Excel
- GET /api/branches/export - Export branches to Excel

## Features Overview

1. **Authentication**
   - Secure login system
   - Protected routes
   - Session management

2. **Branch Management**
   - Add new branches with detailed information
   - View all branches in a data grid
   - Edit existing branch details
   - Delete branches
   - Real-time search and filtering

3. **Data Import/Export**
   - Import branch data from Excel files
   - Export branch data to Excel format

4. **User Interface**
   - Modern Material-UI design
   - Responsive layout
   - Grid/List view options
   - Full-screen mode
   - Sortable columns
   - Pagination

## Error Handling
- Proper error messages for API failures
- Form validation
- Authentication error handling
- File upload error handling

## Security Features
- Protected API endpoints
- Authentication middleware
- Input validation
- Error handling middleware

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License
