"use client";

import Head from "next/head";
import { useEffect, useState } from "react";

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("studentUser");
    if (!stored) {
      window.location.href = "/student/login";
      return;
    }

    setStudent(JSON.parse(stored));
  }, []);

  const getAvatarInitials = () => {
    if (!student?.name) return "ST";
    return student.name
      .split(" ")
      .map((part: string) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (!student) {
    return (
      <main className="container">
        <div className="card">Loading student dashboard...</div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Student Dashboard – JNANAM PU College</title>
      </Head>

      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="college-logo">
            <img src="/logo.png" alt="College logo" />
          </div>
          <div className="hero-text">
            <h1>JNANAM PU COLLEGE</h1>
            <p>
              Est. 2026 &nbsp;·&nbsp; Excellence in Education &nbsp;·&nbsp;
              Sringeri
            </p>
          </div>
          <div className="hero-badge">Spring 2026</div>
        </div>
      </div>

      <nav className="nav">
        <div className="nav-item active">Dashboard</div>
        <div className="nav-item">Courses</div>
        <div className="nav-item">Grades</div>
        <div className="nav-item">Schedule</div>
        <div className="nav-item">Library</div>
        <div className="nav-item">Fee Portal</div>
      </nav>

      <div className="body">
        <div className="welcome-card">
          <div className="avatar">{getAvatarInitials()}</div>
          <div className="welcome-text">
            <h2>Welcome back, {student.name || student.email}</h2>
            <p>
              Student ID: {student.roll_number || "N/A"} &nbsp;·&nbsp;{" "}
              {student.stream || "N/A"}
              &nbsp;·&nbsp; Year {student.year || "N/A"}
            </p>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-card green">
            <div className="stat-val">8.74</div>
            <div className="stat-lbl">Current CGPA</div>
          </div>
          <div className="stat-card gold">
            <div className="stat-val">91%</div>
            <div className="stat-lbl">Attendance</div>
          </div>
          <div className="stat-card red">
            <div className="stat-val">3</div>
            <div className="stat-lbl">Due Assignments</div>
          </div>
          <div className="stat-card teal">
            <div className="stat-val">142</div>
            <div className="stat-lbl">Credits Earned</div>
          </div>
        </div>

        <div className="section-card">
          <div className="sec-head">Enrolled Courses — Semester 6</div>

          <div className="course-row">
            <div className="course-dot" style={{ background: "#005826" }} />
            <div style={{ flex: 1 }}>
              <div className="course-name">Machine Learning</div>
              <div className="course-code">
                CS601 &nbsp;·&nbsp; Dr. Meera Pillai
              </div>
            </div>
            <div className="progress-wrap">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "72%", background: "#005826" }}
                />
              </div>
              <div className="prog-lbl">72% done</div>
            </div>
            <div
              className="grade-badge"
              style={{ background: "#eaf5ee", color: "#005826" }}
            >
              A
            </div>
          </div>

          <div className="course-row">
            <div className="course-dot" style={{ background: "#bf9b30" }} />
            <div style={{ flex: 1 }}>
              <div className="course-name">Database Systems</div>
              <div className="course-code">
                CS602 &nbsp;·&nbsp; Prof. R. Shankar
              </div>
            </div>
            <div className="progress-wrap">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "60%", background: "#bf9b30" }}
                />
              </div>
              <div className="prog-lbl">60% done</div>
            </div>
            <div
              className="grade-badge"
              style={{ background: "#fdf5e0", color: "#8a6e1a" }}
            >
              A−
            </div>
          </div>

          <div className="course-row">
            <div className="course-dot" style={{ background: "#b65b2b" }} />
            <div style={{ flex: 1 }}>
              <div className="course-name">Computer Networks</div>
              <div className="course-code">CS603 &nbsp;·&nbsp; Dr. S. Iyer</div>
            </div>
            <div className="progress-wrap">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "55%", background: "#b65b2b" }}
                />
              </div>
              <div className="prog-lbl">55% done</div>
            </div>
            <div
              className="grade-badge"
              style={{ background: "#faeee8", color: "#b65b2b" }}
            >
              B+
            </div>
          </div>

          <div className="course-row">
            <div className="course-dot" style={{ background: "#1a7a5e" }} />
            <div style={{ flex: 1 }}>
              <div className="course-name">Software Engineering</div>
              <div className="course-code">
                CS604 &nbsp;·&nbsp; Prof. A. Nair
              </div>
            </div>
            <div className="progress-wrap">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "80%", background: "#1a7a5e" }}
                />
              </div>
              <div className="prog-lbl">80% done</div>
            </div>
            <div
              className="grade-badge"
              style={{ background: "#e0f5ee", color: "#1a7a5e" }}
            >
              A+
            </div>
          </div>

          <div className="course-row">
            <div className="course-dot" style={{ background: "#7a3a8e" }} />
            <div style={{ flex: 1 }}>
              <div className="course-name">Operating Systems</div>
              <div className="course-code">
                CS605 &nbsp;·&nbsp; Dr. K. Reddy
              </div>
            </div>
            <div className="progress-wrap">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "65%", background: "#7a3a8e" }}
                />
              </div>
              <div className="prog-lbl">65% done</div>
            </div>
            <div
              className="grade-badge"
              style={{ background: "#f3eaf8", color: "#7a3a8e" }}
            >
              B+
            </div>
          </div>
        </div>

        <div className="two-col">
          <div className="section-card">
            <div className="sec-head">Today's Schedule</div>

            <div className="event-row">
              <div className="event-time">9:00 AM</div>
              <div className="event-dot" style={{ background: "#005826" }} />
              <div>
                <div className="event-name">Machine Learning</div>
                <div className="event-loc">Hall C-204</div>
              </div>
            </div>
            <div className="event-row">
              <div className="event-time">11:00 AM</div>
              <div className="event-dot" style={{ background: "#bf9b30" }} />
              <div>
                <div className="event-name">DB Lab Session</div>
                <div className="event-loc">Lab 3, Block B</div>
              </div>
            </div>
            <div className="event-row">
              <div className="event-time">2:00 PM</div>
              <div className="event-dot" style={{ background: "#b65b2b" }} />
              <div>
                <div className="event-name">Networks Tutorial</div>
                <div className="event-loc">Room A-109</div>
              </div>
            </div>
            <div className="event-row">
              <div className="event-time">3:30 PM</div>
              <div className="event-dot" style={{ background: "#7a3a8e" }} />
              <div>
                <div className="event-name">OS Lecture</div>
                <div className="event-loc">Hall D-301</div>
              </div>
            </div>
            <div className="event-row">
              <div className="event-time">4:30 PM</div>
              <div className="event-dot" style={{ background: "#1a7a5e" }} />
              <div>
                <div className="event-name">SE Project Meet</div>
                <div className="event-loc">Seminar Hall 2</div>
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="sec-head">Announcements</div>

            <div className="ann-row">
              <div className="ann-title">Mid-sem exams: Apr 22–28</div>
              <span
                className="ann-tag"
                style={{ background: "#eaf5ee", color: "#005826" }}
              >
                Exam
              </span>
              <div className="ann-date">Apr 10, 2026</div>
            </div>
            <div className="ann-row">
              <div className="ann-title">ML Assignment 3 due Apr 15</div>
              <span
                className="ann-tag"
                style={{ background: "#faeee8", color: "#b65b2b" }}
              >
                Urgent
              </span>
              <div className="ann-date">Apr 9, 2026</div>
            </div>
            <div className="ann-row">
              <div className="ann-title">Hackathon registrations open</div>
              <span
                className="ann-tag"
                style={{ background: "#fdf5e0", color: "#8a6e1a" }}
              >
                Event
              </span>
              <div className="ann-date">Apr 8, 2026</div>
            </div>
            <div className="ann-row">
              <div className="ann-title">Library extended hours this week</div>
              <span
                className="ann-tag"
                style={{ background: "#e0f5ee", color: "#1a7a5e" }}
              >
                Info
              </span>
              <div className="ann-date">Apr 7, 2026</div>
            </div>
            <div className="ann-row">
              <div className="ann-title">Placement drive: TCS & Infosys</div>
              <span
                className="ann-tag"
                style={{ background: "#f3eaf8", color: "#7a3a8e" }}
              >
                Placement
              </span>
              <div className="ann-date">Apr 6, 2026</div>
            </div>
          </div>
        </div>

        <div className="two-col">
          <div className="section-card">
            <div className="sec-head">CGPA Trend</div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <span
                style={{ fontSize: "26px", fontWeight: 700, color: "#005826" }}
              >
                8.74
              </span>
              <span style={{ fontSize: "12px", color: "#1a7a5e" }}>
                ▲ 0.12 from last sem
              </span>
            </div>
            <div className="gpa-chart">
              <div className="gpa-bar-wrap">
                <div className="gpa-val">7.9</div>
                <div
                  className="gpa-bar"
                  style={{
                    height: "53%",
                    background: "#bf9b30",
                    opacity: 0.45,
                  }}
                />
                <div className="gpa-sem">Sem 1</div>
              </div>
              <div className="gpa-bar-wrap">
                <div className="gpa-val">8.1</div>
                <div
                  className="gpa-bar"
                  style={{
                    height: "60%",
                    background: "#bf9b30",
                    opacity: 0.55,
                  }}
                />
                <div className="gpa-sem">Sem 2</div>
              </div>
              <div className="gpa-bar-wrap">
                <div className="gpa-val">8.3</div>
                <div
                  className="gpa-bar"
                  style={{
                    height: "68%",
                    background: "#bf9b30",
                    opacity: 0.65,
                  }}
                />
                <div className="gpa-sem">Sem 3</div>
              </div>
              <div className="gpa-bar-wrap">
                <div className="gpa-val">8.5</div>
                <div
                  className="gpa-bar"
                  style={{
                    height: "76%",
                    background: "#bf9b30",
                    opacity: 0.78,
                  }}
                />
                <div className="gpa-sem">Sem 4</div>
              </div>
              <div className="gpa-bar-wrap">
                <div className="gpa-val">8.62</div>
                <div
                  className="gpa-bar"
                  style={{ height: "88%", background: "#bf9b30", opacity: 0.9 }}
                />
                <div className="gpa-sem">Sem 5</div>
              </div>
              <div className="gpa-bar-wrap">
                <div className="gpa-val">8.74</div>
                <div
                  className="gpa-bar"
                  style={{ height: "100%", background: "#005826" }}
                />
                <div className="gpa-sem">Sem 6</div>
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="sec-head">Quick Access</div>
            <div className="quick-grid">
              <div className="quick-item" style={{ background: "#eaf5ee" }}>
                <div className="quick-icon">📋</div>
                <div className="quick-label" style={{ color: "#005826" }}>
                  Results
                </div>
              </div>
              <div className="quick-item" style={{ background: "#fdf5e0" }}>
                <div className="quick-icon">📚</div>
                <div className="quick-label" style={{ color: "#8a6e1a" }}>
                  Library
                </div>
              </div>
              <div className="quick-item" style={{ background: "#faeee8" }}>
                <div className="quick-icon">💳</div>
                <div className="quick-label" style={{ color: "#b65b2b" }}>
                  Fee Portal
                </div>
              </div>
              <div className="quick-item" style={{ background: "#e0f5ee" }}>
                <div className="quick-icon">🎓</div>
                <div className="quick-label" style={{ color: "#1a7a5e" }}>
                  Placement
                </div>
              </div>
              <div className="quick-item" style={{ background: "#f3eaf8" }}>
                <div className="quick-icon">📅</div>
                <div className="quick-label" style={{ color: "#7a3a8e" }}>
                  Timetable
                </div>
              </div>
              <div className="quick-item" style={{ background: "#fff3e0" }}>
                <div className="quick-icon">🏆</div>
                <div className="quick-label" style={{ color: "#b06000" }}>
                  Certificates
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        © 2026 JNANAM PU College &nbsp;·&nbsp; Student Academic Portal
        &nbsp;·&nbsp; All rights reserved
      </div>

      <style jsx global>{`
        :root {
          --primary-green: #005826;
          --accent-gold: #bf9b30;
          --brick-red: #b65b2b;
          --bg-light: #f2f2f2;
          --text-dark: #333333;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: system-ui, sans-serif;
        }

        body {
          background: var(--bg-light);
          min-height: 100vh;
        }

        .hero {
          position: relative;
          height: 500px;
          background: linear-gradient(
            135deg,
            var(--primary-green) 0%,
            #003d1a 100%
          );
          overflow: hidden;
          display: flex;
          align-items: flex-end;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background-image: url("/college.jpeg");
          background-size: cover;
          background-position: center;
          opacity: 0.9;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 40, 15, 0.85) 0%,
            rgba(0, 0, 0, 0.1) 60%
          );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          padding: 0 20px 18px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .college-logo {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 3px solid #005826;
          overflow: hidden;
        }

        .college-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .hero-text {
          flex: 1;
          padding-left: 14px;
        }

        .hero-text h1 {
          font-size: 20px;
          font-weight: 600;
          color: white;
          letter-spacing: 0.3px;
        }

        .hero-text p {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 3px;
        }

        .hero-badge {
          background: var(--accent-gold);
          color: #3a2800;
          font-size: 11px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 20px;
          white-space: nowrap;
          align-self: flex-end;
        }

        .nav {
          background: var(--primary-green);
          display: flex;
          gap: 2px;
          padding: 0 16px;
          border-bottom: 2px solid var(--accent-gold);
          overflow-x: auto;
        }

        .nav::-webkit-scrollbar {
          display: none;
        }

        .nav-item {
          padding: 11px 16px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.65);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          white-space: nowrap;
          transition: color 0.2s;
        }

        .nav-item.active {
          color: var(--accent-gold);
          border-bottom-color: var(--accent-gold);
          font-weight: 600;
        }

        .nav-item:hover:not(.active) {
          color: rgba(255, 255, 255, 0.9);
        }

        .body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .welcome-card {
          background: white;
          border-radius: 10px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-left: 4px solid var(--accent-gold);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--primary-green);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 17px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .welcome-text h2 {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-dark);
        }

        .welcome-text p {
          font-size: 12px;
          color: #666;
          margin-top: 3px;
        }

        .semester-tag {
          margin-left: auto;
          background: #eaf5ee;
          color: var(--primary-green);
          font-size: 11px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 20px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .stat-card {
          background: white;
          border-radius: 10px;
          padding: 14px;
          text-align: center;
          border-top: 3px solid;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        }

        .stat-card.green {
          border-top-color: var(--primary-green);
        }

        .stat-card.gold {
          border-top-color: var(--accent-gold);
        }

        .stat-card.red {
          border-top-color: var(--brick-red);
        }

        .stat-card.teal {
          border-top-color: #1a7a5e;
        }

        .stat-val {
          font-size: 24px;
          font-weight: 700;
        }

        .stat-card.green .stat-val {
          color: var(--primary-green);
        }

        .stat-card.gold .stat-val {
          color: #8a6e1a;
        }

        .stat-card.red .stat-val {
          color: var(--brick-red);
        }

        .stat-card.teal .stat-val {
          color: #1a7a5e;
        }

        .stat-lbl {
          font-size: 11px;
          color: #888;
          margin-top: 4px;
        }

        .sec-head {
          font-size: 13px;
          font-weight: 600;
          color: var(--primary-green);
          border-bottom: 1px solid #eee;
          padding-bottom: 8px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sec-head::before {
          content: "";
          display: block;
          width: 3px;
          height: 14px;
          background: var(--accent-gold);
          border-radius: 2px;
        }

        .section-card {
          background: white;
          border-radius: 10px;
          padding: 14px 16px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
        }

        .course-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 0;
          border-bottom: 0.5px solid #f0f0f0;
        }

        .course-row:last-child {
          border-bottom: none;
        }

        .course-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .course-name {
          font-size: 13px;
          color: var(--text-dark);
          flex: 1;
          font-weight: 500;
        }

        .course-code {
          font-size: 11px;
          color: #999;
          margin-top: 2px;
        }

        .progress-wrap {
          width: 90px;
        }

        .progress-bar {
          height: 5px;
          background: #eee;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 3px;
        }

        .prog-lbl {
          font-size: 10px;
          color: #888;
          text-align: right;
          margin-top: 2px;
        }

        .grade-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 5px;
          margin-left: 8px;
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .event-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 0.5px solid #f0f0f0;
        }

        .event-row:last-child {
          border-bottom: none;
        }

        .event-time {
          font-size: 10px;
          color: #aaa;
          min-width: 46px;
          padding-top: 2px;
        }

        .event-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .event-name {
          font-size: 12px;
          color: var(--text-dark);
          font-weight: 500;
        }

        .event-loc {
          font-size: 10px;
          color: #aaa;
          margin-top: 1px;
        }

        .ann-row {
          padding: 8px 0;
          border-bottom: 0.5px solid #f0f0f0;
        }

        .ann-row:last-child {
          border-bottom: none;
        }

        .ann-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-dark);
        }

        .ann-date {
          font-size: 10px;
          color: #aaa;
          margin-top: 3px;
        }

        .ann-tag {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 4px;
          display: inline-block;
          margin: 3px 0;
        }

        .gpa-chart {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 80px;
          margin-top: 10px;
        }

        .gpa-bar-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          height: 100%;
          justify-content: flex-end;
        }

        .gpa-bar {
          width: 100%;
          border-radius: 3px 3px 0 0;
        }

        .gpa-sem {
          font-size: 9px;
          color: #aaa;
        }

        .gpa-val {
          font-size: 9px;
          color: #666;
        }

        .quick-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 4px;
        }

        .quick-item {
          border-radius: 8px;
          padding: 12px 8px;
          text-align: center;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .quick-item:hover {
          opacity: 0.8;
        }

        .quick-icon {
          font-size: 20px;
          margin-bottom: 5px;
        }

        .quick-label {
          font-size: 11px;
          font-weight: 600;
        }

        .footer {
          text-align: center;
          font-size: 11px;
          color: #aaa;
          padding: 16px;
          margin-top: 4px;
          border-top: 1px solid #ddd;
        }

        @media (max-width: 600px) {
          .stat-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .two-col {
            grid-template-columns: 1fr;
          }
          .hero-text h1 {
            font-size: 15px;
          }
          .semester-tag {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
