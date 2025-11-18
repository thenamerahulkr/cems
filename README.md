# CEMS - College Event Management System

A comprehensive, production-ready web application for managing college events, built with React and Node.js. CEMS enables students to discover and register for campus events, organizers to create and manage events, and administrators to oversee the entire platform.

## 🚀 Live Deployment

- **Frontend:** https://cems-tqss.vercel.app/
- **Backend API:** https://cems-phi.vercel.app/api/
- **Status:** ✅ Production Ready

### Default Admin Credentials
- **Email:** admin@college.ed
- **Password:** Admin@12345

*Note: Admin user is automatically created on server startup if not exists.*

## ✨ Features

### For Students
- Browse and discover campus events
- Quick event registration with one click
- QR code generation for event check-in
- Email notifications and reminders
- View registered events and attendance history
- Modern toast notifications for all actions

### For Organizers
- Create and publish events
- Manage event registrations
- QR code scanning for attendance tracking
- Automated email reminders to attendees
- View event analytics and statistics
- Real-time participant management

### For Administrators
- Platform-wide oversight and management
- Event approval system
- Comprehensive analytics dashboard
- User management and role assignment
- System monitoring and statistics
- Auto-admin initialization system

## 🎯 Production Features

### User Experience
- **Modern UI/UX:** Clean, professional interface without emojis
- **Toast Notifications:** Real-time feedback using Sonner library
- **Error Handling:** Graceful error boundaries and 404 pages
- **Responsive Design:** Works seamlessly on all devices
- **Accessibility:** Screen reader friendly and keyboard navigable

### Security & Performance
- **Production Logging:** Environment-based logging strategy
- **Error Boundaries:** React error boundaries for crash prevention
- **Secure Authentication:** JWT-based with proper error handling
- **Clean Error Messages:** No sensitive information exposure
- **Auto-Admin System:** Automatic admin creation from environment variables

### Developer Experience
- **Clean Codebase:** Production-ready code without debug statements
- **Environment Configuration:** Proper .env setup for all environments
- **Deployment Ready:** Configured for Vercel deployment
- **Error Monitoring:** Comprehensive error tracking and handling

## Tech Stack

### Frontend
- **React 18** - UI library with modern hooks
- **Vite** - Lightning-fast build tool and dev server
- **React Router** - Client-side routing with protected routes
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client with interceptors
- **Sonner** - Modern toast notification system
- **React Error Boundary** - Graceful error handling

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework with middleware
- **MongoDB** - NoSQL database with Atlas cloud
- **Mongoose** - ODM for MongoDB with validation
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing and salting
- **Nodemailer** - Email service with Gmail integration
- **QRCode** - QR code generation for events
- **Node-cron** - Automated scheduled tasks
- **Razorpay** - Payment gateway integration

### Deployment & DevOps
- **Vercel** - Serverless deployment platform
- **GitHub Actions** - CI/CD pipeline
- **Environment Variables** - Secure configuration management
- **Production Logging** - Environment-based logging strategy

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

#### Backend Environment Variables
Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (MongoDB Atlas)
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/CEMS?retryWrites=true&w=majority

# JWT Secret (Generate a strong secret)
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Email Configuration (Gmail)
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-gmail-app-password

# Frontend URL (for CORS and email links)
CLIENT_URL=http://localhost:5173

# Razorpay Configuration (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Auto-Admin Configuration
ADMIN_EMAIL=admin@college.ed
ADMIN_PASSWORD=Admin@12345
ADMIN_NAME=System Administrator
```

#### Frontend Environment Variables
Create a `.env` file in the `client` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

#### Production Environment Variables
For production deployment, update the URLs:

**Backend (.env):**
```env
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.vercel.app
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-backend-domain.vercel.app/api
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

## 🔒 Security

- **JWT Authentication:** Secure token-based authentication
- **Password Security:** bcryptjs hashing with salt rounds
- **Role-Based Access Control (RBAC):** Student, Organizer, Admin roles
- **Protected Routes:** Middleware-based route protection
- **CORS Configuration:** Secure cross-origin resource sharing
- **Environment Variables:** Sensitive data protection
- **Error Handling:** No sensitive information in error responses
- **Auto-Admin System:** Secure admin initialization

## 🚀 Deployment

### Vercel Deployment (Recommended)

#### Backend Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

#### Frontend Deployment
1. Create separate Vercel project for frontend
2. Set `VITE_API_URL` environment variable
3. Deploy with automatic builds

### Environment Variables for Production

**Backend (Vercel):**
- `NODE_ENV=production`
- `MONGO_URI=<your-mongodb-atlas-uri>`
- `JWT_SECRET=<secure-secret>`
- `MAIL_USER=<gmail-address>`
- `MAIL_PASS=<gmail-app-password>`
- `ADMIN_EMAIL=admin@college.ed`
- `ADMIN_PASSWORD=<secure-password>`
- `RAZORPAY_KEY_ID=<razorpay-key>`
- `RAZORPAY_KEY_SECRET=<razorpay-secret>`

**Frontend (Vercel):**
- `VITE_API_URL=https://your-backend.vercel.app/api`

## 📊 Production Monitoring

### Error Handling
- React Error Boundaries for frontend crashes
- Comprehensive backend error handling
- Production-safe error messages
- 404 and error page handling

### Logging Strategy
- Development: Detailed console logging
- Production: Minimal, secure logging
- Environment-based log levels
- No sensitive data in logs

### Performance
- Optimized build processes
- Lazy loading and code splitting
- Efficient API calls with caching
- Responsive design for all devices

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## 📈 Project Status

- ✅ **Production Ready:** Fully deployed and operational
- ✅ **Error Handling:** Comprehensive error boundaries and handling
- ✅ **Modern UI:** Clean, professional interface with toast notifications
- ✅ **Security:** JWT authentication with role-based access control
- ✅ **Performance:** Optimized for production deployment
- ✅ **Monitoring:** Environment-based logging and error tracking

## 🛠️ Development Workflow

### Code Quality
- Clean, production-ready codebase
- No debug statements or console logs in production
- Consistent error handling patterns
- Professional UI without emojis or casual elements

### Testing
- Manual testing across all user roles
- Error scenario testing
- Cross-browser compatibility
- Mobile responsiveness testing

## 📞 Support

For support or questions:
- Open an issue in the repository
- Check the deployment logs in Vercel dashboard
- Review environment variable configuration

## 🙏 Acknowledgments

- **UI Framework:** React 18 with modern hooks
- **Component Library:** Radix UI for accessibility
- **Icons:** Lucide React for beautiful icons
- **Styling:** Tailwind CSS for utility-first design
- **Notifications:** Sonner for modern toast notifications
- **Deployment:** Vercel for seamless serverless deployment
- **Database:** MongoDB Atlas for cloud database hosting

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**Built with ❤️ for educational institutions to streamline event management and enhance student engagement.**
