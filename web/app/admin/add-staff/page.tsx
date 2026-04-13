'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '../../../lib/api';
import styles from './add.module.css';

interface ImportResult {
  imported: number;
  failed: number;
  results: any[];
  errors?: any[];
}

export default function AddStaffPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (!admin) {
      window.location.href = '/admin/login';
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const parseCSV = (csv: string): any[] => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = lines[i].split(',').map((v) => v.trim());
      const obj: any = {};

      headers.forEach((header, index) => {
        obj[header] = values[index];
      });

      data.push(obj);
    }

    return data;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const fileContent = await file.text();
      const csvData = parseCSV(fileContent);

      // Map CSV columns to name, email, password, subject
      const staffList = csvData.map((row) => ({
        name: row['name'],
        email: row['email'],
        password: row['password'],
        subject: row['subject'] || row['division'] || row['dept'] || null,
      }));

      console.log('Parsed CSV data:', csvData);
      console.log('Staff list to send:', staffList);

      const response = await fetch(`${API_BASE}/staff/bulk-add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staffList),
      });

      const data = await response.json();
      console.log('Backend response:', data);
      setResult(data);

      if (!response.ok) {
        setError(data.error || 'Failed to import staff');
      }
    } catch (err) {
      const errorMsg = (err as Error).message || 'Failed to process file';
      console.error('Error:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1>Add Staff via Excel</h1>
        <p className={styles.subtitle}>
          Upload a CSV file with columns: staff_id, name, email, password, division
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.fileInput}>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              required
              id="file-upload"
            />
            <label htmlFor="file-upload">
              {file ? file.name : 'Choose CSV file'}
            </label>
          </div>

          <button type="submit" disabled={loading || !file} className={styles.button}>
            {loading ? 'Importing...' : 'Import Staff'}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        {result && (
          <div className={styles.result}>
            <h3>Import Result</h3>
            <p>
              ✅ Imported: <strong>{result.imported}</strong>
            </p>
            {result.failed > 0 && (
              <p>
                ❌ Failed: <strong>{result.failed}</strong>
              </p>
            )}

            {result.errors && result.errors.length > 0 && (
              <div className={styles.errors}>
                <h4>Errors:</h4>
                <ul>
                  {result.errors.map((err, idx) => (
                    <li key={idx}>
                      Row {err.row}: {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <a href="/admin/dashboard" className={styles.backLink}>
          ← Back to Dashboard
        </a>
      </div>
    </main>
  );
}
