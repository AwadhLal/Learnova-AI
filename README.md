# Learnova AI — Production AI-Powered Learning Management Platform

**Learnova AI** is a commercial-grade, full-stack EdTech SaaS platform designed to deliver personalized learning experiences for students and comprehensive administrative tools for educational managers. Built using the **MERN Stack** (MongoDB, Express.js, React, Node.js), Learnova AI integrates real-time **Google Gemini AI tutoring**, module quiz evaluations, Razorpay payment processing, and Cloudinary media management.

---

## 🌟 Key Features

### 🎓 1. Student Portal
* **Interactive Dashboard**: Track course progress percentages, completed lessons, upcoming assignments, and personalized AI learning recommendations.
* **Course Catalog**: Filterable course directory with category tags, skill levels (Beginner, Intermediate, Advanced), price sorting, and dynamic search.
* **3-Pane Learning Player**: Modern course consumption interface featuring a Curriculum Navigation Tree, Lesson Reader/Video Player, Personal Notes Manager, and an AI Tutor Assistant.
* **Contextual AI Tutor**: Real-time Gemini AI assistance tailored to the current course and lesson. Supports 4 instruction modes:
  * `Direct`: Comprehensive explanations with step-by-step breakdowns.
  * `Hints`: Socratic guidance and conceptual hints without revealing final answers.
  * `Hinglish`: Explanations in natural Roman Hinglish with relatable analogies.
  * `Summary`: Bulleted key takeaways and flashcard summaries.
* **Module Quizzes & Assessments**: Interactive multiple-choice quizzes with dynamic score calculation, weak topic identification, and persisted progress tracking.
* **Secure Auth & Account Recovery**: JWT authentication, protected routes, and self-service password reset requesting.

### 🛡️ 2. Admin Panel
* **Real MongoDB Analytics**: Real-time metric cards (Total Revenue, Active Students, Enrollment Counts, Completion Rates, Average Quiz Scores) and dynamic monthly growth charts powered by MongoDB aggregations.
* **Course Management System**: Full CRUD suite to author courses, design curriculum modules, write text/video lessons, create quizzes, and upload thumbnails via Cloudinary.
* **Student Manager**: Search student accounts, inspect enrollment counts, and activate/deactivate student access. Deactivated accounts are automatically blocked by backend authorization middleware.
* **Financial Payment Audit**: Transaction log table tracking Razorpay Order IDs, Payment IDs, timestamps, student names, and payment statuses.

---

## 🏗️ Tech Stack & Architecture

* **Frontend**: React 18, Vite, Tailwind CSS (Glassmorphism design system), Lucide Icons, Chart.js, Axios.
* **Backend**: Node.js, Express.js, Mongoose (MongoDB ORM), JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `multer`, `helmet`, `cors`, `express-rate-limit`.
* **Services & Integrations**:
  * **AI Service**: Google Gemini AI (`@google/genai`) using `gemini-2.5-flash` (with exponential backoff for 503 capacity limits)
  * **Payments**: Razorpay Gateway SDK
  * **Media Storage**: Cloudinary SDK (`multer` memory storage)
  * **Transactional Emails**: Nodemailer (SMTP)

---

## 📁 Repository Structure

```
Learnova AI/
├── backend/
│   ├── config/           # Database, Razorpay, Cloudinary configurations
│   ├── controllers/      # Auth, Admin, Course, Payment, Quiz controllers
│   ├── middleware/       # JWT Auth, Role-Based Access Control, Error Handler
│   ├── models/           # Mongoose Data Schemas (User, Course, Module, Payment, etc.)
│   ├── routes/           # REST API Endpoint Definitions
│   ├── seed/             # Safe manual database seeding script
│   ├── services/         # AI Service, Email Service, Cloudinary Service
│   ├── .env.example      # Production environment template
│   └── server.js         # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # UI components (Header, Footer, Modals, Cards)
│   │   ├── context/      # AuthContext, ToastContext
│   │   ├── pages/        # Student & Admin pages
│   │   └── services/     # Axios API configuration
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Environment Setup & Installation

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher
* **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster URI
* **Razorpay Test Account**: Key ID & Key Secret
* **Cloudinary Account**: Cloud Name, API Key, API Secret
* **Google Gemini API Key**: `GEMINI_API_KEY`

---

### 2. Backend Configuration

Navigate to the `backend/` directory:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder based on `.env.example`:

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/learnova_ai
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173

# Nodemailer SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM="Learnova AI <no-reply@learnova.ai>"

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Test Mode
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:
```bash
npm run dev
```

---

### 3. Optional Development Data Seeding

To populate initial categories, courses, modules, and administrative accounts for testing, run:

```bash
npm run seed
```
> ⚠️ **Note**: Seeding is strictly an optional manual CLI command and will **never** automatically execute when starting the production server.

---

### 4. Frontend Configuration

Navigate to the `frontend/` directory:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173).

---

## 📦 Production Build

To create an optimized production build of the React frontend:

```bash
cd frontend
npm run build
```

The compiled output will be generated in `frontend/dist/`.

---

## 🔒 Security & Deployment Checklist

- [x] Passwords hashed with `bcryptjs` (salt factor 10).
- [x] Authentication tokens issued via JWT with expiration enforcement.
- [x] Admin routes protected by `protect` and `authorize('admin')` backend middlewares.
- [x] Account deactivation verified in `authMiddleware.js` to reject suspended users.
- [x] Payment verification checks Razorpay HMAC SHA256 signatures server-side.
- [x] Strict CORS configured via `process.env.CLIENT_URL`.
- [x] Environment files (`.env`) excluded from version control via `.gitignore`.

---

## 📄 License

This project is licensed under the MIT License.
