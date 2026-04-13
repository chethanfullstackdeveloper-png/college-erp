"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { API_BASE } from "../../../lib/api";
import styles from "./admin.module.css";
import logoImage from "./logo.png";
import collegeImage from "./college1.jpeg";

export default function AdminDashboard() {
  const [adminData, setAdminData] = useState<any>(null);
  const [staffCount, setStaffCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const admin = localStorage.getItem("adminUser");
    if (!admin) {
      window.location.href = "/admin/login";
      return;
    }
    setAdminData(JSON.parse(admin));
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const staffRes = await fetch(`${API_BASE}/admin/staff`);
      const studentRes = await fetch(`${API_BASE}/admin/students`);
      const staffData = await staffRes.json();
      const studentData = await studentRes.json();
      setStaffCount(staffData.total || 0);
      setStudentCount(studentData.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  };

  if (!adminData) return <div className={styles.loadingScreen}>Loading...</div>;

  return (
    <div className={styles.layout}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>
          <div className={styles.adminLabel}>Admin</div>
          <div className={styles.dashboardLabel}>Dashboard</div>
        </div>
        <nav className={styles.navMenu}>
          <a className={`${styles.navBtn} ${styles.active}`} href="#">
            <i className="fa-solid fa-house"></i>
            <span>Home</span>
          </a>
          <Link href="/admin/view-staff" className={styles.navBtn}>
            <i className="fa-solid fa-users-gear"></i>
            <span>Staff</span>
          </Link>
          <Link href="/admin/view-students" className={styles.navBtn}>
            <i className="fa-solid fa-user-graduate"></i>
            <span>Student</span>
          </Link>
          <a className={styles.navBtn} href="#">
            <i className="fa-solid fa-bell"></i>
            <span>Notification</span>
          </a>
          <a className={styles.navBtn} href="#">
            <i className="fa-solid fa-chart-bar"></i>
            <span>Result</span>
          </a>
          <a className={styles.navBtn} href="#">
            <i className="fa-solid fa-gear"></i>
            <span>Setting</span>
          </a>
        </nav>
      </aside>

      {/* MAIN */}
      <div className={styles.main}>
        {/* TOPBAR */}
        <div className={styles.topbar}>
          <div className={styles.topbarIcon}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <div className={styles.topbarIcon}>
            <i className="fa-solid fa-bell"></i>
          </div>
          <div className={styles.topbarAvatar}>AD</div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          {/* HERO */}
          <div className={styles.heroSection}>
            <div className={styles.collegeImageWrap}>
              <Image
                src={collegeImage}
                alt="College cover image"
                width={1200}
                height={300}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
            <div className={styles.collegeIdentity}>
              <div className={styles.collegeLogoCircle}>
                <Image
                  src={logoImage}
                  alt="Jnanam logo"
                  width={80}
                  height={80}
                  style={{
                    width: "150%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </div>
              <div className={styles.collegeNameBlock}>
                <h1>JNANAM PU COLLEGE</h1>
                <p>
                  Sringeri, Karnataka &nbsp;·&nbsp; Excellence in Pre-University
                  Education
                </p>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className={styles.statsRow}>
            <div className={`${styles.statCard} ${styles.statG}`}>
              <div className={styles.statNum}>{studentCount}</div>
              <div className={styles.statLabel}>Total Students</div>
            </div>
            <div className={`${styles.statCard} ${styles.statGo}`}>
              <div className={styles.statNum}>{staffCount}</div>
              <div className={styles.statLabel}>Staff Members</div>
            </div>
            <div className={`${styles.statCard} ${styles.statR}`}>
              <div className={styles.statNum}>12</div>
              <div className={styles.statLabel}>Notifications</div>
            </div>
            <div className={`${styles.statCard} ${styles.statT}`}>
              <div className={styles.statNum}>94%</div>
              <div className={styles.statLabel}>Pass Rate</div>
            </div>
          </div>

          {/* ACTIONS + INFO */}
          <div className={styles.infoRow}>
            {/* QUICK ACTIONS */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHead}>
                <i className="fa-solid fa-bolt"></i> Quick Actions
              </div>
              <div className={styles.actionsGrid}>
                <Link href="/admin/add-staff" className={styles.actionCard}>
                  <i className="fa-solid fa-users-gear"></i>
                  <h3>Add Staff</h3>
                  <p>Upload via Excel</p>
                </Link>
                <Link href="/admin/view-staff" className={styles.actionCard}>
                  <i className="fa-solid fa-eye"></i>
                  <h3>View Staff</h3>
                  <p>Manage staff</p>
                </Link>
                <Link href="/admin/add-student" className={styles.actionCard}>
                  <i className="fa-solid fa-user-plus"></i>
                  <h3>Add Student</h3>
                  <p>Upload via Excel</p>
                </Link>
                <Link href="/admin/view-students" className={styles.actionCard}>
                  <i className="fa-solid fa-user-graduate"></i>
                  <h3>View Students</h3>
                  <p>Manage students</p>
                </Link>
              </div>
            </div>

            {/* NOTIFICATIONS */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHead}>
                <i className="fa-solid fa-bell"></i> Notifications
              </div>
              <div className={styles.notifItem}>
                <div
                  className={styles.notifDot}
                  style={{ background: "#005826" }}
                />
                <div>
                  <div className={styles.notifText}>
                    Annual exam schedule published
                  </div>
                  <div className={styles.notifTime}>Today, 9:10 AM</div>
                </div>
              </div>
              <div className={styles.notifItem}>
                <div
                  className={styles.notifDot}
                  style={{ background: "#bf9b30" }}
                />
                <div>
                  <div className={styles.notifText}>
                    Staff meeting – Apr 14, 10 AM
                  </div>
                  <div className={styles.notifTime}>Yesterday</div>
                </div>
              </div>
              <div className={styles.notifItem}>
                <div
                  className={styles.notifDot}
                  style={{ background: "#b65b2b" }}
                />
                <div>
                  <div className={styles.notifText}>
                    Fee payment deadline: Apr 20
                  </div>
                  <div className={styles.notifTime}>Apr 9, 2026</div>
                </div>
              </div>
              <div className={styles.notifItem}>
                <div
                  className={styles.notifDot}
                  style={{ background: "#1a7a5e" }}
                />
                <div>
                  <div className={styles.notifText}>
                    Results for Sem 5 uploaded
                  </div>
                  <div className={styles.notifTime}>Apr 7, 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          &copy; 2026 Jnanam PU College, Sringeri &nbsp;·&nbsp; Admin Portal
          &nbsp;·&nbsp; All rights reserved
        </div>
      </div>

      {/* Font Awesome */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        rel="stylesheet"
      />
    </div>
  );
}
