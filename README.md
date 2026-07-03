# CareerConnect

A LinkedIn-inspired full-stack Job Portal built with the MERN stack.

## 🚀 Live Features

### Job Portal
- Search and filter jobs by keyword, location, type, experience
- Apply for jobs with cover letter
- Track application status in real-time

### Authentication
- JWT-based secure authentication
- Role-based access (Job Seeker / Recruiter)
- Protected routes

### Professional Networking
- Send/accept/reject connection requests
- View your professional network
- Real-time notifications via Socket.io

### Company Pages
- Browse company profiles
- View open positions per company
- Company information and details

### Recruiter Tools
- Post and manage job listings
- Review applications
- Update application status (pending/reviewing/shortlisted/hired/rejected)

### User Profiles
- Edit profile (name, bio, skills)
- Upload profile picture and resume via Cloudinary

## 🛠️ Tech Stack

**Frontend:**
- React.js + Vite
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Router
- Axios

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.io (real-time notifications)
- Cloudinary (file uploads)

## 📁 Project Structure
careerconnect/
├── client/          # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── services/
│       └── hooks/
└── server/          # Node.js backend
├── models/
├── controllers/
├── routes/
├── middleware/
├── config/
└── utils/

## ⚙️ Setup Instructions

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

### Environment Variables (server/.env)
MONGO_URI=mongodb://localhost:27017/careerconnect
PORT=5000
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

## 👨‍💻 Author
Zaheer Mushtaq — Full Stack Developer