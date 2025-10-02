# SANS EDA Backend

Backend API for the SANS EDA (Statistical Analysis System for Exploratory Data Analysis) platform.

## Features

- User authentication with JWT
- File upload and processing
- PostgreSQL database integration
- n8n workflow integration
- RESTful API endpoints
- Error handling and validation

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Data Processing
- `POST /api/data/upload` - Upload dataset for analysis (Protected)
- `GET /api/data/history` - Get user's analysis history (Protected)
- `GET /api/data/reports/:id` - Get detailed report results (Protected)

### Internal (for n8n)
- `POST /api/internal/update-report` - Update report status and results

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`

4. Set up database:
```bash
node scripts/setup-db.js
```

5. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `DB_*` - PostgreSQL connection settings
- `JWT_SECRET` - Secret key for JWT tokens
- `N8N_WEBHOOK_URL` - n8n webhook endpoint
- `FRONTEND_URL` - Frontend URL for CORS

## File Structure

```
backend/
├── config/
│   └── database.js          # Database connection
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── errorHandler.js      # Error handling
├── migrations/
│   └── createTables.js      # Database schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── data.js              # Data processing routes
│   └── internal.js          # Internal n8n routes
├── scripts/
│   └── setup-db.js          # Database setup script
├── uploads/                 # Uploaded files directory
├── results/                 # Analysis results directory
├── server.js                # Main server file
└── package.json
```

## Database Schema

### users
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR UNIQUE)
- `email` (VARCHAR UNIQUE)
- `password_hash` (VARCHAR)
- `created_at` (TIMESTAMP)

### reports
- `id` (VARCHAR PRIMARY KEY)
- `user_id` (INTEGER FK)
- `original_filename` (VARCHAR)
- `status` (VARCHAR)
- `created_at` (TIMESTAMP)

### report_results
- `id` (SERIAL PRIMARY KEY)
- `report_id` (VARCHAR FK)
- `result_type` (VARCHAR)
- `content` (JSONB)
- `created_at` (TIMESTAMP)

## Usage

1. Register/login to get JWT token
2. Upload CSV/Excel files for analysis
3. Monitor processing status
4. Retrieve analysis results when complete