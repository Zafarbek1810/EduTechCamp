# EduCRM - Educational Center CRM System

A full-featured CRM system for educational centers built with React, Vite, TailwindCSS, and shadcn/ui.

## Features

### 🔐 Authentication System
- Role-based authentication (Admin, Teacher, Student)
- Mock login system with hardcoded users
- Protected routes based on user roles

### 👨‍💼 Admin Features
- Dashboard with charts and statistics
- Teacher and student management
- Shop products management
- Payment tracking
- Teacher performance and salary calculations

### 👨‍🏫 Teacher Features
- Dashboard with group statistics
- Lesson management
- Attendance tracking
- Student performance monitoring
- Points assignment

### 👨‍🎓 Student Features
- Personal dashboard with progress tracking
- Points system and shop
- Group information
- Achievement tracking

### 🛍️ Shop System
- Points-based reward system
- Product management (Admin)
- Purchase history
- Points earning mechanisms

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd edu
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Demo Accounts

Use these credentials to test different user roles:

- **Admin**: `admin` / `password`
- **Teacher**: `teacher1` / `password`
- **Student**: `student1` / `password`

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   └── layout/       # Layout components
├── pages/
│   ├── admin/        # Admin pages
│   ├── teacher/      # Teacher pages
│   └── student/      # Student pages
├── store/            # Zustand stores
├── lib/              # Utility functions
└── App.tsx           # Main app component
```

## Key Features

### State Management
- **AuthStore**: Handles authentication and user state
- **ShopStore**: Manages products and student points

### Responsive Design
- Mobile-first approach with TailwindCSS
- Responsive charts and layouts
- Touch-friendly interface

### Role-Based Access
- Protected routes for each user role
- Role-specific navigation menus
- Conditional rendering based on permissions

## Development

### Adding New Features
1. Create new components in appropriate directories
2. Add routes in `App.tsx`
3. Update navigation in `DashboardLayout.tsx`
4. Add any new state management in stores

### Styling
- Use TailwindCSS classes for styling
- Follow shadcn/ui component patterns
- Maintain consistent spacing and colors

## License

This project is for educational purposes.
