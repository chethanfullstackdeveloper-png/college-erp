'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE } from '../../../lib/api';
import styles from './student-import.module.css';

const CATALOG = {
  '1PUC': {
    Science: ['PCMB', 'PCMC'],
    Commerce: ['ERAC'],
  },
  '2PUC': {
    Science: ['PCMB', 'PCMC'],
    Commerce: ['ERAC'],
  },
};

export default function AddStudentPage() {
  const [step, setStep] = useState<'year' | 'stream' | 'branch' | 'upload'>('year');
  const [year, setYear] = useState<'1PUC' | '2PUC' | null>(null);
  const [stream, setStream] = useState<'Science' | 'Commerce' | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const admin = localStorage.getItem('adminUser');
    if (!admin) {
      window.location.href = '/admin/login';
    }
  }, []);

  const handleYearSelect = (selectedYear: '1PUC' | '2PUC') => {
    setYear(selectedYear);
    setStream(null);
    setBranch(null);
    setStep('stream');
  };

  const handleStreamSelect = (selectedStream: 'Science' | 'Commerce') => {
    setStream(selectedStream);
    setBranch(null);
    setStep('branch');
  };

  const handleBranchSelect = (selectedBranch: string) => {
    setBranch(selectedBranch);
    setStep('upload');
  };

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

      const studentList = csvData.map((row) => ({
        roll_number: row['roll_number'] || row['rollnumber'],
        name: row['name'],
        email: row['email'],
        password: row['password'],
        year,
        stream,
        branch,
      }));

      console.log('Parsed CSV data:', csvData);
      console.log('Student list to send:', studentList);

      const response = await fetch(`${API_BASE}/students/bulk-add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentList),
      });

      const data = await response.json();
      console.log('Backend response:', data);
      setResult(data);

      if (!response.ok) {
        setError(data.error || 'Failed to import students');
      }
    } catch (err) {
      const errorMsg = (err as Error).message || 'Failed to process file';
      console.error('Error:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('year');
    setYear(null);
    setStream(null);
    setBranch(null);
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Add Students</h1>
          <Link href="/admin/dashboard" className={styles.closeBtn}>
            ×
          </Link>
        </div>

        {/* Step Indicator */}
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${step === 'year' || (year && step !== 'year') ? styles.active : ''}`}>
            <span className={styles.stepNumber}>1</span>
            <span className={styles.stepLabel}>Year</span>
          </div>
          <div className={`${styles.connector} ${year ? styles.filled : ''}`} />
          <div className={`${styles.step} ${step === 'stream' || (stream && step !== 'stream') ? styles.active : ''}`}>
            <span className={styles.stepNumber}>2</span>
            <span className={styles.stepLabel}>Stream</span>
          </div>
          <div className={`${styles.connector} ${stream ? styles.filled : ''}`} />
          <div className={`${styles.step} ${step === 'branch' || (branch && step !== 'branch') ? styles.active : ''}`}>
            <span className={styles.stepNumber}>3</span>
            <span className={styles.stepLabel}>Branch</span>
          </div>
          <div className={`${styles.connector} ${branch ? styles.filled : ''}`} />
          <div className={`${styles.step} ${step === 'upload' ? styles.active : ''}`}>
            <span className={styles.stepNumber}>4</span>
            <span className={styles.stepLabel}>Upload</span>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {/* Step 1: Year Selection */}
        {step === 'year' && (
          <div className={styles.stepContent}>
            <h2>Select Year</h2>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={`${styles.optionBtn} ${year === '1PUC' ? styles.selected : ''}`}
                onClick={() => handleYearSelect('1PUC')}
              >
                <span className={styles.optionTitle}>1PUC</span>
                <span className={styles.optionDesc}>First Year Pre-University</span>
              </button>
              <button
                type="button"
                className={`${styles.optionBtn} ${year === '2PUC' ? styles.selected : ''}`}
                onClick={() => handleYearSelect('2PUC')}
              >
                <span className={styles.optionTitle}>2PUC</span>
                <span className={styles.optionDesc}>Second Year Pre-University</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Stream Selection */}
        {step === 'stream' && year && (
          <div className={styles.stepContent}>
            <h2>Select Stream for {year}</h2>
            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={`${styles.optionBtn} ${stream === 'Science' ? styles.selected : ''}`}
                onClick={() => handleStreamSelect('Science')}
              >
                <span className={styles.optionTitle}>Science</span>
                <span className={styles.optionDesc}>PCMB, PCMC Branches</span>
              </button>
              <button
                type="button"
                className={`${styles.optionBtn} ${stream === 'Commerce' ? styles.selected : ''}`}
                onClick={() => handleStreamSelect('Commerce')}
              >
                <span className={styles.optionTitle}>Commerce</span>
                <span className={styles.optionDesc}>ERAC Branch</span>
              </button>
            </div>
            <button type="button" className={styles.backBtn} onClick={() => setStep('year')}>
              ← Back
            </button>
          </div>
        )}

        {/* Step 3: Branch Selection */}
        {step === 'branch' && year && stream && (
          <div className={styles.stepContent}>
            <h2>Select Branch</h2>
            <div className={styles.buttonGroup}>
              {CATALOG[year][stream].map((b) => (
                <button
                  key={b}
                  type="button"
                  className={`${styles.optionBtn} ${branch === b ? styles.selected : ''}`}
                  onClick={() => handleBranchSelect(b)}
                >
                  <span className={styles.optionTitle}>{b}</span>
                </button>
              ))}
            </div>
            <button type="button" className={styles.backBtn} onClick={() => setStep('stream')}>
              ← Back
            </button>
          </div>
        )}

        {/* Step 4: File Upload */}
        {step === 'upload' && year && stream && branch && (
          <div className={styles.stepContent}>
            <h2>Upload Student Data</h2>
            <div className={styles.selectionSummary}>
              <p>
                <strong>Year:</strong> {year} | <strong>Stream:</strong> {stream} |{' '}
                <strong>Branch:</strong> {branch}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.fileInput}>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  required
                  id="file-upload"
                />
                <label htmlFor="file-upload" className={styles.fileLabel}>
                  {file ? (
                    <>
                      <span className={styles.fileName}>✓ {file.name}</span>
                      <span className={styles.fileSize}>({(file.size / 1024).toFixed(2)} KB)</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>📁</span>
                      <span className={styles.uploadText}>Click to select CSV file</span>
                      <span className={styles.uploadHint}>
                        CSV columns: roll_number, name, email, password
                      </span>
                    </>
                  )}
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" disabled={loading || !file} className={styles.submitBtn}>
                  {loading ? 'Importing...' : '✓ Import Students'}
                </button>
                <button type="button" className={styles.backBtn} onClick={() => setStep('branch')}>
                  ← Back
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Import Result */}
        {result && (
          <div className={styles.stepContent}>
            <h2>Import Complete</h2>
            <div className={styles.resultCard}>
              <div className={styles.resultMain}>
                <p className={styles.resultImported}>
                  ✅ <strong>{result.imported}</strong> students imported successfully
                </p>
                {result.failed > 0 && (
                  <p className={styles.resultFailed}>
                    ❌ <strong>{result.failed}</strong> students failed
                  </p>
                )}
              </div>

              {result.errors && result.errors.length > 0 && (
                <div className={styles.errorsList}>
                  <h4>Errors:</h4>
                  <ul>
                    {result.errors.map((err: any, idx: number) => (
                      <li key={idx}>
                        Row {err.row}: {err.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.resultActions}>
                <button type="button" className={styles.submitBtn} onClick={handleReset}>
                  + Import More
                </button>
                <Link href="/admin/view-students" className={styles.viewBtn}>
                  View All Students
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
