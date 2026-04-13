'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE } from '../../../../lib/api';
import styles from './edit.module.css';

interface Staff {
  id: number;
  name: string;
  email: string;
  password: string;
  subject?: string;
}

export default function EditStaffPage() {
  const router = useRouter();
  const params = useParams();
  const staffId = params?.id as string;

  const [staff, setStaff] = useState<Staff | null>(null);
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

    if (staffId) {
      fetchStaff();
    }
  }, [staffId, router]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/staff/${staffId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }

      const data = await response.json();
      setStaff(data.staff);
      setError(null);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError((err as Error).message || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStaff((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!staff) {
      setError('Staff data is missing');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const response = await fetch(`${API_BASE}/staff/${staffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: staff.name,
          email: staff.email,
          subject: staff.subject,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update staff');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/view-staff');
      }, 1500);
    } catch (err) {
      console.error('Error updating staff:', err);
      setError((err as Error).message || 'Failed to update staff');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.card}>
          <h1>Edit Staff</h1>
          <p>Loading staff details...</p>
        </div>
      </main>
    );
  }

  if (!staff) {
    return (
      <main className={styles.container}>
        <div className={styles.card}>
          <h1>Staff Not Found</h1>
          <p>The requested staff member could not be found.</p>
          <Link href="/admin/view-staff" className={styles.backBtn}>
            Back to Staff List
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1>Edit Staff Member</h1>

        {success && (
          <div className={styles.success}>
            ✓ Staff member updated successfully! Redirecting...
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="id">ID (Read-only)</label>
            <input type="text" id="id" value={staff.id} disabled />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={staff.name}
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
              value={staff.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={staff.subject || ''}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password (Read-only)</label>
            <input
              type="password"
              id="password"
              value={staff.password}
              disabled
            />
            <small>Contact administrator to change password</small>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/admin/view-staff" className={styles.cancelBtn}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
