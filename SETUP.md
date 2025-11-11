# Setup Instructions

## Prerequisites
- Node.js 18+ installed
- pnpm package manager
- Access to Neon PostgreSQL database

## Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Variables
The `.env` file has been created with your configuration. Verify it contains:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret for auth encryption
- `BETTER_AUTH_URL` - Auth API base URL
- `NEXT_PUBLIC_APP_URL` - Public app URL
- `ADMIN_EMAIL` & `ADMIN_PASSWORD` - Optional admin credentials

### 3. Push Database Schema
```bash
pnpm db:push
```

This will sync your database schema with the Neon database.

### 4. (Optional) Seed Database
If you want to create an initial admin user:
```bash
pnpm db:seed
```

### 5. Run Development Server
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Features Implemented

### 🏠 Home Page (`/`)
- Welcome page with hero section
- Feature cards highlighting key functionality
- Dynamic navigation based on authentication state
- Links to login and player roster

### 🔐 Login Page (`/login`)
- Email/password authentication
- Toggle between Sign In and Sign Up modes
- Form validation and error handling
- Automatic redirect to roster after successful auth
- Clean, responsive design using Shadcn UI components

### 👥 Player Roster Page (`/roster`)
- View all registered players
- Displays player name, email, join date, and role
- Admin badge for admin users
- Empty state with call-to-action for new users
- Protected API endpoint at `/api/players`

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Authentication**: Better Auth
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn-inspired components

## Next Steps
1. Run `pnpm dev` to start the development server
2. Visit `/login` to create your first account
3. Check `/roster` to see all players
4. Start building additional features like match tracking!

## Troubleshooting

### Database Connection Issues
If you encounter database connection errors, verify:
- Your DATABASE_URL is correct
- Your Neon database is active
- You have network connectivity to the Neon servers

### Auth Not Working
Ensure:
- BETTER_AUTH_SECRET is set and has sufficient length
- BETTER_AUTH_URL matches your app URL
- Database schema is pushed (run `pnpm db:push`)
