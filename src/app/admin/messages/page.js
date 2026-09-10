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
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (res.ok) {
        setAuthenticated(true);
        setLoginError(null);
      } else {
        setLoginError("Invalid credentials");
      }
    } catch {
      setLoginError("Could not reach the server");
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/session")
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => {
        if (active && data.authenticated) setAuthenticated(true);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
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

    // Deferred so the first load's state updates land after this effect.
    const initial = setTimeout(() => fetchMessages(), 0);
    const interval = setInterval(() => fetchMessages(), 30000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
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
            <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> Dashboard
          </Link>
          <Link href="/admin/messages" className={`${styles.sidebarLink} ${styles.sidebarActive}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> Messages
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </Link>
        </nav>
        <button
          className={styles.logoutBtn}
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
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
              <span className={refreshing ? styles.spinning : ""}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg></span>
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
            <div className={styles.emptyIcon}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
            <p className={styles.emptyTitle}>Loading messages...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && messages.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg></div>
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
                        <span className={styles.badgeRead}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg> Read</span>
                      ) : (
                        <span className={styles.badgeNew}><span className={styles.dot} aria-hidden="true" /> New</span>
                      )}
                      <span className={styles.senderName}>{msg.name}</span>
                    </div>
                    <div className={styles.messageSubject}>{msg.subject}</div>
                    <div className={styles.messageDetails}>
                      <span className={styles.detailItem}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> {msg.email}</span>
                      <span className={styles.detailItem}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/></svg> {msg.businessSector}</span>
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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> Reply
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg> Mark Read
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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Delete
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
          <h4 className={styles.fcmTitle}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.41 5.956-2.738 7.326"/></svg> Push Notification Setup</h4>
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
              {fcmLoading ? "Requesting..." : "Get My FCM Token"}
            </button>
          ) : (
            <>
              <p className={styles.fcmDescription}>
                Token received! Copy this token and add it to your <code>.env.local</code> file
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
