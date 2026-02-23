# EventAt Frontend

React-based frontend for the EventAt event planner application.

## Features

- **Authentication**: JWT-based login and registration
- **Dashboard**: View all events with quick overview
- **Event Management**: Create, edit, and delete events with validation
- **Budget Tracker**: Track budget items, view spending summary with visual indicators
- **Task Manager**: Create and manage tasks with sorting and filtering capabilities

## Project Structure

```
src/
├── components/
│   ├── Dashboard.js          # Main dashboard with event list
│   ├── EventForm.js          # Create/edit event form with validation
│   ├── EventDetail.js        # Event detail page
│   ├── BudgetTracker.js      # Budget management component
│   ├── TaskManager.js        # Task management with filters
│   ├── Login.js              # Login/register page
│   └── ProtectedRoute.js     # Route authentication wrapper
├── context/
│   └── AuthContext.js        # Authentication context provider
├── services/
│   └── api.js                # API service layer
├── App.js                    # Main app with routing
├── App.css                   # Application styles
├── index.js                  # Entry point
└── index.css                 # Global styles
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:8000/api
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Form Validations

### Event Form
- Title: Required, max 200 characters
- Date: Required, cannot be in the past
- Budget: Required, must be positive
- Description: Optional, max 2000 characters
- Expected Attendees: Required, must be positive integer

### Budget Items
- Category: Required
- Amount: Required, must be positive

### Tasks
- Title: Required
- Due Date: Required
- Priority: Low, Medium, or High
- Progress: Not Started, In Progress, or Completed

## API Integration

The app connects to a FastAPI backend. Configure the API URL in the `.env` file.

Default endpoints:
- Auth: `/api/auth/login`, `/api/auth/register`
- Events: `/api/events/`
- Budget: `/api/events/{id}/budget`
- Tasks: `/api/events/{id}/tasks`

## Technologies

- React 18
- React Router 6
- Context API for state management
- CSS for styling
