# CEMS - College Event Management System

A comprehensive web application for managing college events, built with React and Node.js. CEMS enables students to discover and register for campus events, organizers to create and manage events, and administrators to oversee the entire platform.

## Features

### For Students
- 🔍 Browse and discover campus events
- 📝 Quick event registration with one click
- 🎫 QR code generation for event check-in
- 🔔 Email notifications and reminders
- 📊 View registered events and attendance history

### For Organizers
- ➕ Create and publish events
- 👥 Manage event registrations
- 📱 QR code scanning for attendance tracking
- 📧 Automated email reminders to attendees
- 📈 View event analytics and statistics

### For Administrators
- 🛡️ Platform-wide oversight and management
- ✅ Event approval system
- 📊 Comprehensive analytics dashboard
- 👤 User management
- 🎯 System monitoring and statistics

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **React QR Code** - QR code generation and scanning

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **QRCode** - QR code generation
- **Node-cron** - Scheduled tasks

## Project Structure

```
cems/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api/           # API client configuration
│   │   ├── components/    # Reusable React components
│   │   │   └── ui/        # UI component library
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   ├── styles/        # Global styles
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic services
│   │   ├── utils/         # Utility functions
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Server entry point
│   ├── .env               # Environment variables
│   └── package.json
│
├── .gitignore
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd cems
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/cems
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/cems?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (for Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=CEMS <noreply@cems.com>

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

## Running the Application

### Development Mode

#### Start the Backend Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

#### Start the Frontend Development Server

```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173`

### Production Mode

#### Build the Frontend

```bash
cd client
npm run build
```

#### Start the Backend Server

```bash
cd server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (Organizer/Admin)
- `PUT /api/events/:id` - Update event (Organizer/Admin)
- `DELETE /api/events/:id` - Delete event (Organizer/Admin)
- `GET /api/events/my-events` - Get user's created events

### Registrations
- `POST /api/registrations` - Register for an event
- `GET /api/registrations/my-events` - Get user's registered events
- `DELETE /api/registrations/:id` - Cancel registration
- `GET /api/registrations/event/:eventId` - Get event registrations (Organizer/Admin)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

### QR Code
- `POST /api/qr/verify` - Verify QR code for check-in
- `GET /api/qr/generate/:registrationId` - Generate QR code

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

## User Roles

### Student
- Default role for new registrations
- Can browse and register for events
- Receives notifications and reminders

### Organizer
- Can create and manage events
- Can view event registrations
- Can scan QR codes for attendance

### Admin
- Full platform access
- Can approve/reject events
- Can manage users and roles
- Access to analytics dashboard

## Features in Detail

### QR Code System
- Automatic QR code generation upon event registration
- QR codes contain encrypted registration data
- Organizers can scan QR codes to verify attendance
- Real-time check-in tracking

### Email Notifications
- Welcome email on registration
- Event registration confirmation
- Automated reminders (24 hours before event)
- Event updates and cancellations

### Cron Jobs
- Automated email reminders sent daily
- Checks for events happening in the next 24 hours
- Sends reminders to all registered attendees

## Security

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Protected API routes with middleware
- CORS configuration for frontend-backend communication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@cems.com or open an issue in the repository.

## Acknowledgments

- Built with modern web technologies
- UI components from Radix UI
- Icons from Lucide React
- Styling with Tailwind CSS
