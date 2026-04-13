'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE } from '../../../../lib/api';
import styles from './edit.module.css';

interface Student {
  id: number;
  roll_number: string;
  name: string;
  email: string;
  password: string;
  year: string;
  stream: string;
  branch: string;
}

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params?.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (!admin) {
      router.push('/admin/login');
      return;
    }

    if (studentId) {
      fetchStudent();
    }
  }, [studentId, router]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/students/${studentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student');
      }

      const data = await response.json();
      setStudent(data.student);
      setError(null);
    } catch (err) {
      console.error('Error fetching student:', err);
      setError((err as Error).message || 'Failed to load student');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!student) {
      setError('Student data is missing');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const response = await fetch(`${API_BASE}/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: student.name,
          email: student.email,
          roll_number: student.roll_number,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/view-students');
      }, 1500);
    } catch (err) {
      console.error('Error updating student:', err);
      setError((err as Error).message || 'Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.card}>
          <h1>Edit Student</h1>
          <p>Loading student details...</p>
        </div>
      </main>
    );
  }

  if (!student) {
    return (
      <main className={styles.container}>
        <div className={styles.card}>
          <h1>Student Not Found</h1>
          <p>The requested student could not be found.</p>
          <Link href="/admin/view-students" className={styles.backBtn}>
            Back to Student List
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1>Edit Student</h1>

        {success && (
          <div className={styles.success}>
            ✓ Student updated successfully! Redirecting...
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="id">ID (Read-only)</label>
            <input type="text" id="id" value={student.id} disabled />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="roll_number">Roll Number</label>
            <input
              type="text"
              id="roll_number"
              name="roll_number"
              value={student.roll_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={student.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={student.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.infoGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="year">Year (Read-only)</label>
              <input type="text" id="year" value={student.year} disabled />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="stream">Stream (Read-only)</label>
              <input type="text" id="stream" value={student.stream} disabled />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="branch">Branch (Read-only)</label>
              <input type="text" id="branch" value={student.branch} disabled />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password (Read-only)</label>
            <input
              type="password"
              id="password"
              value={student.password}
              disabled
            />
            <small>Contact administrator to change password</small>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/admin/view-students" className={styles.cancelBtn}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
