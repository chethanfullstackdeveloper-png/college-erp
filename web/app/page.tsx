"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* ── HERO BANNER ── */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.logoCircle}>
            <Image
              src="/logo.png"
              alt="Jnanam logo"
              width={100}
              height={100}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </div>
          <h1 className={styles.collegeName}>JNANAM PU COLLEGE</h1>
          <p className={styles.collegeSubtitle}>
            Sringeri, Karnataka &nbsp;·&nbsp; Excellence in Pre-University
            Education
          </p>
          <span className={styles.sessionBadge}>Academic Year 2026</span>
        </div>
      </div>

      {/* ── PORTAL SELECTION ── */}
      <div className={styles.body}>
        <p className={styles.selectLabel}>Select your portal to continue</p>

        <div className={styles.cardsGrid}>
          {/* Admin */}
          <Link
            href="/admin/login"
            className={`${styles.portalCard} ${styles.adminCard}`}
          >
            <div
              className={styles.iconCircle}
              style={{
                background: "rgba(191,155,48,0.15)",
                border: "1.5px solid #bf9b30",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#bf9b30"
                strokeWidth="1.8"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className={styles.cardTitle} style={{ color: "#bf9b30" }}>
              Admin
            </div>
            <div className={styles.cardDesc}>Manage college data</div>
            <div className={`${styles.loginBtn} ${styles.loginBtnGold}`}>
              Login →
            </div>
          </Link>

          {/* Staff */}
          <Link
            href="/staff/login"
            className={`${styles.portalCard} ${styles.staffCard}`}
          >
            <div
              className={styles.iconCircle}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(255,255,255,0.35)",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <div className={styles.cardTitle}>Staff</div>
            <div className={styles.cardDesc}>Faculty &amp; teacher portal</div>
            <div className={`${styles.loginBtn} ${styles.loginBtnWhite}`}>
              Login →
            </div>
          </Link>

          {/* Student */}
          <Link
            href="/student/login"
            className={`${styles.portalCard} ${styles.studentCard}`}
          >
            <div
              className={styles.iconCircle}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(255,255,255,0.35)",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="1.8"
              >
                <path d="M12 3L2 8l10 5 10-5-10-5z" />
                <path d="M12 13v8" />
                <path d="M5 10.5v5.5a7 7 0 0 0 14 0v-5.5" />
              </svg>
            </div>
            <div className={styles.cardTitle}>Student</div>
            <div className={styles.cardDesc}>Academic &amp; grade portal</div>
            <div className={`${styles.loginBtn} ${styles.loginBtnWhite}`}>
              Login →
            </div>
          </Link>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className={styles.footer}>
        © 2026 Jnanam PU College, Sringeri &nbsp;·&nbsp; All rights reserved
      </div>
    </div>
  );
}
