import React, { useState } from "react";
import {
  ClipboardCheck, LogOut, Users, BookOpen, FileText,
  BarChart3, GraduationCap, Menu, Image as ImageIcon,
  Bell, MessageCircle, Calendar, PieChart, Video,
} from "lucide-react";
import { COLORS, Card, CardTitle, Input, Select, PrimaryButton, Badge } from "./theme.jsx";

const PERM_PAGES = [
  { id: "attendance",        label: "تسجيل الحضور",          icon: ClipboardCheck },
  { id: "homework",          label: "الواجبات",                icon: BookOpen },
  { id: "reports",           label: "التقارير اليومية",        icon: FileText },
  { id: "grades",            label: "الدرجات",                 icon: BarChart3 },
  { id: "exams",             label: "الاختبارات",              icon: GraduationCap },
  { id: "students",          label: "الطلاب وأولياء الأمور",   icon: Users },
  { id: "attendanceReports", label: "تقارير الحضور",           icon: PieChart },
  { id: "gallery",           label: "الأنشطة والصور",          icon: ImageIcon },
  { id: "announcements",     label: "الإعلانات",               icon: Bell },
  { id: "messages",          label: "الرسائل",                 icon: MessageCircle },
  { id: "schedule",          label: "الجدول الدراسي",          icon: Calendar },
  { id: "onlineClasses",     label: "الحصص الإلكترونية",      icon: Video },
];

export default function TeacherDashboard({ data, updateData, session, onLogout }) {
  const perms = session.permissions || ["attendance", "students"];
  const allowedPages = PERM_PAGES.filter((p) => perms.includes(p.id));
  const [page, setPage] = useState(allowedPages[0]?.id || "students");
  const [mobileOpen, setMobileOpen] = useState(false);

  const classIds = session.classIds || [];
  const classes = (data.classes || []).filter((c) => classIds.includes(c.id));
  const myStudents = data.students.filter((s) => classIds.includes(s.classId) && s.status !== "withdrawn");

  const PageComp = {
    attendance:        TeacherAttendancePage,
    homework:          TeacherHomeworkPage,
    reports:           TeacherReportsPage,
    grades:            TeacherGradesPage,
    exams:             TeacherExamsPage,
    students:          TeacherStudentsPage,
    attendanceReports: TeacherAttendanceReportsPage,
    gallery:           TeacherGalleryPage,
    announcements:     TeacherAnnouncementsPage,
    messages:          TeacherMessagesPage,
    schedule:          TeacherSchedulePage,
    onlineClasses:     TeacherOnlineClassesPage,
  }[page];

  return (
    <div className="min-h-screen flex" dir="rtl" style={{ background: COLORS.bg }}>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className={`fixed md:sticky top-0 right-0 h-screen z-40 w-64 shrink-0 flex flex-col transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
        style={{ background: "linear-gradient(180deg,#3F1E63,#5B2A86)" }}
      >
        <div className="p-5 border-b border-white/10">
          <div className="font-extrabold text-white text-sm">🧑‍🏫 {session.teacherName}</div>
          <div className="text-xs text-white/60 mt-0.5">{classes.length} فصل | {myStudents.length} طالب</div>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {allowedPages.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setPage(id); setMobileOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition text-right w-full"
              style={{
                background: page === id ? "rgba(255,255,255,0.15)" : "transparent",
                color: page === id ? "white" : "rgba(255,255,255,0.65)",
              }}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={onLogout} className="flex items-center gap-2 text-sm font-bold w-full px-4 py-2 rounded-xl" style={{ color: "rgba(255,255,255,0.7)" }}>
            <LogOut size={16} /> تسجيل الخروج
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-xl" style={{ background: "white" }}>
            <Menu size={20} style={{ color: COLORS.purple }} />
          </button>
          <h1 className="font-extrabold text-lg" style={{ color: COLORS.text }}>
            {allowedPages.find((p) => p.id === page)?.label || ""}
          </h1>
          <div />
        </div>

        {PageComp ? (
          <PageComp data={data} updateData={updateData} myStudents={myStudents} classes={classes} />
        ) : (
          <Card><p className="text-center py-8" style={{ color: COLORS.sub }}>لا توجد صلاحيات متاحة. تواصل مع الأدمن.</p></Card>
        )}
      </main>
    </div>
  );
}

/* ─── Attendance ─── */
function TeacherAttendancePage({ data, updateData, myStudents, classes }) {
  const [classFilter, setClassFilter] = useState("all");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const filtered = classFilter === "all" ? myStudents : myStudents.filter((s) => s.classId === classFilter);

  function setStatus(studentId, status) {
    updateData((d) => {
      const next = structuredClone(d);
      if (!next.attendance[studentId]) next.attendance[studentId] = {};
      next.attendance[studentId][date] = status;
      return next;
    });
  }

  function getStatus(studentId) {
    return data.attendance?.[studentId]?.[date] || null;
  }

  const present = filtered.filter((s) => getStatus(s.id) === "حاضر").length;
  const absent  = filtered.filter((s) => getStatus(s.id) === "غائب").length;
  const pending = filtered.length - present - absent;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle icon={ClipboardCheck}>تسجيل الحضور والغياب</CardTitle>
        <div className="grid sm:grid-cols-2 gap-x-4 mb-4">
          <Input label="التاريخ" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Select label="الفصل" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="all">كل فصولي</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <div className="flex gap-4 mb-4 text-xs font-extrabold">
          <span style={{ color: COLORS.green }}>✅ حاضر: {present}</span>
          <span style={{ color: COLORS.red }}>❌ غائب: {absent}</span>
          <span style={{ color: COLORS.sub }}>⬜ لم يُسجَّل: {pending}</span>
        </div>
        {filtered.length === 0 && <p className="text-sm text-center py-4" style={{ color: COLORS.sub }}>لا يوجد طلاب.</p>}
        <div className="flex flex-col gap-2">
          {filtered.map((s) => {
            const status = getStatus(s.id);
            return (
              <div key={s.id} className="flex items-center justify-between flex-wrap gap-3 rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
                <div>
                  <div className="font-extrabold text-sm" style={{ color: COLORS.text }}>{s.name}</div>
                  <div className="text-xs" style={{ color: COLORS.sub }}>{s.grade}</div>
                </div>
                <div className="flex gap-2">
                  {["حاضر", "غائب"].map((opt) => (
                    <button key={opt} onClick={() => setStatus(s.id, opt)}
                      className="px-4 py-2 rounded-xl text-xs font-extrabold border-2 transition"
                      style={{
                        background: status === opt ? (opt === "حاضر" ? COLORS.greenBg : COLORS.redBg) : "white",
                        color: status === opt ? (opt === "حاضر" ? COLORS.green : COLORS.red) : COLORS.sub,
                        borderColor: status === opt ? (opt === "حاضر" ? COLORS.green : COLORS.red) : "#E5E7EB",
                      }}
                    >
                      {opt === "حاضر" ? "✅ حاضر" : "❌ غائب"}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ─── Homework ─── */
function TeacherHomeworkPage({ data, updateData, myStudents }) {
  const studentIds = new Set(myStudents.map((s) => s.id));
  const hw = (data.homework || []).filter((h) => studentIds.has(h.studentId));
  const [form, setForm] = useState({ studentId: myStudents[0]?.id || "", subject: "", title: "", due: "", fileUrl: "", videoUrl: "" });

  function addHw(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.studentId) return;
    updateData((d) => {
      const next = structuredClone(d);
      next.homework.push({ ...form, id: "hw_" + Date.now(), status: "جديد" });
      return next;
    });
    setForm((f) => ({ ...f, subject: "", title: "", due: "", fileUrl: "", videoUrl: "" }));
  }

  function removeHw(id) {
    updateData((d) => {
      const next = structuredClone(d);
      next.homework = next.homework.filter((h) => h.id !== id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle icon={BookOpen}>إضافة واجب</CardTitle>
        <form onSubmit={addHw} className="grid sm:grid-cols-2 gap-x-4 items-end">
          <Select label="الطالب" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
            {myStudents.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Input label="المادة" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <Input label="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="موعد التسليم" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
          <div className="sm:col-span-2"><PrimaryButton type="submit">إضافة الواجب</PrimaryButton></div>
        </form>
      </Card>
      <Card>
        <CardTitle icon={BookOpen}>الواجبات ({hw.length})</CardTitle>
        {hw.length === 0 && <p className="text-sm" style={{ color: COLORS.sub }}>لا توجد واجبات.</p>}
        <div className="flex flex-col gap-2">
          {hw.map((h) => {
            const student = myStudents.find((s) => s.id === h.studentId);
            return (
              <div key={h.id} className="flex items-center justify-between flex-wrap gap-2 rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
                <div>
                  <div className="font-bold text-sm" style={{ color: COLORS.text }}>{h.title}</div>
                  <div className="text-xs" style={{ color: COLORS.sub }}>{student?.name} | {h.subject} | {h.due}</div>
                </div>
                <button onClick={() => removeHw(h.id)} className="text-xs px-2 py-1 rounded-lg" style={{ background: COLORS.redBg, color: COLORS.red }}>حذف</button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ─── Daily Reports ─── */
function TeacherReportsPage({ data, updateData, myStudents }) {
  const [studentId, setStudentId] = useState(myStudents[0]?.id || "");
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), behavior: 5, participation: 5, focus: 5, activities: 5, notes: "" });

  function save(e) {
    e.preventDefault();
    if (!studentId) return;
    updateData((d) => {
      const next = structuredClone(d);
      if (!next.dailyReports[studentId]) next.dailyReports[studentId] = [];
      next.dailyReports[studentId] = next.dailyReports[studentId].filter((r) => r.date !== form.date);
      next.dailyReports[studentId].unshift({ ...form, behavior: +form.behavior, participation: +form.participation, focus: +form.focus, activities: +form.activities });
      return next;
    });
  }

  const reports = (data.dailyReports?.[studentId] || []).slice(0, 5);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle icon={FileText}>تقرير يومي</CardTitle>
        <form onSubmit={save} className="grid sm:grid-cols-2 gap-x-4 items-end">
          <Select label="الطالب" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            {myStudents.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Input label="التاريخ" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          {["behavior", "participation", "focus", "activities"].map((k) => (
            <div key={k}>
              <div className="text-xs font-bold mb-1" style={{ color: COLORS.text }}>
                {{ behavior: "السلوك", participation: "المشاركة", focus: "التركيز", activities: "الأنشطة" }[k]} ({form[k]}/5)
              </div>
              <input type="range" min="1" max="5" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="w-full" />
            </div>
          ))}
          <div className="sm:col-span-2">
            <Input label="ملاحظات" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="sm:col-span-2"><PrimaryButton type="submit">حفظ التقرير</PrimaryButton></div>
        </form>
      </Card>
      {reports.length > 0 && (
        <Card>
          <CardTitle icon={FileText}>آخر التقارير</CardTitle>
          <div className="flex flex-col gap-2">
            {reports.map((r) => (
              <div key={r.date} className="rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
                <div className="font-bold text-xs mb-1" style={{ color: COLORS.purple }}>{r.date}</div>
                <div className="flex gap-3 text-xs flex-wrap" style={{ color: COLORS.sub }}>
                  <span>السلوك: {r.behavior}/5</span>
                  <span>المشاركة: {r.participation}/5</span>
                  <span>التركيز: {r.focus}/5</span>
                </div>
                {r.notes && <div className="text-xs mt-1" style={{ color: COLORS.text }}>{r.notes}</div>}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ─── Grades ─── */
function TeacherGradesPage({ data, updateData, myStudents }) {
  const [studentId, setStudentId] = useState(myStudents[0]?.id || "");
  const grades = data.grades?.[studentId] || {};

  function updateGrade(subject, val) {
    updateData((d) => {
      const next = structuredClone(d);
      if (!next.grades[studentId]) next.grades[studentId] = {};
      next.grades[studentId][subject] = +val;
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle icon={BarChart3}>الدرجات</CardTitle>
        <Select label="الطالب" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          {myStudents.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          {Object.entries(grades).map(([subject, grade]) => (
            <div key={subject} className="rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
              <div className="text-xs font-bold mb-2" style={{ color: COLORS.sub }}>{subject}</div>
              <input
                type="number" min="0" max="100" value={grade}
                onChange={(e) => updateGrade(subject, e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm font-extrabold outline-none"
                style={{ borderColor: "#E5E7EB", color: COLORS.purple }}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── Exams ─── */
function TeacherExamsPage({ data, updateData, myStudents }) {
  const [studentId, setStudentId] = useState(myStudents[0]?.id || "");
  const [form, setForm] = useState({ subject: "", date: "", grade: "", note: "" });
  const exams = data.exams?.[studentId] || [];

  function addExam(e) {
    e.preventDefault();
    if (!form.subject.trim()) return;
    updateData((d) => {
      const next = structuredClone(d);
      if (!next.exams[studentId]) next.exams[studentId] = [];
      next.exams[studentId].unshift({ ...form, id: "ex_" + Date.now() });
      return next;
    });
    setForm({ subject: "", date: "", grade: "", note: "" });
  }

  function removeExam(id) {
    updateData((d) => {
      const next = structuredClone(d);
      next.exams[studentId] = (next.exams[studentId] || []).filter((x) => x.id !== id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle icon={GraduationCap}>إضافة اختبار</CardTitle>
        <Select label="الطالب" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          {myStudents.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
        <form onSubmit={addExam} className="grid sm:grid-cols-2 gap-x-4 mt-3 items-end">
          <Input label="المادة" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          <Input label="التاريخ" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input label="الدرجة" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="مثال: 18/20" />
          <Input label="ملاحظة" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <div className="sm:col-span-2"><PrimaryButton type="submit">إضافة الاختبار</PrimaryButton></div>
        </form>
      </Card>
      <Card>
        <CardTitle icon={GraduationCap}>الاختبارات ({exams.length})</CardTitle>
        {exams.length === 0 && <p className="text-sm" style={{ color: COLORS.sub }}>لا توجد اختبارات.</p>}
        <div className="flex flex-col gap-2">
          {exams.map((ex, i) => (
            <div key={ex.id || i} className="flex items-center justify-between flex-wrap gap-2 rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
              <div>
                <div className="font-bold text-sm" style={{ color: COLORS.text }}>{ex.subject} — {ex.grade}</div>
                <div className="text-xs" style={{ color: COLORS.sub }}>{ex.date} {ex.note && `| ${ex.note}`}</div>
              </div>
              <button onClick={() => removeExam(ex.id)} className="text-xs px-2 py-1 rounded-lg" style={{ background: COLORS.redBg, color: COLORS.red }}>حذف</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── Students list ─── */
function TeacherStudentsPage({ data, myStudents, classes }) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle icon={Users}>طلابي ({myStudents.length} طالب/ة)</CardTitle>
        {myStudents.length === 0 && <p className="text-sm text-center py-6" style={{ color: COLORS.sub }}>لا يوجد طلاب في فصولك.</p>}
        {classes.map((cls) => {
          const clsStudents = myStudents.filter((s) => s.classId === cls.id);
          if (clsStudents.length === 0) return null;
          return (
            <div key={cls.id} className="mb-4">
              <div className="font-extrabold text-sm mb-2 flex items-center gap-2" style={{ color: COLORS.purple }}>
                {cls.name}
                <Badge color={cls.period === "evening" ? COLORS.purple : COLORS.blue} bg={cls.period === "evening" ? "#F3E8FF" : COLORS.blueBg}>
                  {cls.period === "evening" ? "🌙 مسائي" : "☀️ صباحي"}
                </Badge>
              </div>
              <div className="flex flex-col gap-2">
                {clsStudents.map((s) => {
                  const records = Object.values(data.attendance?.[s.id] || {});
                  const present = records.filter((v) => v === "حاضر").length;
                  const absent  = records.filter((v) => v === "غائب").length;
                  const pct = records.length > 0 ? Math.round((present / records.length) * 100) : 0;
                  return (
                    <div key={s.id} className="flex items-center justify-between flex-wrap gap-2 rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
                      <div>
                        <div className="font-bold text-sm" style={{ color: COLORS.text }}>{s.name}</div>
                        <div className="text-xs" style={{ color: COLORS.sub }}>📞 {s.contact}</div>
                      </div>
                      <div className="flex gap-3 text-xs font-extrabold">
                        <span style={{ color: COLORS.green }}>✅ {present}</span>
                        <span style={{ color: COLORS.red }}>❌ {absent}</span>
                        <span style={{ color: COLORS.purple }}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

/* ─── Attendance Reports (read-only filtered to teacher's classes) ─── */
function TeacherAttendanceReportsPage({ data, myStudents, classes }) {
  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
  const [from, setFrom] = useState(firstOfMonth);
  const [to, setTo] = useState(today);
  const [classFilter, setClassFilter] = useState("all");
  const filtered = classFilter === "all" ? myStudents : myStudents.filter((s) => s.classId === classFilter);

  let totalPresent = 0, totalAbsent = 0;
  const rows = filtered.map((s) => {
    const records = data.attendance?.[s.id] || {};
    let present = 0, absent = 0;
    Object.entries(records).forEach(([d, v]) => {
      if (d < from || d > to) return;
      if (v === "حاضر") present++; else absent++;
    });
    totalPresent += present; totalAbsent += absent;
    const pct = (present + absent) > 0 ? Math.round((present / (present + absent)) * 100) : 0;
    return { ...s, present, absent, pct };
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle icon={PieChart}>تقارير حضور فصولي</CardTitle>
        <div className="grid sm:grid-cols-3 gap-x-4 mb-4">
          <Select label="الفصل" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="all">كل فصولي</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Input label="من" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input label="إلى" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="flex gap-4 mb-4 text-xs font-extrabold">
          <span style={{ color: COLORS.green }}>✅ إجمالي حضور: {totalPresent}</span>
          <span style={{ color: COLORS.red }}>❌ إجمالي غياب: {totalAbsent}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" dir="rtl">
            <thead><tr style={{ color: COLORS.sub }}>
              <th className="text-right py-2 font-bold">الطالب</th>
              <th className="text-center py-2 font-bold">حضور</th>
              <th className="text-center py-2 font-bold">غياب</th>
              <th className="text-center py-2 font-bold">النسبة</th>
            </tr></thead>
            <tbody>{rows.map((s) => (
              <tr key={s.id} style={{ borderTop: "1px solid #F0EEF7" }}>
                <td className="py-2 font-bold" style={{ color: COLORS.text }}>{s.name}</td>
                <td className="py-2 text-center" style={{ color: COLORS.green }}>{s.present}</td>
                <td className="py-2 text-center" style={{ color: COLORS.red }}>{s.absent}</td>
                <td className="py-2 text-center font-extrabold" style={{ color: COLORS.purple }}>{s.pct}%</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ─── Gallery (filtered to teacher's class students) ─── */
function TeacherGalleryPage({ data, updateData, myStudents }) {
  const gallery = data.gallery || [];
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle icon={ImageIcon}>الأنشطة والصور</CardTitle>
        {gallery.length === 0 && <p className="text-sm text-center py-6" style={{ color: COLORS.sub }}>لا توجد صور مضافة بعد.</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
          {gallery.map((img) => (
            <div key={img.id || img.url} className="rounded-xl overflow-hidden aspect-square bg-gray-100">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── Announcements ─── */
function TeacherAnnouncementsPage({ data, updateData }) {
  const announcements = data.announcements || [];
  const [form, setForm] = useState({ title: "", body: "", date: new Date().toISOString().slice(0, 10) });

  function addAnn(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    updateData((d) => {
      const next = structuredClone(d);
      next.announcements = [{ id: "ann_" + Date.now(), ...form }, ...(next.announcements || [])];
      return next;
    });
    setForm({ title: "", body: "", date: new Date().toISOString().slice(0, 10) });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle icon={Bell}>إضافة إعلان</CardTitle>
        <form onSubmit={addAnn} className="flex flex-col gap-3">
          <Input label="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="التاريخ" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <div>
            <div className="text-sm font-bold mb-1" style={{ color: COLORS.text }}>المحتوى</div>
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={3} className="w-full rounded-xl border px-4 py-3 text-sm outline-none resize-none" style={{ borderColor: "#E5E7EB" }} />
          </div>
          <PrimaryButton type="submit">نشر الإعلان</PrimaryButton>
        </form>
      </Card>
      <Card>
        <CardTitle icon={Bell}>الإعلانات ({announcements.length})</CardTitle>
        {announcements.length === 0 && <p className="text-sm" style={{ color: COLORS.sub }}>لا توجد إعلانات.</p>}
        <div className="flex flex-col gap-3">
          {announcements.map((a) => (
            <div key={a.id} className="rounded-xl p-4" style={{ background: "#F8F7FC" }}>
              <div className="font-extrabold text-sm" style={{ color: COLORS.text }}>{a.title}</div>
              <div className="text-xs mt-0.5 mb-2" style={{ color: COLORS.sub }}>{a.date}</div>
              {a.body && <div className="text-sm" style={{ color: COLORS.text }}>{a.body}</div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── Messages ─── */
function TeacherMessagesPage({ data, updateData, myStudents }) {
  const [studentId, setStudentId] = useState(myStudents[0]?.id || "");
  const [text, setText] = useState("");
  const msgs = (data.messages?.[studentId] || []);

  function send(e) {
    e.preventDefault();
    if (!text.trim() || !studentId) return;
    updateData((d) => {
      const next = structuredClone(d);
      if (!next.messages[studentId]) next.messages[studentId] = [];
      next.messages[studentId].unshift({ from: "إدارة المدرسة", text: text.trim(), time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }), sender: "admin" });
      return next;
    });
    setText("");
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle icon={MessageCircle}>الرسائل</CardTitle>
        <Select label="الطالب" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          {myStudents.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
        <div className="mt-4 flex flex-col gap-2 max-h-64 overflow-y-auto">
          {msgs.length === 0 && <p className="text-sm text-center py-4" style={{ color: COLORS.sub }}>لا توجد رسائل.</p>}
          {msgs.map((m, i) => (
            <div key={i} className={`rounded-xl px-4 py-3 text-sm max-w-xs ${m.sender === "admin" ? "mr-auto" : "ml-auto"}`}
              style={{ background: m.sender === "admin" ? "#F3E8FF" : "#F0FDF4", color: COLORS.text }}>
              <div className="font-bold text-xs mb-1" style={{ color: COLORS.sub }}>{m.from} · {m.time}</div>
              {m.text}
            </div>
          ))}
        </div>
        <form onSubmit={send} className="flex gap-2 mt-4">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب رسالتك..." className="flex-1 rounded-xl border px-4 py-2 text-sm outline-none" style={{ borderColor: "#E5E7EB" }} />
          <PrimaryButton type="submit">إرسال</PrimaryButton>
        </form>
      </Card>
    </div>
  );
}

/* ─── Schedule ─── */
function TeacherSchedulePage({ data }) {
  const schedule = data.schedule || {};
  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle icon={Calendar}>الجدول الدراسي</CardTitle>
        {Object.keys(schedule).length === 0 && <p className="text-sm text-center py-6" style={{ color: COLORS.sub }}>لم يُضَف جدول دراسي بعد.</p>}
        <div className="flex flex-col gap-3">
          {days.map((day) => {
            const periods = schedule[day];
            if (!periods) return null;
            return (
              <div key={day} className="rounded-xl p-3" style={{ background: "#F8F7FC" }}>
                <div className="font-extrabold text-sm mb-2" style={{ color: COLORS.purple }}>{day}</div>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(periods) ? periods : Object.values(periods)).map((p, i) => (
                    <Badge key={i} color={COLORS.purple} bg="#F3E8FF">{p}</Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ─── Online Classes ─── */
function TeacherOnlineClassesPage({ data, updateData, myStudents }) {
  const studentIds = new Set(myStudents.map((s) => s.id));
  const all = (data.onlineClasses || []).filter((c) => studentIds.has(c.studentId));
  const [form, setForm] = useState({ studentId: myStudents[0]?.id || "", subject: "", link: "", date: "", time: "" });

  function add(e) {
    e.preventDefault();
    if (!form.link.trim()) return;
    updateData((d) => {
      const next = structuredClone(d);
      next.onlineClasses = [{ ...form, id: "oc_" + Date.now() }, ...(next.onlineClasses || [])];
      return next;
    });
    setForm((f) => ({ ...f, subject: "", link: "", date: "", time: "" }));
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle icon={Video}>إضافة حصة إلكترونية</CardTitle>
        <form onSubmit={add} className="grid sm:grid-cols-2 gap-x-4 items-end">
          <Select label="الطالب" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
            {myStudents.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Input label="المادة" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <Input label="رابط الحصة" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} required />
          <Input label="التاريخ والوقت" type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <div className="sm:col-span-2"><PrimaryButton type="submit">إضافة الحصة</PrimaryButton></div>
        </form>
      </Card>
      <Card>
        <CardTitle icon={Video}>الحصص ({all.length})</CardTitle>
        {all.length === 0 && <p className="text-sm" style={{ color: COLORS.sub }}>لا توجد حصص.</p>}
        <div className="flex flex-col gap-2">
          {all.map((c, i) => {
            const student = myStudents.find((s) => s.id === c.studentId);
            return (
              <div key={c.id || i} className="rounded-xl px-4 py-3 flex items-center justify-between gap-2" style={{ background: "#F8F7FC" }}>
                <div>
                  <div className="font-bold text-sm" style={{ color: COLORS.text }}>{c.subject}</div>
                  <div className="text-xs" style={{ color: COLORS.sub }}>{student?.name} | {c.date}</div>
                </div>
                <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-xs font-extrabold px-3 py-1.5 rounded-lg" style={{ background: "#F3E8FF", color: COLORS.purple }}>دخول</a>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
