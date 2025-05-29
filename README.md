# 🎓 CampusConnect - Smart Campus Collaboration Platform

A comprehensive full-stack web application built with Next.js, MongoDB, and modern UI components for campus collaboration and management.

## 🚀 Features

### 🔐 Authentication & Authorization
- **Role-based authentication** (Student, Faculty, Admin)
- **JWT-based security** with HTTP-only cookies
- **Demo accounts** for easy testing
- **Protected routes** and middleware

### 📊 Role-Based Dashboards
- **Student Dashboard**: View assignments, grades, events, notifications
- **Faculty Dashboard**: Create assignments, post notices, manage events
- **Admin Dashboard**: User management, event approval, system analytics

### 🗓️ Events Management (Full CRUD)
- **Create, Read, Update, Delete** events
- **RSVP system** with real-time attendee tracking
- **Category filtering** (Hackathons, Seminars, Workshops, etc.)
- **Search functionality** with real-time results
- **Event approval workflow** for admins

### 🎨 Modern UI/UX
- **Responsive design** with Tailwind CSS
- **Dark/Light theme** support
- **ShadCN UI components** for consistency
- **Smooth animations** with AOS
- **Loading states** and error handling

## 🔑 Demo Credentials

### 👨‍🎓 Student Account
- **Email:** `student@campusconnect.edu`
- **Password:** `student123`
- **Features:** View events, RSVP, access student dashboard

### 👨‍🏫 Faculty Account
- **Email:** `faculty@campusconnect.edu`
- **Password:** `faculty123`
- **Features:** Create events, manage courses, access faculty dashboard

### 🛠️ Admin Account
- **Email:** `admin@campusconnect.edu`
- **Password:** `admin123`
- **Features:** Full system access, user management, event approval

## 🛠️ Tech Stack

- **Frontend:** Next.js 13 (App Router), React, TypeScript
- **Styling:** Tailwind CSS, ShadCN UI, Lucide Icons
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT, bcrypt
- **Animations:** AOS (Animate On Scroll)
- **State Management:** React Context API

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CampusConnect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/campusconnect

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# NextAuth Secret
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Demo Credentials
DEMO_STUDENT_EMAIL=student@campusconnect.edu
DEMO_STUDENT_PASSWORD=student123

DEMO_FACULTY_EMAIL=faculty@campusconnect.edu
DEMO_FACULTY_PASSWORD=faculty123

DEMO_ADMIN_EMAIL=admin@campusconnect.edu
DEMO_ADMIN_PASSWORD=admin123
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env.local
```

### 5. Seed the Database
```bash
# Start the development server first
npm run dev

# Then seed the database (in another terminal)
curl -X POST http://localhost:3000/api/seed
```

### 6. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages & Routes

- **🏠 Landing Page** (`/`) - Public homepage with hero section
- **🔐 Login** (`/login`) - Authentication with demo credentials
- **📝 Register** (`/register`) - User registration
- **📊 Dashboard** (`/dashboard`) - Role-based dashboard
- **🗓️ Events** (`/events`) - Event listing with CRUD operations

## 🔄 CRUD Operations

### Events
- ✅ **Create:** Faculty/Admin can create new events
- ✅ **Read:** All users can view approved events
- ✅ **Update:** Event organizers can edit their events
- ✅ **Delete:** Event organizers can delete their events
- ✅ **RSVP:** Students can register/unregister for events

### Users
- ✅ **Create:** Registration system
- ✅ **Read:** User profiles and authentication
- ✅ **Update:** Profile management
- ✅ **Delete:** Admin user management

## 🧪 Testing the Application

1. **Visit the landing page** at `http://localhost:3000`
2. **Login with demo credentials** (see above)
3. **Test role-based features:**
   - Student: View and RSVP to events
   - Faculty: Create and manage events
   - Admin: Approve events and manage users
4. **Test CRUD operations:**
   - Create new events (Faculty/Admin)
   - Search and filter events
   - RSVP to events (Students)
   - Edit/delete your events

## 📁 Project Structure

```
CampusConnect/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── events/           # Events pages
│   └── login/            # Authentication pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── events/           # Event components
│   └── ui/               # ShadCN UI components
├── lib/                  # Utilities and configurations
│   ├── models/           # MongoDB models
│   ├── auth.ts           # Authentication utilities
│   └── mongodb.ts        # Database connection
└── types/                # TypeScript type definitions
```

## 🚀 Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service.

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for campus communities**
