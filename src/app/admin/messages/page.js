"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import styles from "./messages.module.css";

export default function MessagesPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [fcmLoading, setFcmLoading] = useState(false);

  // ── Auth ──────────────────────────────────────────────────────────
  const handleLogin = (e) => {
    e.preventDefault();
    const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER || "admin";
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || "xixya2024";

    if (credentials.username === adminUser && credentials.password === adminPass) {
      setAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      setLoginError(null);
    } else {
      setLoginError("Invalid credentials");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  // ── Fetch Messages ────────────────────────────────────────────────
  const fetchMessages = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        setStatusMsg({ type: "error", text: "Failed to load messages" });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Network error — check your connection" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetchMessages();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchMessages(), 30000);
    return () => clearInterval(interval);
  }, [authenticated, fetchMessages]);

  // ── Actions ───────────────────────────────────────────────────────
  const handleMarkRead = async (id) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (res.ok) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
        setStatusMsg({ type: "success", text: "Marked as read" });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Failed to mark as read" });
    }
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setExpandedId(null);
        setStatusMsg({ type: "success", text: "Message deleted" });
      }
    } catch {
      setStatusMsg({ type: "error", text: "Failed to delete" });
    }
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ── FCM Token ─────────────────────────────────────────────────────
  const handleGetFCMToken = async () => {
    setFcmLoading(true);
    try {
      const { requestFCMToken } = await import("@/lib/firebase-client");
      const token = await requestFCMToken();
      if (token) {
        setFcmToken(token);
      } else {
        setStatusMsg({
          type: "error",
          text: "Could not get FCM token. Make sure notifications are allowed.",
        });
        setTimeout(() => setStatusMsg(null), 5000);
      }
    } catch (err) {
      console.error("FCM error:", err);
      setStatusMsg({ type: "error", text: "FCM setup failed: " + err.message });
      setTimeout(() => setStatusMsg(null), 5000);
    } finally {
      setFcmLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────
  const unreadCount = messages.filter((m) => !m.read).length;

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return dateStr;
    }
  };

  // ── Login Screen ──────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className={styles.loginWrap}>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.loginIcon}>
            <span>📬</span>
          </div>
          <h1 className={styles.loginTitle}>Messages</h1>
          <p className={styles.loginSubtitle}>Sign in to view contact messages</p>

          <div className="form-group">
            <label className="form-label" htmlFor="msg-user">Username</label>
            <input
              id="msg-user"
              type="text"
              className="form-input"
              value={credentials.username}
              onChange={(e) => setCredentials((p) => ({ ...p, username: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="msg-pass">Password</label>
            <input
              id="msg-pass"
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

          {loginError && (
            <div className="status-error">{loginError}</div>
          )}
        </form>
      </div>
    );
  }

  // ── Main Layout ───────────────────────────────────────────────────
  return (
    <div className={styles.messagesLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarIcon}>Y</span>
          <span>Admin</span>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/admin" className={styles.sidebarLink}>
            📊 Dashboard
          </Link>
          <Link href="/admin/messages" className={`${styles.sidebarLink} ${styles.sidebarActive}`}>
            📬 Messages
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </Link>
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

      {/* Main */}
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>
              Messages
              {unreadCount > 0 && <span className={styles.unreadCount}>{unreadCount} new</span>}
            </h1>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.refreshBtn}
              onClick={() => fetchMessages(true)}
              disabled={refreshing}
              id="refresh-messages-btn"
            >
              <span className={refreshing ? styles.spinning : ""}>🔄</span>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Status */}
        {statusMsg && (
          <div className={statusMsg.type === "error" ? styles.statusError : styles.statusSuccess}>
            {statusMsg.text}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⏳</div>
            <p className={styles.emptyTitle}>Loading messages...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && messages.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h3 className={styles.emptyTitle}>No messages yet</h3>
            <p className={styles.emptySubtitle}>
              When visitors send you a message through the contact form, they will appear here.
            </p>
          </div>
        )}

        {/* Messages List */}
        {!loading && messages.length > 0 && (
          <div className={styles.messageList}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageCard} ${msg.read ? styles.messageRead : styles.messageUnread}`}
              >
                {/* Card Header (clickable to expand) */}
                <div className={styles.messageCardHeader} onClick={() => toggleExpand(msg.id)}>
                  <div className={styles.messageMeta}>
                    <div className={styles.messageTopRow}>
                      {msg.read ? (
                        <span className={styles.badgeRead}>✓ Read</span>
                      ) : (
                        <span className={styles.badgeNew}>● New</span>
                      )}
                      <span className={styles.senderName}>{msg.name}</span>
                    </div>
                    <div className={styles.messageSubject}>{msg.subject}</div>
                    <div className={styles.messageDetails}>
                      <span className={styles.detailItem}>✉ {msg.email}</span>
                      <span className={styles.detailItem}>🏢 {msg.businessSector}</span>
                    </div>
                    {expandedId !== msg.id && (
                      <div className={styles.messagePreview}>
                        {msg.message}
                      </div>
                    )}
                  </div>
                  <span className={styles.messageTimestamp}>{formatDate(msg.createdAt)}</span>
                </div>

                {/* Expanded Body */}
                {expandedId === msg.id && (
                  <div className={styles.messageBody}>
                    <div className={styles.messageContent}>{msg.message}</div>
                    <div className={styles.messageActions}>
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className={styles.replyBtn}
                        id={`reply-${msg.id}`}
                      >
                        ✉ Reply
                      </a>
                      {!msg.read && (
                        <button
                          className={styles.markReadBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkRead(msg.id);
                          }}
                          id={`mark-read-${msg.id}`}
                        >
                          ✓ Mark Read
                        </button>
                      )}
                      <button
                        className={styles.deleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(msg.id);
                        }}
                        id={`delete-${msg.id}`}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* FCM Token Section */}
        <div className={styles.fcmSection}>
          <h4 className={styles.fcmTitle}>🔔 Push Notification Setup</h4>
          <p className={styles.fcmDescription}>
            Get your device FCM token to receive push notifications on this device when someone
            contacts you. Open this page from your phone and tap the button below.
          </p>
          {!fcmToken ? (
            <button
              className="btn btn-primary"
              style={{ fontSize: "0.85rem", padding: "0.5rem 1.2rem" }}
              onClick={handleGetFCMToken}
              disabled={fcmLoading}
              id="get-fcm-token-btn"
            >
              {fcmLoading ? "Requesting..." : "🔑 Get My FCM Token"}
            </button>
          ) : (
            <>
              <p className={styles.fcmDescription}>
                ✅ Token received! Copy this token and add it to your <code>.env.local</code> file
                as <code>FCM_DEVICE_TOKEN</code>:
              </p>
              <div className={styles.fcmToken}>{fcmToken}</div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
