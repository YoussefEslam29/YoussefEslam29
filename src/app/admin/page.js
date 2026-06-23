"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./admin.module.css";

const CERT_CATEGORIES = ["Training & Courses", "IEEE & Events", "Competition & Achievements"];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [activeTab, setActiveTab] = useState("projects");
  const [data, setData] = useState({ projects: [], skills: [], certificates: [] });
  const [editItem, setEditItem] = useState(null);
  const [message, setMessage] = useState(null);
  const [showCertForm, setShowCertForm] = useState(false);
  const [certForm, setCertForm] = useState({
    title: "",
    issuer: "",
    date: "",
    description: "",
    category: "IEEE & Events",
    image: "",
  });
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Simple client-side auth check — in production, use NextAuth
    const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER || "admin";
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "xixya2024";

    if (credentials.username === adminUser && credentials.password === adminPass) {
      setAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
    } else {
      setMessage({ type: "error", text: "Invalid credentials" });
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetchData();
    fetchUnreadCount();
  }, [authenticated]);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const msgs = await res.json();
        setUnreadCount(msgs.filter((m) => !m.read).length);
      }
    } catch {
      // Silently fail — unread count is not critical
    }
  };

  const fetchData = async () => {
    try {
      const [projRes, skillRes, certRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/skills"),
        fetch("/api/certificates"),
      ]);
      const projects = projRes.ok ? await projRes.json() : [];
      const skills = skillRes.ok ? await skillRes.json() : [];
      const certificates = certRes.ok ? await certRes.json() : [];
      setData({ projects, skills, certificates });
    } catch {
      setMessage({ type: "error", text: "Failed to fetch data" });
    }
  };

  const handleGitHubSync = async () => {
    try {
      setMessage({ type: "info", text: "Syncing GitHub repos..." });
      const res = await fetch("/api/github/sync", { method: "POST" });
      if (res.ok) {
        setMessage({ type: "success", text: "GitHub repos synced!" });
        fetchData();
      } else {
        setMessage({ type: "error", text: "Sync failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Sync failed" });
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/${type}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage({ type: "success", text: `${type} item deleted` });
        fetchData();
      }
    } catch {
      setMessage({ type: "error", text: "Delete failed" });
    }
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    try {
      setMessage({ type: "info", text: "Adding certificate..." });
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(certForm),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Certificate added!" });
        setCertForm({
          title: "",
          issuer: "",
          date: "",
          description: "",
          category: "IEEE & Events",
          image: "",
        });
        setShowCertForm(false);
        fetchData();
      } else {
        setMessage({ type: "error", text: "Failed to add certificate" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to add certificate" });
    }
  };

  if (!authenticated) {
    return (
      <div className={styles.loginWrap}>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.loginIcon}>
            <span>Y</span>
          </div>
          <h1 className={styles.loginTitle}>Admin Panel</h1>
          <p className={styles.loginSubtitle}>Sign in to manage your portfolio</p>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-user">Username</label>
            <input
              id="admin-user"
              type="text"
              className="form-input"
              value={credentials.username}
              onChange={(e) => setCredentials((p) => ({ ...p, username: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-pass">Password</label>
            <input
              id="admin-pass"
              type="password"
              className="form-input"
              value={credentials.password}
              onChange={(e) => setCredentials((p) => ({ ...p, password: e.target.value }))}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Sign In
          </button>

          {message && (
            <div className={message.type === "error" ? "status-error" : "status-success"}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className={styles.admin}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarIcon}>Y</span>
          <span>Admin</span>
        </div>
        <nav className={styles.sidebarNav}>
          {["projects", "skills", "certificates"].map((tab) => (
            <button
              key={tab}
              className={`${styles.sidebarLink} ${activeTab === tab ? styles.sidebarActive : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <Link
            href="/admin/messages"
            className={styles.sidebarLink}
            style={{ position: "relative" }}
          >
            📬 Messages
            {unreadCount > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "20px",
                  height: "20px",
                  padding: "0 6px",
                  borderRadius: "10px",
                  background: "#ef4444",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  marginLeft: "auto",
                }}
              >
                {unreadCount}
              </span>
            )}
          </Link>
          <button className={styles.sidebarLink} onClick={handleGitHubSync}>
            🔄 Sync GitHub
          </button>
        </nav>
        <button
          className={styles.logoutBtn}
          onClick={() => {
            sessionStorage.removeItem("admin_auth");
            setAuthenticated(false);
          }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <h1 className={styles.mainTitle}>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {activeTab === "certificates" && (
              <button
                className="btn btn-primary"
                style={{ fontSize: "0.85rem", padding: "0.5rem 1.2rem" }}
                onClick={() => setShowCertForm((p) => !p)}
              >
                {showCertForm ? "Cancel" : "+ Add Certificate"}
              </button>
            )}
            {message && (
              <div className={message.type === "error" ? "status-error" : "status-success"}>
                {message.text}
              </div>
            )}
          </div>
        </div>

        {/* Add Certificate Form */}
        {activeTab === "certificates" && showCertForm && (
          <form
            className={styles.certForm}
            onSubmit={handleAddCertificate}
            id="add-certificate-form"
          >
            <div className="form-group">
              <label className="form-label" htmlFor="cert-title">Title</label>
              <input
                id="cert-title"
                type="text"
                className="form-input"
                placeholder="e.g. AWS Cloud Practitioner"
                value={certForm.title}
                onChange={(e) => setCertForm((p) => ({ ...p, title: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cert-issuer">Issuing Organization</label>
              <input
                id="cert-issuer"
                type="text"
                className="form-input"
                placeholder="e.g. Amazon Web Services"
                value={certForm.issuer}
                onChange={(e) => setCertForm((p) => ({ ...p, issuer: e.target.value }))}
                required
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="cert-date">Date</label>
                <input
                  id="cert-date"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 2025"
                  value={certForm.date}
                  onChange={(e) => setCertForm((p) => ({ ...p, date: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="cert-category">Category</label>
                <select
                  id="cert-category"
                  className="form-input"
                  value={certForm.category}
                  onChange={(e) => setCertForm((p) => ({ ...p, category: e.target.value }))}
                >
                  {CERT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cert-image">Image URL / Path</label>
              <input
                id="cert-image"
                type="text"
                className="form-input"
                placeholder="e.g. /certificates/my_certificate.png"
                value={certForm.image}
                onChange={(e) => setCertForm((p) => ({ ...p, image: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cert-description">Description</label>
              <textarea
                id="cert-description"
                className="form-input"
                placeholder="Brief description of the certificate..."
                value={certForm.description}
                onChange={(e) => setCertForm((p) => ({ ...p, description: e.target.value }))}
                style={{ minHeight: "80px" }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Save Certificate
            </button>
          </form>
        )}

        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Title / Name</span>
            <span>Category</span>
            <span>Actions</span>
          </div>
          {(data[activeTab] || []).map((item) => (
            <div key={item.id || item._id} className={styles.tableRow}>
              <span>{item.title || item.name || item.institution || "—"}</span>
              <span className="tag">{item.category || item.issuer || "—"}</span>
              <span className={styles.tableActions}>
                <button
                  className={styles.actionBtn}
                  onClick={() => handleDelete(activeTab, item.id || item._id)}
                >
                  🗑
                </button>
              </span>
            </div>
          ))}
          {(data[activeTab] || []).length === 0 && (
            <div className={styles.emptyState}>
              <p>No {activeTab} found. Add some or sync from GitHub.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
