# Full-Stack Monorepo with React Frontend and FastAPI Backend

A comprehensive full-stack application with Google OAuth authentication, role-based access control, and modern UI/UX.

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + ShadCN UI
- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Authentication**: Google OAuth + JWT with HTTP-only cookies
- **Database**: SQLite with auto-migrations
- **Deployment**: Production-ready with environment configuration

## 📋 Prerequisites

- **Node.js**: >= 18.0.0
- **Python**: >= 3.9.0
- **npm**: >= 8.0.0
- **pip**: Latest version

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Install all dependencies (root, frontend, and backend)
npm run setup
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
nano .env  # or use your preferred editor
```

### 3. Configure Google OAuth

Follow the **Google Cloud Console Setup** section below to get your OAuth credentials.

### 4. Run Development Server

```bash
# Start both frontend and backend concurrently
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🔧 Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project" or select an existing project
3. Enter project name and click "Create"

### Step 2: Enable Google+ API

1. In the left sidebar, go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google+ API" and click "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have Google Workspace)
3. Fill in required fields:
   - **App name**: Your app name
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (emails that can login during development)

### Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Configure:
   - **Name**: Your app name
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (development)
     - Your production domain
   - **Authorized redirect URIs**:
     - `http://localhost:3000` (development)
     - Your production domain

### Step 5: Copy Credentials to .env

Copy the **Client ID** and **Client Secret** to your `.env` file:

```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## ⚙️ Environment Variables

### Required Configuration

```env
# Frontend
VITE_FRONTEND_PORT=3000
VITE_BACKEND_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Backend
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Security
JWT_SECRET_KEY=generate_a_secure_random_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=24

# Domain Control
ALLOWED_DOMAINS=yourdomain.com,anotherdomain.com
ADMIN_EMAILS=admin@yourdomain.com,admin2@yourdomain.com
```

### Generating JWT Secret

```bash
# Generate a secure random key
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## 🗃️ Database Schema

### Users Table
- `id`: Primary key (integer, auto-increment)
- `email`: Unique, not null (validated against ALLOWED_DOMAINS)
- `first_name`: 2-30 characters, nullable
- `last_name`: 2-30 characters, nullable  
- `role`: "admin" or "client" (default: "client")
- `created_at`: Timestamp (auto)
- `updated_at`: Timestamp (auto)

## 🛡️ Authentication Flow

1. **Login**: User clicks "Sign in with Google"
2. **OAuth**: Google redirects with authorization code
3. **Validation**: Backend validates token and checks allowed domains
4. **User Creation**: New users are created with "client" role
5. **Admin Assignment**: Users in ADMIN_EMAILS get "admin" role
6. **JWT Cookie**: HTTP-only secure cookie is set
7. **Routing**: Users redirected based on role and profile completeness

## 🎯 API Endpoints

### Authentication
- `POST /auth/login` - Google OAuth login
- `POST /auth/logout` - Logout and invalidate token

### Users
- `GET /users/{user_id}` - Get user profile (authenticated)
- `PATCH /users/{user_id}` - Update user profile (authenticated)
- `GET /users` - List all users (admin only, with pagination)

## 🎨 Frontend Routes

### Public Routes
- `/login` - Google OAuth login page

### Protected Routes (Client)
- `/dashboard` - Client dashboard
- `/profile` - Edit profile

### Protected Routes (Admin)
- `/admin/dashboard` - Admin dashboard with user statistics
- `/profile` - Edit profile

## 📝 Development Commands

```bash
# Install dependencies
npm run install:all

# Development (both services)
npm run dev

# Frontend only
npm run dev:frontend

# Backend only  
npm run dev:backend

# Build for production
npm run build

# Frontend development server with custom port
cd frontend && VITE_PORT=3001 npm run dev

# Backend with custom port
cd backend && uvicorn app.main:app --reload --port 8001
```

## 🚀 Production Deployment

### Frontend Build
```bash
npm run build:frontend
# Static files will be in frontend/dist/
```

### Backend Deployment
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Environment Variables for Production
- Set `FRONTEND_URL` to your production domain
- Set `VITE_BACKEND_URL` to your backend API URL
- Generate secure `JWT_SECRET_KEY`
- Configure production Google OAuth URLs
- Set appropriate `ALLOWED_DOMAINS` and `ADMIN_EMAILS`

## 🔒 Security Features

- **HTTP-only JWT cookies** prevent XSS attacks
- **Domain validation** restricts user registration
- **Role-based access control** protects admin routes
- **Input validation** on all forms and API endpoints
- **Secure password-less authentication** via Google OAuth

## 📚 Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **ShadCN UI** - Component library
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM and database toolkit
- **SQLite** - Embedded database
- **Pydantic** - Data validation
- **python-jose** - JWT handling
- **google-auth** - Google OAuth validation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.