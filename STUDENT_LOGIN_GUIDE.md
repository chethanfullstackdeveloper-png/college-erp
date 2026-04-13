# Student Login Testing Guide

## Overview
Student login verifies email and password against the **students** table in the database. Once authenticated, students can view and edit their profile.

## Student Login Flow

### 1. Students Table Structure
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

### 2. Login Endpoint
```
POST /students/login
Content-Type: application/json

{
  "email": "alice.brown@college.com",
  "password": "student123"
}
```

### 3. Login Response (Success)
```json
{
  "student": {
    "id": 1,
    "roll_number": "2024001",
    "name": "Alice Brown",
    "email": "alice.brown@college.com",
    "year": "1PUC",
    "stream": "Science",
    "branch": "PCMB"
  }
}
```

### 4. Login Response (Failure)
```json
{
  "message": "Invalid student credentials"
}
```

## Testing Steps

### Step 1: Add Students via Admin Dashboard
1. Go to http://localhost:3000/admin/login
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Click **"Add Student"** button
4. Upload the `sample-students.csv` file (from project root)
5. Verify all students imported successfully

### Step 2: Test Student Login
1. Go to http://localhost:3000/student/login
2. Enter one of the imported student credentials:
   - Email: `alice.brown@college.com`
   - Password: `student123`
3. Click **"Login"**
4. You should see "Successfully logged in" message
5. You'll be redirected to student dashboard

### Step 3: Verify Backend API
Using curl or Postman:

```bash
# Student Login Request
curl -X POST http://localhost:5000/students/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.brown@college.com",
    "password": "student123"
  }'

# Expected Response
{
  "student": {
    "id": 1,
    "roll_number": "2024001",
    "name": "Alice Brown",
    "email": "alice.brown@college.com",
    "year": "1PUC",
    "stream": "Science",
    "branch": "PCMB"
  }
}
```

## Sample Student Credentials (from sample-students.csv)

| Roll Number | Name | Email | Password | Year | Stream | Branch |
|-------------|------|-------|----------|------|--------|--------|
| 2024001 | Alice Brown | alice.brown@college.com | student123 | 1PUC | Science | PCMB |
| 2024002 | Bob Wilson | bob.wilson@college.com | student456 | 1PUC | Science | PCMC |
| 2024003 | Carol Davis | carol.davis@college.com | student789 | 1PUC | Commerce | ERAC |
| 2024004 | David Johnson | david.johnson@college.com | stud111 | 2PUC | Science | PCMB |
| 2024005 | Emma White | emma.white@college.com | stud222 | 2PUC | Commerce | ERAC |

## Student Profile Management

### 4. Get Student Profile
```
GET /students/:studentId
```

### 5. Update Student Profile
Only address, date_of_birth, and phone_number can be edited.

```
PUT /students/:studentId
Content-Type: application/json

{
  "address": "456 Oak Avenue, City",
  "date_of_birth": "2006-08-20",
  "phone_number": "+91-9988776655"
}
```

## Key Features

✅ Email and password verification against students table
✅ Returns roll number, name, year, stream, branch (read-only information)
✅ Session stored in localStorage
✅ Profile can be edited (address, DOB, phone only)
✅ Bulk import from CSV via admin panel
✅ Unique roll_number and email constraints
✅ Division structure validation (1PUC/2PUC, Science/Commerce, branch codes)

## Protected Fields
These fields **cannot be edited** by students:
- Name
- Roll Number
- Email
- Year (1PUC / 2PUC)
- Stream (Science / Commerce)
- Branch (PCMB / PCMC / ERAC)

## Editable Fields
Students can update:
- Address
- Date of Birth
- Phone Number

## Division Reference

### Years
- `1PUC` - First Year Pre-University Course
- `2PUC` - Second Year Pre-University Course

### Science Branches
- `PCMB` - Physics, Chemistry, Maths, Biology
- `PCMC` - Physics, Chemistry, Maths, Computer Science

### Commerce Branches
- `ERAC` - Economics, Accountancy, Commerce, English
