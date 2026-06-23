// Firebase Messaging Service Worker
// Required by Firebase Cloud Messaging for background notifications.
// Must be served at the root: /firebase-messaging-sw.js
// Cannot use process.env — config is hardcoded (values are NEXT_PUBLIC anyway).

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB6t3xIq0Luvc6vxyz8tISko6Wf6tf8F6U",
  authDomain: "youssef-portfolio-701d8.firebaseapp.com",
  projectId: "youssef-portfolio-701d8",
  storageBucket: "youssef-portfolio-701d8.firebasestorage.app",
  messagingSenderId: "170776048304",
  appId: "1:170776048304:web:95bfcaeaba725d39b00175",
});

const messaging = firebase.messaging();

// Handle background notifications (when the browser tab is not in focus)
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "New message on your portfolio";
  const body = payload.notification?.body || "Someone sent you a contact message.";

  self.registration.showNotification(title, {
    body,
    icon: "/icon.png",
    badge: "/icon.png",
    data: payload.data,
  });
});
