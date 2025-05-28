# Hanna - Personal Writing & Reflection App

A clean, modern web application for personal writing, journaling, and reflection. Built with React, TypeScript, Express, and PostgreSQL.

## 🏗️ Project Structure

```
hanna-app/
├── frontend/          # React + TypeScript + Vite frontend
│   ├── src/          # Source code
│   ├── package.json  # Frontend dependencies
│   └── ...           # Config files (Vite, TypeScript, Tailwind)
├── backend/          # Express + Prisma backend
│   ├── server.js     # Main server file
│   ├── prisma/       # Database schema
│   ├── package.json  # Backend dependencies
│   └── .env.example  # Environment variables template
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

### 1. Clone and Setup
```bash
cd hanna-app
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase password
npm run db:push
npm run dev
```

### 3. Frontend Setup (in new terminal)
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the App
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🔧 Environment Variables

Copy `backend/.env.example` to `backend/.env` and update:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.szahkpbxsdvhkspihefj.supabase.co:5432/postgres"
PORT=3001
NODE_ENV=development
```

## 📝 Features

- ✅ Create and edit writings
- ✅ Organize content in sections
- ✅ Rich text editing
- ✅ Responsive design
- ✅ Clean, modern UI

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Lucide React (icons)

**Backend:**
- Express.js
- Prisma ORM
- PostgreSQL (Supabase)
- CORS enabled

## 📦 Available Scripts

**Backend:**
- `npm run dev` - Start development server
- `npm run db:push` - Push schema to database
- `npm start` - Start production server

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🚀 Deployment

The app is ready for deployment to:
- **Frontend**: Vercel, Netlify, or any static host
- **Backend**: Vercel, Railway, Render, or any Node.js host

Make sure to set environment variables in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes. 