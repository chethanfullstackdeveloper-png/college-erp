# Staff Login Testing Guide

## Overview
Staff login verifies email and password against the **staff** table in the database. Once authenticated, staff can view and edit their profile.

## Staff Login Flow

### 1. Staff Table Structure
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

### 2. Login Endpoint
```
POST /staff/login
Content-Type: application/json

{
  "email": "john.doe@college.com",
  "password": "teacher123"
}
```

### 3. Login Response (Success)
```json
{
  "staff": {
    "id": 1,
    "staff_id": "STF001",
    "name": "Mr. John Doe",
    "email": "john.doe@college.com",
    "division": "Mathematics"
  }
}
```

### 4. Login Response (Failure)
```json
{
  "message": "Invalid staff credentials"
}
```

## Testing Steps

### Step 1: Add Staff via Admin Dashboard
1. Go to http://localhost:3000/admin/login
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Click **"Add Staff"** button
4. Upload the `sample-staff.csv` file (from project root)
5. Verify all staff imported successfully

### Step 2: Test Staff Login
1. Go to http://localhost:3000/staff/login
2. Enter one of the imported staff credentials:
   - Email: `john.doe@college.com`
   - Password: `teacher123`
3. Click **"Login"**
4. You should see "Successfully logged in" message
5. You'll be redirected to staff dashboard

### Step 3: Verify Backend API
Using curl or Postman:

```bash
# Staff Login Request
curl -X POST http://localhost:5000/staff/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@college.com",
    "password": "teacher123"
  }'

# Expected Response
{
  "staff": {
    "id": 1,
    "staff_id": "STF001",
    "name": "Mr. John Doe",
    "email": "john.doe@college.com",
    "division": "Mathematics"
  }
}
```

## Sample Staff Credentials (from sample-staff.csv)

| Staff ID | Name | Email | Password | Division |
|----------|------|-------|----------|----------|
| STF001 | Mr. John Doe | john.doe@college.com | teacher123 | Mathematics |
| STF002 | Ms. Sarah Smith | sarah.smith@college.com | pass456 | English |
| STF003 | Mr. Raj Kumar | raj.kumar@college.com | science789 | Physics |
| STF004 | Mrs. Priya Patel | priya.patel@college.com | chem123 | Chemistry |

## Staff Profile Management

### 4. Get Staff Profile
```
GET /staff/:staffId
```

### 5. Update Staff Profile
Only address, date_of_birth, and phone_number can be edited.

```
PUT /staff/:staffId
Content-Type: application/json

{
  "address": "123 Main Street, City",
  "date_of_birth": "1985-06-15",
  "phone_number": "+91-9876543210"
}
```

## Key Features

✅ Email and password verification against staff table
✅ Returns staff ID, name, division (read-only information)
✅ Session stored in localStorage
✅ Profile can be edited (address, DOB, phone only)
✅ Bulk import from CSV via admin panel
✅ Unique staff_id and email constraints

## Protected Fields
These fields **cannot be edited** by staff:
- Name
- Staff ID
- Email
- Division

## Editable Fields
Staff can update:
- Address
- Date of Birth
- Phone Number
