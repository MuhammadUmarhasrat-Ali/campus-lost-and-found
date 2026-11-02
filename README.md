# 🎓 Campus Lost & Found — Full-Stack Web Application

A modern, production-ready, full-stack Lost and Found web application designed for college campus communities. Built for students, faculty, and campus security to report lost belongings, list found items, safely connect with finders/owners, and resolve claims efficiently.

Designed and developed to meet academic software engineering standards for final-year college projects.

---

## 🎨 Design System & Color Palette

Inspired by clean, modern student portal aesthetics with soft lavender accents and subtle gradients:

| Token | Hex Value | Purpose |
| :--- | :--- | :--- |
| **Main Background** | `#FFFFFF` | Primary interface canvas |
| **Secondary Background** | `#F7F7FA` | Sections, inputs, and alternating areas |
| **Card Background** | `#F1E9FA` | Soft pastel lavender item cards and highlights |
| **Primary Accent** | `#8B45E8` | Elegant purple brand accent & active states |
| **Secondary Accent** | `#4263EB` | Soft blue accent |
| **Primary Gradient** | `from-[#4263EB] to-[#8B45E8]` | Primary action buttons and selected pills |
| **Borders** | `#E8E8ED` | Subtle dividers and card borders |
| **Text Primary** | `#252525` | Dark charcoal high-contrast headings |
| **Text Muted** | `#858585` | Subtitles and metadata |
| **Found Badge** | `#16B978` | Soft green badge for FOUND items |
| **Lost Badge** | `#E84383` | Soft pink badge for LOST items |

---

## 🚀 Key Features

### Student & Public Features
- **Public Homepage**: Hero section with search bar, live database metrics, 3-step process overview, recently reported items carousel, and category explorer.
- **Browse & Filter Hub**:
  - Live search across title, description, and campus location.
  - Multi-criteria filtering: Lost / Found, Category pills, Location, Status (Active, Claimed, Resolved), Date ranges.
  - Sorting by newest, oldest, and event dates with pagination.
- **Reporting Forms**:
  - **Report Lost Item**: Detailed form with category, approximate time, campus location, specific identifying marks, contact preferences, and image upload.
  - **Report Found Item**: Form with safety guidelines encouraging students to submit valuables to security.
  - **Image Uploads**: Drag-and-drop file upload with real-time image previews (JPG, PNG, WEBP up to 5MB) powered by Cloudinary (with automatic local disk fallback).
- **Item Details & In-App Contact Claims**:
  - High-resolution photograph gallery with thumbnails.
  - Comprehensive item metadata and campus location.
  - Privacy safeguards: Students can submit in-app contact/claim inquiries with descriptions of proof without exposing private phone numbers publicly.
  - Owners can accept/reject claim requests. Once accepted, verified peer email and phone details are securely revealed.
  - Flagging: Students can report inappropriate, fraudulent, or duplicate listings.
- **Student Dashboard**:
  - Real-time personal statistics (my lost items, my found items, active posts, resolved items).
  - Quick action shortcuts (Report Lost, Report Found, Browse, My Posts).
  - Incoming claim requests manager with one-click Accept / Decline actions.
- **Personal Post Management ("My Posts")**:
  - Tabbed overview (All, Lost, Found, Active, Resolved).
  - Edit post details, replace/add photos, update item status (Active → Claimed → Resolved).
  - Delete posts with double-confirmation dialogs.
- **Profile & Security**:
  - Profile overview with verified student roll number and email.
  - Change password flow and profile information updater.
  - Forgot password with secure crypto token generation (with local simulation fallback if SMTP is unconfigured).

### Administrator & Moderation Features
- **Administrative Dashboard**:
  - Global metrics: total registered students, total lost/found posts, active cases, resolved items, and content reports.
- **User Account Management**:
  - List and search all registered students and staff.
  - Suspend or reactivate user accounts with immediate revocation of privileges.
- **Content Moderation**:
  - View all campus listings, inspect reports, and remove inappropriate or spam posts.
  - Clean up associated images and contact threads on deletion.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18 with Vite
- **Styling**: Tailwind CSS with custom theme extensions
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with credentials & dual-mode authorization interceptors
- **Forms & Validation**: React Hook Form with Zod schema validation
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js (v20+)
- **Server Framework**: Express.js (RESTful architecture)
- **Database ODM**: Mongoose with MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens) with HttpOnly secure cookies & Bearer fallback
- **Password Security**: bcryptjs (10 salt rounds)
- **Security Middleware**: Helmet, CORS, Express-Rate-Limit
- **File Uploads**: Multer with Cloudinary integration & local disk storage fallback
- **Automated Testing**: Vitest & Supertest

---

## 📁 Project Folder Structure

```
campus-lost-and-found/
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Badge.jsx             # Lost, Found, Status badges
│   │   │   │   ├── Button.jsx            # Gradient & solid styled buttons
│   │   │   │   ├── ConfirmationModal.jsx # Action double-confirmation dialog
│   │   │   │   ├── Footer.jsx            # Campus info & links
│   │   │   │   ├── ImageUpload.jsx       # Drag-and-drop image upload & preview
│   │   │   │   ├── Modal.jsx             # Accessible modal backdrop
│   │   │   │   ├── Navbar.jsx            # Responsive navigation & notification badge
│   │   │   │   └── Pagination.jsx        # Page navigation control
│   │   │   ├── dashboard/
│   │   │   │   └── StatCard.jsx          # Metric cards
│   │   │   └── items/
│   │   │       ├── ItemCard.jsx          # Lavender item card component
│   │   │       └── ItemFilter.jsx        # Search, pills, and advanced filters
│   │   ├── context/
│   │   │   ├── AuthContext.jsx           # Global user authentication state
│   │   │   └── ToastContext.jsx          # In-app toast alerts
│   │   ├── layouts/
│   │   │   └── RootLayout.jsx            # Navbar + Main Content + Footer
│   │   ├── pages/
│   │   │   ├── AdminDashboardPage.jsx    # Moderation & student accounts
│   │   │   ├── BrowseItemsPage.jsx       # Grid with search and filters
│   │   │   ├── ContactRequestsPage.jsx   # Sent & received claim requests
│   │   │   ├── DashboardPage.jsx         # Student personalized dashboard
│   │   │   ├── EditItemPage.jsx          # Update post details & photos
│   │   │   ├── ForgotPasswordPage.jsx    # Request password reset token
│   │   │   ├── HomePage.jsx              # Landing page with hero & live stats
│   │   │   ├── ItemDetailsPage.jsx       # Details, photo gallery & contact claim modal
│   │   │   ├── LoginPage.jsx             # Login with demo accounts quick-fill
│   │   │   ├── MyPostsPage.jsx           # Personal posts management
│   │   │   ├── NotFoundPage.jsx          # 404 handler
│   │   │   ├── ProfilePage.jsx           # Profile & change password
│   │   │   ├── RegisterPage.jsx          # Student registration
│   │   │   ├── ReportFoundPage.jsx       # Found item submission
│   │   │   ├── ReportLostPage.jsx        # Lost item submission
│   │   │   └── ResetPasswordPage.jsx     # Reset password form
│   │   ├── routes/
│   │   │   ├── AdminRoute.jsx            # Role-based admin route wrapper
│   │   │   ├── AppRoutes.jsx             # Route definitions
│   │   │   └── ProtectedRoute.jsx        # Authentication route wrapper
│   │   ├── services/
│   │   │   └── api.js                    # Axios instance with credentials
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   ├── cloudinary.js                 # Cloudinary config with fallback
│   │   └── db.js                         # MongoDB connection with In-Memory fallback
│   ├── controllers/
│   │   ├── adminController.js            # User management & moderation
│   │   ├── authController.js             # Register, login, me, reset password
│   │   ├── contactController.js          # In-app claims and requests
│   │   ├── itemController.js             # CRUD, search, filter, stats
│   │   ├── reportController.js           # Content flag reports
│   │   └── userController.js             # Profile & password updates
│   ├── middleware/
│   │   ├── adminMiddleware.js            # Role verification
│   │   ├── authMiddleware.js             # JWT verification (cookie + header)
│   │   ├── errorMiddleware.js            # Global error handling
│   │   └── uploadMiddleware.js           # Multer memory storage & image processing
│   ├── models/
│   │   ├── ContactRequest.js             # Item claim inquiries schema
│   │   ├── Item.js                       # Lost & found item schema
│   │   ├── Report.js                     # Inappropriate content flags
│   │   └── User.js                       # Student & Admin account schema
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── reportRoutes.js
│   │   └── userRoutes.js
│   ├── scripts/
│   │   ├── createAdmin.js                # Server-side admin account creation
│   │   └── seedData.js                   # High-quality demo data seeder
│   ├── tests/
│   │   └── api.test.js                   # Automated Vitest/Supertest suite
│   ├── utils/
│   │   ├── generateToken.js              # JWT & HttpOnly cookie handler
│   │   └── sendEmail.js                  # Nodemailer with simulated dev fallback
│   ├── validators/
│   │   ├── authValidator.js              # Zod schemas for auth & profile
│   │   └── itemValidator.js              # Zod schemas for items & requests
│   ├── server.js
│   └── package.json
│
├── README.md
├── package.json
└── .gitignore
```

---

## 🗄️ Database Design

### 1. `users` Collection
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique user identifier |
| `name` | String | Required | Full name of student/admin |
| `email` | String | Required, Unique, Indexed | College email address |
| `passwordHash` | String | Required, Hidden in JSON | bcrypt hashed password |
| `studentId` | String | Required, Unique, Indexed | Roll number or campus ID |
| `department` | String | Required | Academic department |
| `academicYear` | String | Required | Year or current semester |
| `phone` | String | Optional | Student contact phone |
| `role` | String | Enum: `['student', 'admin']` | Account permission level |
| `isActive` | Boolean | Default: `true` | Account activation state |
| `createdAt` | Date | Timestamp | Account creation date |

### 2. `items` Collection
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique item identifier |
| `title` | String | Required, Indexed | Item title / name |
| `description` | String | Required | Comprehensive item details |
| `category` | String | Required, Indexed | Category from standard list |
| `type` | String | Required, Enum: `['lost', 'found']` | Post type |
| `images` | Array | `[{ url, publicId }]` | Cloudinary or uploaded images |
| `location` | String | Required, Indexed | Campus location (e.g. Lab 3, Library) |
| `eventDate` | Date | Required, Indexed | Date item was lost or found |
| `eventTime` | String | Optional | Approximate time |
| `additionalDetails` | String | Optional | Identifying marks / handover notes |
| `contactPreference`| String | Enum: `['in_app', 'email', 'phone', 'any']` | Privacy contact setting |
| `status` | String | Enum: `['active', 'claimed', 'resolved', 'closed']` | Current status |
| `user` | ObjectId | Ref: `User`, Required, Indexed | Poster reference |
| `createdAt` | Date | Timestamp | Post creation date |

### 3. `contactrequests` Collection
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique request identifier |
| `item` | ObjectId | Ref: `Item`, Required, Indexed | Target item post |
| `sender` | ObjectId | Ref: `User`, Required | Student sending inquiry |
| `recipient` | ObjectId | Ref: `User`, Required | Poster receiving inquiry |
| `message` | String | Required | Explanation of claim or inquiry |
| `phone` | String | Optional | Sender contact number |
| `status` | String | Enum: `['pending', 'accepted', 'rejected', 'completed']` | Request status |

### 4. `reports` Collection
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | Unique report identifier |
| `reportedItem` | ObjectId | Ref: `Item`, Required | Flagged item post |
| `reportedBy` | ObjectId | Ref: `User`, Required | Student filing report |
| `reason` | String | Required, Enum | Reason for moderation |
| `description` | String | Required | Detailed explanation |
| `status` | String | Enum: `['pending', 'reviewed', 'dismissed', 'resolved']` | Moderation status |

---

## ⚡ Installation & Quickstart Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 1. Clone or Open the Workspace
```bash
git clone <repository-url>
cd campus-lost-and-found
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Variables Setup
Both `server` and `client` include ready `.env.example` templates.

In `server/`:
```bash
cp .env.example .env
```
*(By default, zero configuration is needed for local development: if MongoDB Atlas credentials are not yet entered, the server automatically starts an In-Memory MongoDB instance!)*

In `client/`:
```bash
cp .env.example .env
```

### 4. Seed High-Quality Sample Data
Populate the database with realistic campus accounts (Admin, Students, active and resolved items):
```bash
cd server
npm run seed
```

Demo Accounts created:
- **Administrator**:
  - Email: `admin@campus.edu`
  - Password: `Admin@123456`
- **Student (Rahul Sharma)**:
  - Email: `rahul@campus.edu`
  - Password: `Password@123`
- **Student (Priya Patel)**:
  - Email: `priya@campus.edu`
  - Password: `Password@123`
- **Student (Arjun Verma)**:
  - Email: `arjun@campus.edu`
  - Password: `Password@123`

### 5. Running the Application

Open two terminal windows:

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Vite client runs on http://localhost:5173
```

Navigate to `http://localhost:5173` in your browser.

---

## 🌐 External Credentials Guide (Optional Production Setup)

The application runs **100% out-of-the-box** in development. When deploying to production, configure the following in `server/.env`:

### 1. MongoDB Atlas
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under "Database Access", create a database user and password.
3. Under "Network Access", add IP address `0.0.0.0/0` (Allow Access from Anywhere).
4. Click **Connect** → **Drivers** and copy your connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campus_lost_found?retryWrites=true&w=majority
   ```

### 2. Cloudinary (Image Storage)
1. Sign up for a free account at [Cloudinary](https://cloudinary.com/).
2. On your Cloudinary Dashboard, copy the Cloud Name, API Key, and API Secret:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
*(Note: If left blank, images are automatically saved locally to `server/uploads/` and served via static route).*

### 3. SMTP Email (Password Resets)
For Gmail SMTP:
1. Enable 2-Step Verification on your Google Account.
2. Generate an **App Password** for "Mail".
3. Add credentials:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_digit_app_password
   ```
*(Note: If left blank, reset links and tokens are automatically logged to the terminal and shown directly in the UI for instant testing).*

---

## 📡 REST API Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new student account |
| `POST` | `/api/auth/login` | Public | Authenticate user & set secure cookie |
| `POST` | `/api/auth/logout` | Public | Clear authentication cookie |
| `GET` | `/api/auth/me` | Private | Retrieve currently authenticated user |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset token |
| `POST` | `/api/auth/reset-password` | Public | Reset password using verified token |

### Item Endpoints (`/api/items`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/items` | Public | Browse items with search, filters & pagination |
| `GET` | `/api/items/stats` | Public | Real campus statistics (lost, found, resolved) |
| `GET` | `/api/items/:id` | Public | Retrieve full item details |
| `POST` | `/api/items` | Private | Report a lost or found item (Multipart) |
| `PUT` | `/api/items/:id` | Private (Owner/Admin) | Update item details and photographs |
| `DELETE`| `/api/items/:id` | Private (Owner/Admin) | Delete item post and clean up images |
| `GET` | `/api/items/my-posts` | Private | Get current user's posted items |
| `PATCH`| `/api/items/:id/status`| Private (Owner/Admin) | Update status (`active`, `claimed`, `resolved`) |

### Contact / Claim Endpoints (`/api/contact-requests`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contact-requests` | Private | Submit claim inquiry on an item |
| `GET` | `/api/contact-requests` | Public / Private | Retrieve contact requests via MongoDB aggregation with joined item and user details |
| `PATCH`| `/api/contact-requests/:id` | Private | Accept, decline, or complete a claim |

### Content Report Endpoints (`/api/reports`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reports` | Private | Flag an inappropriate post for review |

### Admin Moderation Endpoints (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Admin Only | System metrics & moderation overview |
| `GET` | `/api/admin/users` | Admin Only | List & search registered users |
| `PATCH`| `/api/admin/users/:id/status`| Admin Only | Suspend or reactivate student accounts |
| `GET` | `/api/admin/items` | Admin Only | List all posts for moderation |
| `DELETE`| `/api/admin/items/:id` | Admin Only | Remove inappropriate post |
| `GET` | `/api/admin/reports` | Admin Only | List all reported content flags |
| `PATCH`| `/api/admin/reports/:id` | Admin Only | Update report status (dismiss/resolve) |

---

## 🧪 Automated Testing

The backend includes a comprehensive Vitest & Supertest suite testing:
- Health check endpoints
- Student registration & duplicate prevention
- Login & JWT cookie creation
- Profile verification
- Item creation with location & category
- Search & pagination filters
- Claim requests & status updates
- Role-based authorization & admin access barriers

To run the automated test suite:
```bash
cd server
npm test
```

Expected result:
```
✓ tests/api.test.js (12 tests)
Test Files: 1 passed (1)
Tests:      12 passed (12)
```

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)
1. Push your project to GitHub.
2. In [Vercel](https://vercel.com/), select **Add New Project** and import the repository.
3. Configure the settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   ```
   VITE_API_URL=https://your-backend-render-app.onrender.com/api
   ```
5. Click **Deploy**.

### Backend Deployment (Render)
1. In [Render](https://render.com/), click **New** → **Web Service** and connect your GitHub repository.
2. Set the service details:
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   CLIENT_URL=https://your-vercel-app.vercel.app
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_strong_random_secret_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
4. Click **Create Web Service**. Render provides a health check URL at `/api/health`.

---

## 📋 Academic Project Checklist & Verification

- [x] Complete REST API with Node.js & Express.
- [x] MongoDB database models (Users, Items, ContactRequests, Reports) with compound indexes.
- [x] JWT Authentication with HttpOnly secure cookies & Bearer fallback.
- [x] Password hashing with bcrypt.
- [x] Cloudinary image uploads with Multer & local storage fallback.
- [x] Responsive React frontend styled with custom Tailwind CSS theme.
- [x] Soft pastel lavender card design (`#F1E9FA`) with blue-to-purple button gradients.
- [x] Soft pink badges for LOST items and soft green badges for FOUND items.
- [x] Real database-driven statistics on homepage & dashboard.
- [x] In-app contact claim request system with peer privacy protection.
- [x] Post management: Edit, Delete (with confirmation), and Status updates.
- [x] Admin dashboard with role-based authorization for user and content moderation.
- [x] 100% passing automated test suite (12/12 passing).
- [x] Comprehensive documentation and demo accounts seeder.

---

## 👨‍💻 Academic Software Engineering Project Defense Notes
When presenting this project to faculty or examiners, emphasize:
1. **Security**: Passwords are never stored in plaintext, JWTs are stored in HttpOnly cookies to mitigate XSS vulnerabilities, and role-based checks are strictly enforced on backend routes.
2. **Student Privacy**: Private contact numbers and personal emails are never exposed openly to anonymous viewers; students must submit claim inquiries through the platform.
3. **Database Architecture**: Mongoose schemas use proper referencing (`ObjectId`) between users, items, claims, and reports, along with text and compound indexes for fast search queries.
4. **Resilience**: The system gracefully falls back to local disk storage if Cloudinary keys are missing, and runs an in-memory database for automated testing and zero-friction demonstrations.

