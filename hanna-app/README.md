# Hanna Poetry App

A modern, full-stack poetry application built with React (frontend) and Node.js/Express (backend).

## Project Structure

```
hanna-app/
├── frontend/          # React frontend application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Node.js/Express backend API
│   ├── src/
│   │   ├── routes/    # API routes
│   │   ├── middleware/# Custom middleware
│   │   ├── models/    # Data models
│   │   ├── types/     # TypeScript types
│   │   └── index.ts   # Main server file
│   └── package.json
└── README.md
```

## Features

### Frontend
- 🎨 Modern React UI with TypeScript
- 🎭 Beautiful animations with Framer Motion
- 📱 Responsive design with Tailwind CSS
- 🎯 Clean component architecture
- ⚡ Fast development with Vite

### Backend
- 🚀 Express.js server with TypeScript
- 🔐 JWT authentication
- 📝 CRUD operations for poems
- 🛡️ Security middleware (Helmet, CORS)
- 📊 Request logging with Morgan
- 🎯 Clean API architecture

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup

1. **Clone and navigate to the project:**
```bash
cd hanna-app
```

2. **Setup Backend:**
```bash
cd backend
npm install
npm run dev
```
The backend will start on http://localhost:5000

3. **Setup Frontend (in a new terminal):**
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Poems
- `GET /api/poems` - Get all public poems
- `GET /api/poems/my` - Get user's poems (protected)
- `GET /api/poems/:id` - Get single poem
- `POST /api/poems` - Create new poem (protected)
- `PUT /api/poems/:id` - Update poem (protected)
- `DELETE /api/poems/:id` - Delete poem (protected)

### Health Check
- `GET /health` - Server health check

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:5173
```

## Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
```

### Frontend Development
```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## Technologies

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- TypeScript
- JWT for authentication
- bcryptjs for password hashing
- Helmet for security
- CORS for cross-origin requests
- Morgan for logging

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 