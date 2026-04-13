"use client";

import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./staff-dashboard.module.css";

export default function StaffDashboardPage() {
  const [staff, setStaff] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("staffUser");
    if (!stored) {
      window.location.href = "/staff/login";
      return;
    }
    setStaff(JSON.parse(stored));
  }, []);

  const getAvatarInitials = () => {
    if (!staff?.name) return "ST";
    return staff.name
      .split(" ")
      .map((part: string) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (!staff) {
    return (
      <main className="container">
        <div className="card">Loading staff dashboard...</div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Staff Dashboard – JNANAM PU College</title>
      </Head>

      {/* ── HERO ── */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.collegeLogo}>
            <img src="/logo.png" alt="College logo" />
          </div>
          <div className={styles.heroText}>
            <h1>JNANAM PU COLLEGE</h1>
            <p>Est. 2026 &nbsp;·&nbsp; Excellence in Education &nbsp;·&nbsp; Sringeri</p>
          </div>
          <div className={styles.heroBadge}>Staff Portal</div>
        </div>
      </div>

      {/* ── NAV ── */}
      <nav className={styles.nav}>
        <div className={`${styles.navItem} ${styles.active}`}>Dashboard</div>
        <div className={styles.navItem}>My Classes</div>
        <div className={styles.navItem}>Attendance</div>
        <div className={styles.navItem}>Results</div>
        <div className={styles.navItem}>Timetable</div>
        <div className={styles.navItem}>Notices</div>
      </nav>

      {/* ── BODY ── */}
      <div className={styles.body}>

        {/* Welcome card */}
        <div className={styles.welcomeCard}>
          <div className={styles.avatar}>{getAvatarInitials()}</div>
          <div className={styles.welcomeText}>
            <h2>Welcome back, {staff.name || staff.email}</h2>
            <p>
              Staff ID: {staff.staff_id || "N/A"} &nbsp;·&nbsp;{" "}
              {staff.subject || staff.division || "Faculty"} &nbsp;·&nbsp;{" "}
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
          <button
            className={styles.logoutBtn}
            onClick={() => {
              localStorage.removeItem("staffUser");
              window.location.href = "/staff/login";
            }}
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className={styles.statGrid}>
          <div className={`${styles.statCard} ${styles.green}`}>
            <div className={styles.statVal}>6</div>
            <div className={styles.statLbl}>Classes Today</div>
          </div>
          <div className={`${styles.statCard} ${styles.gold}`}>
            <div className={styles.statVal}>142</div>
            <div className={styles.statLbl}>Total Students</div>
          </div>
          <div className={`${styles.statCard} ${styles.red}`}>
            <div className={styles.statVal}>4</div>
            <div className={styles.statLbl}>Pending Results</div>
          </div>
          <div className={`${styles.statCard} ${styles.teal}`}>
            <div className={styles.statVal}>94%</div>
            <div className={styles.statLbl}>Avg Attendance</div>
          </div>
        </div>

        {/* My Classes */}
        <div className={styles.sectionCard}>
          <div className={styles.secHead}>My Classes — Current Term</div>

          {[
            { label: "1PUC Science — PCMB", room: "Room C-101 · 38 Students", pct: 68, color: "#005826", bg: "#eaf5ee", tc: "#005826", tag: "On Track" },
            { label: "1PUC Science — PCMC", room: "Room C-102 · 34 Students", pct: 72, color: "#bf9b30", bg: "#fdf5e0", tc: "#8a6e1a", tag: "On Track" },
            { label: "2PUC Science — PCMB", room: "Room D-201 · 41 Students", pct: 85, color: "#b65b2b", bg: "#faeee8", tc: "#b65b2b", tag: "Urgent" },
            { label: "2PUC Commerce — ERAC", room: "Room B-105 · 29 Students", pct: 60, color: "#1a7a5e", bg: "#e0f5ee", tc: "#1a7a5e", tag: "On Track" },
          ].map((cls) => (
            <div key={cls.label} className={styles.courseRow}>
              <div className={styles.courseDot} style={{ background: cls.color }} />
              <div style={{ flex: 1 }}>
                <div className={styles.courseName}>{cls.label}</div>
                <div className={styles.courseCode}>{cls.room}</div>
              </div>
              <div className={styles.progressWrap}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${cls.pct}%`, background: cls.color }} />
                </div>
                <div className={styles.progLbl}>{cls.pct}% syllabus</div>
              </div>
              <div className={styles.gradeBadge} style={{ background: cls.bg, color: cls.tc }}>{cls.tag}</div>
            </div>
          ))}
        </div>

        {/* Schedule + Notices */}
        <div className={styles.twoCol}>
          <div className={styles.sectionCard}>
            <div className={styles.secHead}>Today's Schedule</div>
            {[
              { time: "8:30 AM",  name: "1PUC PCMB — Lecture",  loc: "Room C-101",       color: "#005826" },
              { time: "10:00 AM", name: "1PUC PCMC — Lecture",  loc: "Room C-102",       color: "#bf9b30" },
              { time: "11:30 AM", name: "Staff Meeting",         loc: "Principal's Hall", color: "#7a3a8e" },
              { time: "2:00 PM",  name: "2PUC PCMB — Lecture",  loc: "Room D-201",       color: "#b65b2b" },
              { time: "3:30 PM",  name: "2PUC ERAC — Lecture",  loc: "Room B-105",       color: "#1a7a5e" },
            ].map((ev) => (
              <div key={ev.time} className={styles.eventRow}>
                <div className={styles.eventTime}>{ev.time}</div>
                <div className={styles.eventDot} style={{ background: ev.color }} />
                <div>
                  <div className={styles.eventName}>{ev.name}</div>
                  <div className={styles.eventLoc}>{ev.loc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.secHead}>Notices</div>
            {[
              { title: "Mid-sem results submission: Apr 20", tag: "Urgent",  bg: "#faeee8", tc: "#b65b2b", date: "Apr 10, 2026" },
              { title: "Annual staff appraisal forms open",  tag: "Action",  bg: "#eaf5ee", tc: "#005826", date: "Apr 9, 2026"  },
              { title: "Parent-teacher meeting — Apr 18",   tag: "Event",   bg: "#fdf5e0", tc: "#8a6e1a", date: "Apr 8, 2026"  },
              { title: "New lab equipment in Block B",       tag: "Info",    bg: "#e0f5ee", tc: "#1a7a5e", date: "Apr 7, 2026"  },
              { title: "Board exam schedule released",       tag: "Exam",    bg: "#f3eaf8", tc: "#7a3a8e", date: "Apr 6, 2026"  },
            ].map((n) => (
              <div key={n.title} className={styles.annRow}>
                <div className={styles.annTitle}>{n.title}</div>
                <span className={styles.annTag} style={{ background: n.bg, color: n.tc }}>{n.tag}</span>
                <div className={styles.annDate}>{n.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance chart + Quick access */}
        <div className={styles.twoCol}>
          <div className={styles.sectionCard}>
            <div className={styles.secHead}>Attendance Overview</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "26px", fontWeight: 700, color: "#005826" }}>94%</span>
              <span style={{ fontSize: "12px", color: "#1a7a5e" }}>▲ 2% from last month</span>
            </div>
            <div className={styles.gpaChart}>
              {[
                { label: "1PUC\nPCMB", val: "92%", h: "88%" },
                { label: "1PUC\nPCMC", val: "95%", h: "95%" },
                { label: "2PUC\nPCMB", val: "91%", h: "85%" },
                { label: "2PUC\nERAC", val: "96%", h: "100%" },
              ].map((cls) => (
                <div key={cls.label} className={styles.gpaBarWrap}>
                  <div className={styles.gpaVal}>{cls.val}</div>
                  <div className={styles.gpaBar} style={{ height: cls.h, background: "#005826" }} />
                  <div className={styles.gpaSem}>{cls.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.secHead}>Quick Access</div>
            <div className={styles.quickGrid}>
              {[
                { icon: "📋", label: "Mark Attendance", bg: "#eaf5ee", tc: "#005826" },
                { icon: "📝", label: "Upload Results",  bg: "#fdf5e0", tc: "#8a6e1a" },
                { icon: "📅", label: "Timetable",       bg: "#faeee8", tc: "#b65b2b" },
                { icon: "👥", label: "My Students",     bg: "#e0f5ee", tc: "#1a7a5e" },
                { icon: "📢", label: "Notice Board",    bg: "#f3eaf8", tc: "#7a3a8e" },
                { icon: "👤", label: "My Profile",      bg: "#fff3e0", tc: "#b06000" },
              ].map((q) => (
                <div key={q.label} className={styles.quickItem} style={{ background: q.bg }}>
                  <div className={styles.quickIcon}>{q.icon}</div>
                  <div className={styles.quickLabel} style={{ color: q.tc }}>{q.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className={styles.footer}>
        © 2026 JNANAM PU College &nbsp;·&nbsp; Staff Portal &nbsp;·&nbsp; All rights reserved
      </div>
    </>
  );
}