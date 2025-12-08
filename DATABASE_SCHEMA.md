# RevTickets Database Schema Design

## Technology Stack Recommendation
- **Database**: MongoDB (Recommended for flexibility) or PostgreSQL (for ACID compliance)
- **Backend**: Node.js + Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Joi or express-validator

---

## 1. USER SCHEMA

### MongoDB Schema
```javascript
{
  _id: ObjectId,
  email: String (unique, required, lowercase, trim),
  password: String (required, hashed with bcrypt),
  name: String (required, trim),
  phone: String (required, unique),
  role: String (enum: ['customer', 'admin'], default: 'customer'),
  profileImage: String (URL, optional),
  isEmailVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  refreshToken: String (optional, for JWT refresh),
  passwordResetToken: String (optional),
  passwordResetExpires: Date (optional),
  lastLogin: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### SQL Schema (PostgreSQL)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  profile_image VARCHAR(500),
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  refresh_token TEXT,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
```

---

## 2. BOOKING SCHEMA

### MongoDB Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  eventId: ObjectId (ref: 'Event', required),
  eventType: String (enum: ['movie', 'concert', 'event', 'travel'], required),
  bookingDate: Date (required),
  eventDate: Date (required),
  eventTime: String (required),
  numberOfTickets: Number (required, min: 1),
  totalAmount: Number (required),
  bookingFee: Number (default: 50),
  paymentStatus: String (enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending'),
  paymentId: String (optional),
  bookingStatus: String (enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed'),
  seats: [String] (optional, for movies/concerts),
  cancellationReason: String (optional),
  cancelledAt: Date (optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### SQL Schema
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_id VARCHAR(50) NOT NULL,
  event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('movie', 'concert', 'event', 'travel')),
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  event_date DATE NOT NULL,
  event_time VARCHAR(20) NOT NULL,
  number_of_tickets INTEGER NOT NULL CHECK (number_of_tickets > 0),
  total_amount DECIMAL(10, 2) NOT NULL,
  booking_fee DECIMAL(10, 2) DEFAULT 50.00,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_id VARCHAR(255),
  booking_status VARCHAR(20) DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'completed')),
  seats TEXT[],
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);
```

---

## 3. EVENT SCHEMA (Movies, Concerts, Events)

### MongoDB Schema
```javascript
{
  _id: ObjectId,
  title: String (required, trim),
  description: String (required),
  category: String (enum: ['movie', 'concert', 'event', 'travel'], required),
  imageUrl: String (required),
  rating: Number (min: 0, max: 10),
  duration: Number (in minutes, optional),
  releaseDate: Date (optional),
  eventDate: Date (optional),
  language: String (optional),
  location: String (optional),
  venue: String (optional),
  totalSeats: Number (optional),
  availableSeats: Number (optional),
  price: Number (required),
  genres: [String] (optional),
  cast: [String] (optional),
  director: String (optional),
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: 'User', optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 4. REVIEW SCHEMA

### MongoDB Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  eventId: ObjectId (ref: 'Event', required),
  rating: Number (required, min: 1, max: 5),
  review: String (required, maxLength: 1000),
  isVerifiedBooking: Boolean (default: false),
  likes: Number (default: 0),
  dislikes: Number (default: 0),
  isApproved: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 5. PAYMENT SCHEMA

### MongoDB Schema
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId (ref: 'Booking', required),
  userId: ObjectId (ref: 'User', required),
  amount: Number (required),
  paymentMethod: String (enum: ['card', 'upi', 'netbanking', 'wallet'], required),
  paymentGateway: String (e.g., 'razorpay', 'stripe'),
  transactionId: String (unique, required),
  paymentStatus: String (enum: ['initiated', 'success', 'failed', 'refunded'], default: 'initiated'),
  paymentDate: Date,
  refundAmount: Number (optional),
  refundDate: Date (optional),
  refundReason: String (optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 6. REFRESH TOKEN SCHEMA (For JWT Management)

### MongoDB Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  token: String (required, unique),
  expiresAt: Date (required),
  createdAt: Date (auto)
}
```

---

## API ENDPOINTS STRUCTURE

### Authentication APIs (/api/auth)
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/refresh-token     - Refresh access token
POST   /api/auth/logout            - Logout user
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password with token
POST   /api/auth/verify-email      - Verify email address
```

### User APIs (/api/users)
```
GET    /api/users/profile          - Get current user profile
PUT    /api/users/profile          - Update user profile
PUT    /api/users/change-password  - Change password
DELETE /api/users/account          - Delete account
GET    /api/users/:id              - Get user by ID (Admin only)
GET    /api/users                  - Get all users (Admin only)
PUT    /api/users/:id/role         - Update user role (Admin only)
```

### Booking APIs (/api/bookings)
```
POST   /api/bookings               - Create new booking
GET    /api/bookings               - Get user bookings
GET    /api/bookings/:id           - Get booking details
PUT    /api/bookings/:id/cancel    - Cancel booking
GET    /api/bookings/all           - Get all bookings (Admin only)
```

### Event APIs (/api/events)
```
GET    /api/events                 - Get all events
GET    /api/events/:id             - Get event details
POST   /api/events                 - Create event (Admin only)
PUT    /api/events/:id             - Update event (Admin only)
DELETE /api/events/:id             - Delete event (Admin only)
```

---

## SECURITY BEST PRACTICES

1. **Password Security**
   - Use bcrypt with salt rounds >= 10
   - Enforce strong password policy (min 8 chars, uppercase, lowercase, number, special char)
   - Never store plain text passwords

2. **JWT Security**
   - Access Token: Short-lived (15-30 minutes)
   - Refresh Token: Long-lived (7-30 days)
   - Store refresh tokens in httpOnly cookies
   - Implement token rotation
   - Blacklist tokens on logout

3. **API Security**
   - Rate limiting (express-rate-limit)
   - CORS configuration
   - Helmet.js for security headers
   - Input validation and sanitization
   - SQL injection prevention (parameterized queries)
   - XSS protection

4. **Role-Based Access Control (RBAC)**
   - Middleware for authentication check
   - Middleware for role-based authorization
   - Separate admin and customer routes

---

## ENVIRONMENT VARIABLES (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/revtickets
# OR for PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/revtickets

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_EXPIRE=30m
JWT_REFRESH_EXPIRE=7d

# Email (for verification and password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Frontend URL
CLIENT_URL=http://localhost:5173
```

---

## RECOMMENDED NPM PACKAGES

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "joi": "^17.11.0",
    "nodemailer": "^6.9.7",
    "cookie-parser": "^1.4.6",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "typescript": "^5.3.3",
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.5"
  }
}
```

---

## PROJECT FOLDER STRUCTURE

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # DB connection
│   │   └── jwt.js               # JWT configuration
│   ├── models/
│   │   ├── User.js
│   │   ├── Booking.js
│   │   ├── Event.js
│   │   ├── Review.js
│   │   └── Payment.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── bookingController.js
│   │   └── eventController.js
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── roleCheck.js         # RBAC middleware
│   │   ├── validation.js        # Input validation
│   │   └── errorHandler.js      # Global error handler
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── eventRoutes.js
│   ├── utils/
│   │   ├── sendEmail.js
│   │   ├── generateToken.js
│   │   └── validators.js
│   └── server.js
├── .env
├── .gitignore
└── package.json
```

---

## IMPLEMENTATION PRIORITY

### Phase 1: Foundation (Week 1)
1. Setup backend project structure
2. Configure database connection
3. Create User schema/model
4. Implement password hashing

### Phase 2: Authentication (Week 2)
1. Register API with validation
2. Login API with JWT generation
3. Refresh token mechanism
4. Logout functionality
5. Password reset flow

### Phase 3: Authorization (Week 3)
1. Auth middleware
2. Role-based middleware
3. Protected routes
4. User profile APIs

### Phase 4: Core Features (Week 4)
1. Event/Movie/Concert schemas
2. Booking system
3. Payment integration
4. Review system

### Phase 5: Testing & Security (Week 5)
1. Unit tests
2. Integration tests
3. Security audit
4. Performance optimization
