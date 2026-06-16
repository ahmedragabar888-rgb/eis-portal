// Cloud data store for the Elite International Schools portal.
// Backed by Firebase Firestore (structured data) and Cloudinary (photos).
//
// Data layout in Firestore:
//   meta/main            -> { settings, users, announcements, schedule }
//   students/{studentId} -> { profile, homework, onlineClasses, attendance,
//                              dailyReports, grades, exams, messages }
//   gallery/{albumId}     -> { title, color, studentId, images: [{url, path}] }
//
// This keeps each student's growing data (attendance, daily reports,
// messages...) in its own document, so the platform scales comfortably to
// many students without hitting Firestore's 1MB-per-document limit.

import {
  doc, getDoc, setDoc, deleteDoc, onSnapshot, collection,
} from "firebase/firestore";
import { db } from "./firebase.js";

// Cloudinary is used for gallery photo storage (unsigned upload preset).
// Firebase Storage is not used because it requires the Blaze (pay-as-you-go)
// plan, which currently routes through a regional billing portal that does
// not support individual sign-ups in some countries.
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// ---------------------------------------------------------------------
// Default / seed data — written once when the database is empty so the
// platform has a working admin account and two sample students.
// ---------------------------------------------------------------------

const DEFAULT_META = {
  settings: {
    whatsappNumber: "",
  },
  classes: [],
  teachers: [],
  users: {
    admin: { username: "admin", password: "Admin@2026", role: "admin", name: "إدارة المدرسة" },
    parents: [
      { username: "0501234567", password: "Elite123", role: "parent", studentId: "std_001" },
      { username: "0559876543", password: "Nokhba2026", role: "parent", studentId: "std_002" },
    ],
  },
  announcements: [
    { id: "a_1", type: "orange", title: "إعلان من المدرسة", desc: "رحلة مدرسية يوم الأحد القادم" },
  ],
  schedule: {
    "الأحد": ["English", "Math", "Art", "Quran", "Arabic", "Science"],
    "الاثنين": ["Arabic", "Science", "PE", "English", "Math", "Music"],
    "الثلاثاء": ["Math", "English", "Quran", "Art", "Science", "Arabic"],
    "الأربعاء": ["Science", "Arabic", "Math", "PE", "English", "Art"],
    "الخميس": ["Quran", "Art", "English", "Science", "Math", "Circle Time"],
  },
};

const DEFAULT_STUDENTS = {
  std_001: {
    profile: {
      name: "بلال أحمد", grade: "KG1 — فصل 1", nationalId: "1xxxxxxxxx",
      birthDate: "12 / 03 / 2021", bloodType: "O+", contact: "0501234567", avatar: "ب",
      classId: null, status: "active", withdrawalReason: "", withdrawalDate: "",
      fees: { type: "monthly", amount: 1500, installments: [], paidMonths: [] },
    },
    homework: [
      { id: "hw_1", subject: "اللغة الإنجليزية", title: "Letter A Worksheet", due: "الخميس", status: "جديد", fileUrl: "", videoUrl: "" },
      { id: "hw_2", subject: "الرياضيات", title: "تمارين العد من 1 إلى 10", due: "الأحد", status: "جديد", fileUrl: "", videoUrl: "" },
    ],
    onlineClasses: [
      { id: "oc_1", subject: "اللغة الإنجليزية", time: "10:00 ص - 10:30 ص", link: "https://meet.google.com/", live: true },
      { id: "oc_2", subject: "الرياضيات", time: "11:00 ص - 11:30 ص", link: "https://meet.google.com/", live: false },
    ],
    attendance: {
      "2026-06-07": "حاضر", "2026-06-08": "حاضر", "2026-06-09": "غائب",
      "2026-06-10": "حاضر", "2026-06-11": "حاضر",
    },
    dailyReports: [
      { date: "2026-06-07", behavior: 5, participation: 4, focus: 4, activities: 5, notes: "اليوم شارك بلال بشكل ممتاز في نشاط الألوان وأظهر تفاعلًا جيدًا مع زملائه." },
    ],
    grades: { English: 85, Math: 90, Arabic: 88, Science: 92 },
    exams: [
      { subject: "اللغة الإنجليزية", date: "15 يونيو", grade: "18/20", note: "أداء ممتاز ومشاركة فعالة" },
      { subject: "الرياضيات", date: "18 يونيو", grade: "19/20", note: "إتقان كامل لمهارات العد" },
    ],
    messages: [
      { from: "المعلمة سارة", text: "تذكير: غدًا يوم الزي الرياضي 🏃‍♂️", time: "10:32 ص", sender: "teacher" },
      { from: "ولي الأمر", text: "تمام، شكرًا على التذكير 🙏", time: "10:35 ص", sender: "parent" },
      { from: "إدارة المدرسة", text: "نرجو سداد الرسوم قبل نهاية الشهر", time: "أمس", sender: "admin" },
    ],
  },
  std_002: {
    profile: {
      name: "لين خالد", grade: "KG2 — فصل 2", nationalId: "1yyyyyyyyy",
      birthDate: "05 / 09 / 2020", bloodType: "A+", contact: "0559876543", avatar: "ل",
      classId: null, status: "active", withdrawalReason: "", withdrawalDate: "",
      fees: { type: "monthly", amount: 1500, installments: [], paidMonths: [] },
    },
    homework: [],
    onlineClasses: [],
    attendance: {
      "2026-06-07": "حاضر", "2026-06-08": "حاضر", "2026-06-09": "حاضر",
      "2026-06-10": "حاضر", "2026-06-11": "غائب",
    },
    dailyReports: [
      { date: "2026-06-07", behavior: 5, participation: 5, focus: 5, activities: 4, notes: "لين كانت متعاونة جدًا ونشطة في حصة القراءة." },
    ],
    grades: { English: 90, Math: 87, Arabic: 95, Science: 89 },
    exams: [
      { subject: "اللغة العربية", date: "16 يونيو", grade: "20/20", note: "ممتاز" },
    ],
    messages: [
      { from: "المعلمة هند", text: "أحسنت لين اليوم في درس الحروف ⭐", time: "09:10 ص", sender: "teacher" },
    ],
  },
};

const DEFAULT_GALLERY = {
  g_1: { title: "نشاط الألوان", color: "green", studentId: null, images: [] },
  g_2: { title: "رحلة الحديقة", color: "blue", studentId: null, images: [] },
  g_3: { title: "احتفال نهاية الأسبوع", color: "orange", studentId: null, images: [] },
  g_4: { title: "مشروع الحروف", color: "purple", studentId: null, images: [] },
};

// ---------------------------------------------------------------------
// Seeding
// ---------------------------------------------------------------------

export async function seedIfEmpty() {
  if (!db) return false;
  const metaSnap = await getDoc(doc(db, "meta", "main"));
  if (metaSnap.exists()) return false;

  await setDoc(doc(db, "meta", "main"), DEFAULT_META);
  await Promise.all(
    Object.entries(DEFAULT_STUDENTS).map(([id, value]) => setDoc(doc(db, "students", id), value))
  );
  await Promise.all(
    Object.entries(DEFAULT_GALLERY).map(([id, value]) => setDoc(doc(db, "gallery", id), value))
  );
  return true;
}

// ---------------------------------------------------------------------
// Subscriptions (real-time)
// ---------------------------------------------------------------------

export function subscribeMeta(cb) {
  if (!db) return () => {};
  return onSnapshot(doc(db, "meta", "main"), (snap) => {
    cb(snap.exists() ? snap.data() : null);
  });
}

// Admin: subscribe to ALL students (used for overview, lists, and any
// per-student admin page since the selector can target any of them).
export function subscribeAllStudents(cb) {
  if (!db) return () => {};
  return onSnapshot(collection(db, "students"), (snap) => {
    const map = {};
    snap.forEach((d) => { map[d.id] = d.data(); });
    cb(map);
  });
}

// Parent: subscribe only to their own child's document.
export function subscribeStudent(studentId, cb) {
  if (!db) return () => {};
  return onSnapshot(doc(db, "students", studentId), (snap) => {
    cb({ [studentId]: snap.exists() ? snap.data() : null });
  });
}

export function subscribeGallery(cb) {
  if (!db) return () => {};
  return onSnapshot(collection(db, "gallery"), (snap) => {
    const arr = [];
    snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
    cb(arr);
  });
}

// ---------------------------------------------------------------------
// Assembling the unified "data" object the UI components expect
// (same shape as the old localStorage version, so page components do
// not need to change).
// ---------------------------------------------------------------------

export function assembleData(meta, studentsMap, galleryArr) {
  const students = [];
  const homework = [];
  const onlineClasses = [];
  const attendance = {};
  const dailyReports = {};
  const grades = {};
  const exams = {};
  const messages = {};

  Object.entries(studentsMap || {}).forEach(([id, d]) => {
    if (!d) return;
    students.push({ id, ...(d.profile || {}) });
    (d.homework || []).forEach((h) => homework.push({ ...h, studentId: id }));
    (d.onlineClasses || []).forEach((c) => onlineClasses.push({ ...c, studentId: id }));
    attendance[id] = d.attendance || {};
    dailyReports[id] = d.dailyReports || [];
    grades[id] = d.grades || {};
    exams[id] = d.exams || [];
    messages[id] = d.messages || [];
  });

  return {
    settings: meta?.settings || { whatsappNumber: "" },
    classes: meta?.classes || [],
    teachers: meta?.teachers || [],
    announcements: meta?.announcements || [],
    schedule: meta?.schedule || {},
    users: meta?.users || { admin: {}, parents: [] },
    students,
    homework,
    onlineClasses,
    attendance,
    dailyReports,
    grades,
    exams,
    messages,
    gallery: (galleryArr || []).map((g) => ({ ...g })),
  };
}

// ---------------------------------------------------------------------
// Persisting changes back to Firestore.
//
// Components call updateData(updater) with the SAME pattern as before:
//   updateData((d) => { const next = structuredClone(d); ...mutate...; return next; })
//
// persistChanges() diffs `next` against `prev` (the previously assembled
// data) and writes only the documents that actually changed.
// ---------------------------------------------------------------------

function buildStudentDoc(data, id) {
  const s = (data.students || []).find((x) => x.id === id) || {};
  const { id: _drop, ...profile } = s;
  return {
    profile,
    homework: (data.homework || [])
      .filter((h) => h.studentId === id)
      .map(({ studentId, ...rest }) => rest),
    onlineClasses: (data.onlineClasses || [])
      .filter((c) => c.studentId === id)
      .map(({ studentId, ...rest }) => rest),
    attendance: data.attendance?.[id] || {},
    dailyReports: data.dailyReports?.[id] || [],
    grades: data.grades?.[id] || {},
    exams: data.exams?.[id] || [],
    messages: data.messages?.[id] || [],
  };
}

export async function persistChanges(prev, next) {
  if (!db) return;
  const ops = [];

  // ---- meta (settings / users / announcements / schedule / classes) ----
  const metaKeys = ["settings", "users", "announcements", "schedule", "classes", "teachers"];
  const metaUpdate = {};
  let metaChanged = false;
  for (const k of metaKeys) {
    if (JSON.stringify(next[k]) !== JSON.stringify(prev[k])) {
      metaUpdate[k] = next[k];
      metaChanged = true;
    }
  }
  if (metaChanged) {
    ops.push(setDoc(doc(db, "meta", "main"), metaUpdate, { merge: true }));
  }

  // ---- students (added / updated / removed) ----
  const prevIds = new Set((prev.students || []).map((s) => s.id));
  const nextIds = new Set((next.students || []).map((s) => s.id));

  for (const id of prevIds) {
    if (!nextIds.has(id)) {
      ops.push(deleteDoc(doc(db, "students", id)));
    }
  }

  for (const s of next.students || []) {
    const nextDoc = buildStudentDoc(next, s.id);
    const prevDoc = prevIds.has(s.id) ? buildStudentDoc(prev, s.id) : null;
    if (!prevDoc || JSON.stringify(nextDoc) !== JSON.stringify(prevDoc)) {
      ops.push(setDoc(doc(db, "students", s.id), nextDoc));
    }
  }

  // ---- gallery (albums added / updated / removed) ----
  const prevGallery = prev.gallery || [];
  const nextGallery = next.gallery || [];
  const nextGIds = new Set(nextGallery.map((g) => g.id));

  for (const g of prevGallery) {
    if (!nextGIds.has(g.id)) {
      (g.images || []).forEach((img) => { if (img?.path) deleteStorageFile(img.path); });
      ops.push(deleteDoc(doc(db, "gallery", g.id)));
    }
  }

  for (const g of nextGallery) {
    const pg = prevGallery.find((p) => p.id === g.id);
    if (!pg || JSON.stringify(g) !== JSON.stringify(pg)) {
      if (pg) {
        const nextPaths = new Set((g.images || []).map((i) => i?.path));
        (pg.images || []).forEach((img) => {
          if (img?.path && !nextPaths.has(img.path)) deleteStorageFile(img.path);
        });
      }
      const { id, ...rest } = g;
      ops.push(setDoc(doc(db, "gallery", id), rest));
    }
  }

  await Promise.all(ops);
}

// ---------------------------------------------------------------------
// Cloudinary helpers (gallery photos)
// ---------------------------------------------------------------------

export async function uploadGalleryImage(albumId, file) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("إعدادات Cloudinary غير مكتملة. تحقق من ملف .env");
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", `gallery/${albumId}`);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "فشل رفع الصورة إلى Cloudinary");
  }
  const data = await res.json();
  return { url: data.secure_url, path: data.public_id };
}

export async function deleteStorageFile(path) {
  // Deleting from Cloudinary requires a signed request (API secret), which
  // can't be done safely from the browser with an unsigned preset. Removed
  // images simply stay in the Cloudinary Media Library (well within the
  // 25GB free tier) and can be deleted manually there if needed.
  if (path) console.info("Cloudinary asset kept in Media Library:", path);
}
