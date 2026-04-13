'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE } from '../../../lib/api';
import styles from './view.module.css';

interface Student {
  id: number;
  roll_number: string;
  name: string;
  email: string;
  year: string;
  stream: string;
  branch: string;
}

export default function ViewStudentsPage() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [year, setYear] = useState<'1PUC' | '2PUC' | null>(null);
  const [stream, setStream] = useState<'Science' | 'Commerce' | null>(null);
  const [branch, setBranch] = useState<string | null>(null);

  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (!admin) {
      window.location.href = '/admin/login';
    } else {
      fetchStudents();
    }
  }, []);

  useEffect(() => {
    // Filter students based on selected year, stream, branch
    let filtered = allStudents;
    if (year) {
      filtered = filtered.filter((s) => s.year === year);
    }
    if (stream) {
      filtered = filtered.filter((s) => s.stream === stream);
    }
    if (branch) {
      filtered = filtered.filter((s) => s.branch === branch);
    }
    setStudents(filtered);
  }, [year, stream, branch, allStudents]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/students`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setAllStudents(data.students || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError((err as Error).message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setYear(null);
    setStream(null);
    setBranch(null);
  };

  const handleDelete = async (studentId: number) => {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      setDeleteLoading(studentId);
      const response = await fetch(`${API_BASE}/admin/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      setStudents(students.filter((s) => s.id !== studentId));
      setError(null);
    } catch (err) {
      console.error('Error deleting student:', err);
      setError((err as Error).message || 'Failed to delete student');
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
          <h1>Student Management</h1>
          <p>Loading student list...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Student Management</h1>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className={styles.controls}>
          <Link href="/admin/dashboard" className={styles.backBtn}>
            ← Back to Dashboard
          </Link>
          <Link href="/admin/add-student" className={styles.addBtn}>
            + Add New Student
          </Link>
        </div>

        {/* Filter Section */}
        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <h3>Filter by Year</h3>
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.filterBtn} ${year === '1PUC' ? styles.active : ''}`}
                onClick={() => setYear('1PUC')}
              >
                1PUC
              </button>
              <button
                className={`${styles.filterBtn} ${year === '2PUC' ? styles.active : ''}`}
                onClick={() => setYear('2PUC')}
              >
                2PUC
              </button>
            </div>
          </div>

          {year && (
            <div className={styles.filterGroup}>
              <h3>Filter by Stream</h3>
              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.filterBtn} ${stream === 'Science' ? styles.active : ''}`}
                  onClick={() => setStream('Science')}
                >
                  Science
                </button>
                <button
                  className={`${styles.filterBtn} ${stream === 'Commerce' ? styles.active : ''}`}
                  onClick={() => setStream('Commerce')}
                >
                  Commerce
                </button>
              </div>
            </div>
          )}

          {stream && (
            <div className={styles.filterGroup}>
              <h3>Filter by Branch</h3>
              <div className={styles.buttonGroup}>
                {stream === 'Science' && (
                  <>
                    <button
                      className={`${styles.filterBtn} ${branch === 'PCMB' ? styles.active : ''}`}
                      onClick={() => setBranch('PCMB')}
                    >
                      PCMB
                    </button>
                    <button
                      className={`${styles.filterBtn} ${branch === 'PCMC' ? styles.active : ''}`}
                      onClick={() => setBranch('PCMC')}
                    >
                      PCMC
                    </button>
                  </>
                )}
                {stream === 'Commerce' && (
                  <button
                    className={`${styles.filterBtn} ${branch === 'ERAC' ? styles.active : ''}`}
                    onClick={() => setBranch('ERAC')}
                  >
                    ERAC
                  </button>
                )}
              </div>
            </div>
          )}

          {(year || stream || branch) && (
            <button className={styles.clearFiltersBtn} onClick={handleClearFilters}>
              Clear All Filters
            </button>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {students.length === 0 ? (
          <div className={styles.empty}>
            <p>No students found.</p>
            <Link href="/admin/add-student">Add your first student</Link>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Roll #</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Year</th>
                  <th>Stream</th>
                  <th>Branch</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className={styles.rollCol}>{student.roll_number}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td className={styles.yearCol}>{student.year}</td>
                    <td className={styles.streamCol}>{student.stream}</td>
                    <td className={styles.branchCol}>{student.branch}</td>
                    <td className={styles.actions}>
                      <Link
                        href={`/admin/edit-student/${student.id}`}
                        className={styles.editBtn}
                      >
                        Edit
                      </Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(student.id)}
                        disabled={deleteLoading === student.id}
                      >
                        {deleteLoading === student.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className={styles.footer}>
          <p>Total Students: <strong>{students.length}</strong></p>
        </div>
      </div>
    </main>
  );
}
