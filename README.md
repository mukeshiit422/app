# Database Management Application

A full-stack application for managing PostgreSQL databases with a React frontend and Node.js/Express backend.

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- PostgreSQL database server

## Project Structure

```
appBuilder/
├── backend/         # Express server
├── frontend/        # React application
└── README.md       # This file
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with your default database configuration:
```
PORT=3001
```

4. Start the backend server:
```bash
npm start
```

The backend server will start on http://localhost:3001

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend application will start on http://localhost:3000

## Features

- Connect to any PostgreSQL database using a connection form
- View list of tables in the connected database
- View and edit table data with pagination
- Add new rows to tables
- Edit existing rows
- Delete rows(must have id as primary key)
- Responsive design for desktop and mobile use

## API Endpoints

### Database Connection
- `POST /api/connect` - Connect to a database
- `GET /api/tables` - Get list of tables in connected database
- `GET /api/table/:tableName` - Get data from specific table
- `POST /api/table/:tableName` - Insert new row
- `PUT /api/table/:tableName/:id` - Update existing row
- `DELETE /api/table/:tableName/:id` - Delete row

## Development

### Backend Development

The backend is built with:
- Express.js - Web framework
- pg - PostgreSQL client
- cors - Cross-origin resource sharing

### Frontend Development

The frontend is built with:
- React - UI library
- React Hooks - State management
- CSS Modules - Styling

## Troubleshooting

### Common Issues

1. **Backend Connection Errors**
   - Ensure PostgreSQL is running
   - Check database credentials
   - Verify port 3001 is available

2. **Frontend Connection Issues**
   - Check if backend is running
   - Verify CORS settings
   - Check browser console for errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.