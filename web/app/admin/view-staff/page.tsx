'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE } from '../../../lib/api';
import styles from './view.module.css';

interface Staff {
  id: number;
  name: string;
  email: string;
  subject?: string;
}

export default function ViewStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (!admin) {
      window.location.href = '/admin/login';
    } else {
      fetchStaff();
    }
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/staff`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }

      const data = await response.json();
      setStaff(data.staff || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError((err as Error).message || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (staffId: number) => {
    if (!confirm('Are you sure you want to delete this staff member?')) {
      return;
    }

    try {
      setDeleteLoading(staffId);
      const response = await fetch(`${API_BASE}/admin/staff/${staffId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete staff');
      }

      // Remove from list
      setStaff(staff.filter((s) => s.id !== staffId));
      setError(null);
    } catch (err) {
      console.error('Error deleting staff:', err);
      setError((err as Error).message || 'Failed to delete staff');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.card}>
          <h1>Staff Management</h1>
          <p>Loading staff list...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Staff Management</h1>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className={styles.controls}>
          <Link href="/admin/dashboard" className={styles.backBtn}>
            ← Back to Dashboard
          </Link>
          <Link href="/admin/add-staff" className={styles.addBtn}>
            + Add New Staff
          </Link>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {staff.length === 0 ? (
          <div className={styles.empty}>
            <p>No staff members found. </p>
            <Link href="/admin/add-staff">Add your first staff member</Link>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id}>
                    <td className={styles.idCol}>{member.id}</td>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.subject || '-'}</td>
                    <td className={styles.actions}>
                      <Link
                        href={`/admin/edit-staff/${member.id}`}
                        className={styles.editBtn}
                      >
                        Edit
                      </Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(member.id)}
                        disabled={deleteLoading === member.id}
                      >
                        {deleteLoading === member.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className={styles.footer}>
          <p>Total Staff: <strong>{staff.length}</strong></p>
        </div>
      </div>
    </main>
  );
}
