import React, { useState, useEffect, useCallback, useRef } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import LoginScreen from "./LoginScreen.jsx";
import ParentPortal from "./ParentPortal.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import { COLORS, Logo } from "./theme.jsx";
import { auth, firebaseConfigured } from "./firebase.js";
import {
  seedIfEmpty, subscribeMeta, subscribeAllStudents, subscribeStudent,
  subscribeGallery, assembleData, persistChanges,
} from "./store.js";

export default function App() {
  const [session, setSession] = useState(() => {
    try {
      const raw = sessionStorage.getItem("eis_session");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [authReady, setAuthReady] = useState(false);
  const [meta, setMeta] = useState(null);
  const [studentsMap, setStudentsMap] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [metaReady, setMetaReady] = useState(false);
  const [error, setError] = useState(null);

  // Keep the latest assembled data in a ref so updateData always diffs
  // against the freshest snapshot without needing to be recreated on
  // every render.
  const dataRef = useRef(null);

  // 1) Sign in anonymously (required by the Firestore security rules
  //    rules suggested in the README: `allow read, write: if request.auth != null`).
  useEffect(() => {
    if (!firebaseConfigured) return;
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthReady(true);
      } else {
        signInAnonymously(auth).catch((e) => {
          setError("فشل تسجيل الدخول التلقائي إلى Firebase: " + e.message);
        });
      }
    });
    return () => unsub();
  }, []);

  // 2) Seed the database on first run, then subscribe to shared "meta" doc.
  useEffect(() => {
    if (!firebaseConfigured || !authReady) return;
    let unsubMeta;
    (async () => {
      try {
        await seedIfEmpty();
        unsubMeta = subscribeMeta((m) => {
          setMeta(m);
          setMetaReady(true);
        });
      } catch (e) {
        console.error(e);
        setError(
          "تعذر الاتصال بقاعدة البيانات. تأكد من قواعد الأمان (Security Rules) في Firestore كما هو موضح في README."
        );
      }
    })();
    return () => unsubMeta && unsubMeta();
  }, [authReady]);

  // 3) Subscribe to student data depending on role.
  useEffect(() => {
    if (!firebaseConfigured || !authReady || !session) {
      setStudentsMap(null);
      return;
    }
    let unsub;
    if (session.role === "admin") {
      unsub = subscribeAllStudents(setStudentsMap);
    } else {
      unsub = subscribeStudent(session.studentId, setStudentsMap);
    }
    return () => unsub && unsub();
  }, [authReady, session]);

  // 4) Subscribe to gallery once logged in.
  useEffect(() => {
    if (!firebaseConfigured || !authReady || !session) {
      setGallery([]);
      return;
    }
    const unsub = subscribeGallery(setGallery);
    return () => unsub && unsub();
  }, [authReady, session]);

  const data = assembleData(meta, studentsMap || {}, gallery);
  dataRef.current = data;

  const updateData = useCallback((updater) => {
    const prev = dataRef.current;
    const next = typeof updater === "function" ? updater(prev) : updater;
    persistChanges(prev, next).catch((e) => {
      console.error("Failed to save to Firestore:", e);
    });
  }, []);

  function handleLogin(sess) {
    setSession(sess);
    sessionStorage.setItem("eis_session", JSON.stringify(sess));
  }

  function handleLogout() {
    setSession(null);
    sessionStorage.removeItem("eis_session");
  }

  if (!firebaseConfigured) {
    return <SetupScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  if (!authReady || !metaReady) {
    return <LoadingScreen text="جارٍ الاتصال بقاعدة البيانات..." />;
  }

  if (!session) {
    return <LoginScreen data={data} onLogin={handleLogin} />;
  }

  if (studentsMap === null) {
    return <LoadingScreen text="جارٍ تحميل البيانات..." />;
  }

  if (session.role === "admin") {
    return <AdminDashboard data={data} updateData={updateData} onLogout={handleLogout} />;
  }

  return (
    <ParentPortal
      data={data}
      updateData={updateData}
      studentId={session.studentId}
      onLogout={handleLogout}
    />
  );
}

function LoadingScreen({ text }) {
  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl" style={{ background: COLORS.bg }}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Logo size={64} withText={false} />
        </div>
        <p className="text-sm font-bold" style={{ color: COLORS.purple }}>{text}</p>
      </div>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" dir="rtl" style={{ background: COLORS.bg }}>
      <div className="max-w-md text-center bg-white rounded-2xl p-8 shadow">
        <h2 className="font-extrabold text-lg mb-3" style={{ color: COLORS.red }}>حدث خطأ في الاتصال</h2>
        <p className="text-sm leading-7" style={{ color: COLORS.sub }}>{message}</p>
      </div>
    </div>
  );
}

function SetupScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" dir="rtl" style={{ background: COLORS.bg }}>
      <div className="max-w-lg text-center bg-white rounded-2xl p-8 shadow">
        <div className="flex justify-center mb-4">
          <Logo size={64} withText={false} />
        </div>
        <h2 className="font-extrabold text-lg mb-3" style={{ color: COLORS.purple }}>إعداد Firebase مطلوب</h2>
        <p className="text-sm leading-7" style={{ color: COLORS.sub }}>
          لم يتم العثور على إعدادات Firebase. أنشئ ملف <b dir="ltr">.env</b> في جذر المشروع
          وأضف مفاتيح مشروعك في Firebase كما هو موضح بالتفصيل في ملف <b>README.md</b>،
          ثم نفّذ <code dir="ltr">npm run build</code> مرة أخرى.
        </p>
      </div>
    </div>
  );
}
