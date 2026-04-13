# College ERP System - Complete Setup Guide

## Overview
This is a full-stack College Enterprise Resource Planning (ERP) system with:
- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: Next.js + React
- **Features**: Admin dashboard, Staff management, Student management, Profile editing

## Project Structure

```
college-erp/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API endpoints
│   │   ├── utils/           # Helper functions
│   │   ├── db.ts            # Database connection
│   │   └── index.ts         # Server entry point
│   ├── schema.sql           # Database schema
│   ├── .env                 # Environment variables
│   └── package.json
└── web/              # Next.js frontend
    ├── app/
    │   ├── admin/           # Admin pages (login, dashboard, add staff/students)
    │   ├── staff/           # Staff pages (login, dashboard, profile)
    │   └── student/         # Student pages (login, dashboard, profile)
    ├── lib/
    │   └── api.ts          # API configuration
    └── package.json
```

## Database Schema

### Admins Table
```sql
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Staff Table
```sql
CREATE TABLE staff (
  id SERIAL PRIMARY KEY,
  staff_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  division TEXT NOT NULL,
  address TEXT,
  date_of_birth DATE,
  phone_number TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Students Table
```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  roll_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  year TEXT NOT NULL,           -- 1PUC or 2PUC
  stream TEXT NOT NULL,         -- Science or Commerce
  branch TEXT NOT NULL,         -- PCMB, PCMC, ERAC
  address TEXT,
  date_of_birth DATE,
  phone_number TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Division Structure

### Years
- `1PUC` (First Year PUC)
- `2PUC` (Second Year PUC)

### Science Streams
- `PCMB` - Physics, Chemistry, Maths, Biology
- `PCMC` - Physics, Chemistry, Maths, Computer Science

### Commerce Streams
- `ERAC` - Economics, Accountancy, Commerce, English

## API Endpoints

### Admin Endpoints
```
POST   /admin/login                    # Admin login
GET    /admin/staff                    # View all staff
GET    /admin/students                 # View all students
DELETE /admin/staff/:staffId           # Delete staff
DELETE /admin/students/:studentId      # Delete student
```

### Staff Endpoints
```
POST   /staff/login                    # Staff login
GET    /staff/:staffId                 # Get staff profile
PUT    /staff/:staffId                 # Update profile (address, DOB, phone)
POST   /staff/add                      # Add single staff
POST   /staff/bulk-add                 # Bulk import staff from Excel
```

### Student Endpoints
```
POST   /students/login                 # Student login
GET    /students/:studentId            # Get student profile
PUT    /students/:studentId            # Update profile (address, DOB, phone)
POST   /students/add                   # Add single student
POST   /students/bulk-add              # Bulk import students from Excel
GET    /students/                      # Get all students (admin)
```

## Excel Import Format

### Staff Import (CSV)
```
staff_id,name,email,password,division
STF001,John Doe,john@example.com,pass123,Mathematics
STF002,Jane Smith,jane@example.com,pass123,English
```

### Student Import (CSV)
```
roll_number,name,email,password,year,stream,branch
2024001,Alice Brown,alice@example.com,pass123,1PUC,Science,PCMB
2024002,Bob Wilson,bob@example.com,pass123,1PUC,Science,PCMC
2024003,Carol Davis,carol@example.com,pass123,1PUC,Commerce,ERAC
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with:
DATABASE_URL=your_postgresql_url
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
PORT=5000

# Initialize database
npm run init-db

# Start server
npm run dev
```

### 2. Frontend Setup

```bash
cd web

# Install dependencies
npm install

# Create .env.local file with:
NEXT_PUBLIC_API_URL=http://localhost:5000

# Start dev server
npm run dev
```

### 3. Access the Application

- **App**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Staff Login**: http://localhost:3000/staff/login
- **Student Login**: http://localhost:3000/student/login

**Default Admin Credentials**:
- Email: `admin@example.com`
- Password: `admin123`

## Remaining Pages to Complete

### 1. Staff Dashboard (`/staff/dashboard`)
- Show staff profile
- Button to "Modify Your Profile"
- Display staff_id, name, division (read-only)
- Allow editing: address, date_of_birth, phone_number

### 2. Student Dashboard (`/student/dashboard`)
- Show student profile
- Button to "Modify Your Profile"
- Display roll_number, name, year, stream, branch (read-only)
- Allow editing: address, date_of_birth, phone_number

### 3. View Staff Page (`/admin/view-staff`)
- Display all staff in table format
- Columns: staff_id, name, email, division, created_at
- Delete button for each staff
- Edit button (opens modal or new page)

### 4. View Students Page (`/admin/view-students`)
- Display all students in table format
- Columns: roll_number, name, email, year, stream, branch
- Delete button for each student
- Edit button (opens modal or new page)

### 5. Profile Edit Pages
- `/staff/:staffId/edit` - Allow staff to edit profile
- `/student/:studentId/edit` - Allow student to edit profile

## Key Features Implemented

✅ Admin login
✅ Staff management (bulk import via CSV, database storage)
✅ Student management (bulk import via CSV, database storage)
✅ User authentication (email/password)
✅ Profile structure (editable fields: address, DOB, phone)
✅ Division hierarchy (1PUC, 2PUC, Science/Commerce, Branches)
✅ Database schema with constraints
✅ API endpoints for all CRUD operations

## Key Features Remaining

- [ ] Staff/Student dashboard pages
- [ ] Profile modification forms (with read-only field protection)
- [ ] View staff/student pages with delete functionality
- [ ] Admin bulk actions (delete multiple records)
- [ ] Search and filter functionality
- [ ] Authentication middleware
- [ ] Input validation and error handling
- [ ] File upload (alternative to CSV parsing)

## Example: Creating a Profile Edit Page

```typescript
// app/staff/[staffId]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '../../../../lib/api';

export default function EditStaffPage({ params }: { params: { staffId: string } }) {
  const [staff, setStaff] = useState<any>(null);
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('staffUser');
    if (!user) {
      window.location.href = '/staff/login';
      return;
    }

    // Fetch staff profile
    fetch(`${API_BASE}/staff/${params.staffId}`)
      .then((res) => res.json())
      .then((data) => {
        setStaff(data.staff);
        setAddress(data.staff.address || '');
        setDob(data.staff.date_of_birth || '');
        setPhone(data.staff.phone_number || '');
      });
  }, [params.staffId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`${API_BASE}/staff/${params.staffId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address,
        date_of_birth: dob,
        phone_number: phone,
      }),
    });

    if (response.ok) {
      alert('Profile updated successfully');
      window.location.href = '/staff/dashboard';
    }
  };

  if (!staff) return <div>Loading...</div>;

  return (
    <main className="container">
      <div className="card">
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          <label>Name (Read-only)
            <input type="text" value={staff.name} disabled />
          </label>
          <label>Staff ID (Read-only)
            <input type="text" value={staff.staff_id} disabled />
          </label>
          <label>Division (Read-only)
            <input type="text" value={staff.division} disabled />
          </label>

          <label>Address
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <label>Date of Birth
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </label>
          <label>Phone Number
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          <button type="submit">Update Profile</button>
        </form>
      </div>
    </main>
  );
}
```

## Testing the System

### 1. Test Admin Flow
```bash
# Login with: admin@example.com / admin123
# Add staff via CSV import
# View all staff
# Add students via CSV import
# View all students
```

### 2. Test Staff Flow
```bash
# Create test CSV with staff data
# Import via admin dashboard
# Login with imported credentials
# Edit profile (only address, DOB, phone)
# Verify protected fields cannot be edited
```

### 3. Test Student Flow
```bash
# Create test CSV with student data
# Import via admin dashboard
# Login with imported credentials
# Edit profile (only address, DOB, phone)
# Verify protected fields cannot be edited
```

## Common Issues & Solutions

1. **Database Connection Error**
   - Verify DATABASE_URL in .env
   - Check PostgreSQL is running
   - Run database initialization: `npm run init-db`

2. **Port Already in Use**
   - Change PORT in .env
   - Or kill process: `lsof -i :5000`

3. **CSV Import Not Working**
   - Verify CSV format matches expected columns
   - Check for extra spaces in header names
   - Ensure data types are correct

4. **CORS Errors**
   - Verify NEXT_PUBLIC_API_URL matches backend URL
   - Backend already has cors() enabled

## Deployment Notes

- Backend: Deploy to Heroku, Railway, or similar Node.js hosting
- Frontend: Deploy to Vercel (optimized for Next.js)
- Database: Use managed PostgreSQL service (Neon, AWS RDS, Heroku Postgres)
- Update environment variables in production

---

**Need Help?** Check the API endpoints, database schema, or example code above.
