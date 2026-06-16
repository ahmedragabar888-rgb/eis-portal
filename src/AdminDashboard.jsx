import React, { useState, useEffect } from "react";
import {
  Home, Users, BookOpen, ClipboardCheck, FileText, BarChart3,
  Calendar, GraduationCap, Image as ImageIcon, MessageCircle, Bell,
  LogOut, ChevronLeft, Menu, Plus, Trash2, Key, Star, CheckCircle2, XCircle,
  Settings, Upload, Layers, PieChart, Printer, UserX, RotateCcw,
} from "lucide-react";
import { COLORS, Logo, Card, CardTitle, Input, Select, PrimaryButton, Badge } from "./theme.jsx";
import { uploadGalleryImage } from "./store.js";

const NAV_ITEMS = [
  { id: "overview", label: "نظرة عامة", icon: Home },
  { id: "students", label: "الطلاب وأولياء الأمور", icon: Users },
  { id: "classes", label: "إدارة الفصول", icon: Layers },
  { id: "teachers", label: "إدارة المعلمات", icon: GraduationCap },
  { id: "homework", label: "إدارة الواجبات", icon: BookOpen },
  { id: "attendance", label: "تسجيل الحضور والغياب", icon: ClipboardCheck },
  { id: "attendanceReports", label: "تقارير الحضور", icon: PieChart },
  { id: "reports", label: "التقارير اليومية", icon: FileText },
  { id: "grades", label: "الدرجات والمستوى", icon: BarChart3 },
  { id: "schedule", label: "الجدول الدراسي", icon: Calendar },
  { id: "exams", label: "الاختبارات", icon: GraduationCap },
  { id: "gallery", label: "الأنشطة والصور", icon: ImageIcon },
  { id: "announcements", label: "الإشعارات والإعلانات", icon: Bell },
  { id: "messages", label: "الرسائل", icon: MessageCircle },
  { id: "settings", label: "إعدادات المنصة", icon: Settings },
];

const TITLES = Object.fromEntries(NAV_ITEMS.map((i) => [i.id, i.label]));

function Sidebar({ active, setActive, onLogout, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setMobileOpen(false)} />}
      <aside
        className={`fixed md:sticky top-0 right-0 h-screen z-40 w-64 shrink-0 flex flex-col transition-transform duration-300 no-print
          ${mobileOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
        style={{ background: "linear-gradient(180deg,#3F1E63,#5B2A86)" }}
      >
        <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <Logo light />
        </div>
        <div className="px-5 py-3 text-xs" style={{ color: "#D8CCF2" }}>
          لوحة <span className="font-extrabold text-white">الإدارة</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setMobileOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition text-right"
                style={{ background: isActive ? "rgba(255,255,255,0.14)" : "transparent", color: isActive ? "white" : "#D8CCF2" }}
              >
                <Icon size={18} className="shrink-0" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronLeft size={16} />}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold w-full text-right text-[#D8CCF2] hover:bg-white/10 transition">
            <LogOut size={18} /> تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
}

function TopBar({ title, onMenu }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button onClick={onMenu} className="md:hidden p-2 rounded-lg bg-white shadow">
        <Menu size={18} style={{ color: COLORS.purple }} />
      </button>
      <h1 className="text-xl font-extrabold" style={{ color: COLORS.text }}>{title}</h1>
      <div className="hidden sm:flex items-center gap-2 bg-white rounded-full pl-4 pr-1 py-1 shadow">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: "linear-gradient(135deg,#A78BFA,#5B2A86)" }}>أ</div>
        <div className="text-xs font-bold" style={{ color: COLORS.text }}>إدارة المدرسة</div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: bg }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-extrabold" style={{ color: COLORS.text }}>{value}</div>
        <div className="text-xs" style={{ color: COLORS.sub }}>{label}</div>
      </div>
    </Card>
  );
}

// ---------------- PAGES ----------------

function OverviewPage({ data }) {
  const studentsCount = data.students.length;
  const homeworkCount = (data.homework || []).length;
  const totalAttendanceDays = Object.values(data.attendance).reduce((sum, m) => sum + Object.keys(m).length, 0);
  const announcementsCount = (data.announcements || []).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "linear-gradient(110deg,#5B2A86,#8B5CF6)" }}>
        <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
        <h2 className="text-xl font-extrabold mb-1 relative z-10">👋 أهلاً بك في لوحة إدارة Elite International Schools</h2>
        <p className="text-sm opacity-90 relative z-10">من هنا يمكنك إدارة الطلاب والواجبات والحضور والتقارير وكل بيانات المنصة.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="عدد الطلاب" value={studentsCount} color={COLORS.purple} bg="#F3E8FF" />
        <StatCard icon={BookOpen} label="الواجبات الحالية" value={homeworkCount} color={COLORS.green} bg={COLORS.greenBg} />
        <StatCard icon={ClipboardCheck} label="سجلات الحضور" value={totalAttendanceDays} color={COLORS.blue} bg={COLORS.blueBg} />
        <StatCard icon={Bell} label="الإعلانات النشطة" value={announcementsCount} color={COLORS.orange} bg={COLORS.orangeBg} />
      </div>
      <Card>
        <CardTitle icon={Users}>الطلاب المسجلون</CardTitle>
        <div className="flex flex-col gap-2">
          {data.students.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg,#A78BFA,#5B2A86)" }}>{s.avatar}</div>
                <div>
                  <div className="font-extrabold text-sm" style={{ color: COLORS.text }}>{s.name}</div>
                  <div className="text-xs" style={{ color: COLORS.sub }}>{s.grade}</div>
                </div>
              </div>
              <div className="text-xs" style={{ color: COLORS.sub }}>{s.contact}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StudentsPage({ data, updateData }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", classId: "", nationalId: "", birthDate: "", bloodType: "O+",
    contact: "", username: "", password: "",
    feesType: "monthly", feesAmount: "", installments: [{ date: "", amount: "", paid: false }],
  });
  const [resetTarget, setResetTarget] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [withdrawForm, setWithdrawForm] = useState({ date: new Date().toISOString().slice(0, 10), reason: "" });

  function addStudent(e) {
    e.preventDefault();
    if (!form.name || !form.contact || !form.username || !form.password) return;

    const id = "std_" + Date.now();
    updateData((d) => {
      const next = structuredClone(d);
      const cls = (next.classes || []).find((c) => c.id === form.classId);
      next.students.push({
        id, name: form.name, grade: cls ? cls.name : "غير محدد", nationalId: form.nationalId || "-",
        birthDate: form.birthDate || "-", bloodType: form.bloodType, contact: form.contact,
        avatar: form.name.trim()[0] || "؟",
        classId: form.classId || null, status: "active", withdrawalReason: "", withdrawalDate: "",
        fees: form.feesType === "monthly"
          ? { type: "monthly", amount: parseFloat(form.feesAmount) || 0, installments: [], paidMonths: [] }
          : { type: "installments", amount: 0, installments: form.installments.map((i) => ({ ...i, amount: parseFloat(i.amount) || 0, paid: i.paid || false })), paidMonths: [] },
      });
      next.users.parents.push({ username: form.username, password: form.password, role: "parent", studentId: id });
      next.attendance[id] = {};
      next.dailyReports[id] = [];
      next.grades[id] = { English: 0, Math: 0, Arabic: 0, Science: 0 };
      next.exams[id] = [];
      next.messages[id] = [];
      return next;
    });
    setForm({ name: "", classId: "", nationalId: "", birthDate: "", bloodType: "O+", contact: "", username: "", password: "", feesType: "monthly", feesAmount: "", installments: [{ date: "", amount: "", paid: false }] });
    setShowForm(false);
  }

  function removeStudent(id) {
    if (!confirm("هل أنت متأكد من حذف هذا الطالب وكل بياناته؟")) return;
    updateData((d) => {
      const next = structuredClone(d);
      next.students = next.students.filter((s) => s.id !== id);
      next.users.parents = next.users.parents.filter((p) => p.studentId !== id);
      delete next.attendance[id];
      delete next.dailyReports[id];
      delete next.grades[id];
      delete next.exams[id];
      delete next.messages[id];
      next.homework = next.homework.filter((h) => h.studentId !== id);
      next.onlineClasses = next.onlineClasses.filter((c) => c.studentId !== id);
      return next;
    });
  }

  function markWithdrawn(e) {
    e.preventDefault();
    if (!withdrawForm.reason.trim()) return;
    updateData((d) => {
      const next = structuredClone(d);
      const student = next.students.find((s) => s.id === withdrawTarget);
      if (student) {
        student.status = "withdrawn";
        student.withdrawalDate = withdrawForm.date;
        student.withdrawalReason = withdrawForm.reason.trim();
      }
      return next;
    });
    setWithdrawTarget(null);
    setWithdrawForm({ date: new Date().toISOString().slice(0, 10), reason: "" });
  }

  function reactivateStudent(id) {
    if (!confirm("هل تريد إعادة تنشيط هذا الطالب وإلغاء حالة الانسحاب؟")) return;
    updateData((d) => {
      const next = structuredClone(d);
      const student = next.students.find((s) => s.id === id);
      if (student) {
        student.status = "active";
        student.withdrawalDate = "";
        student.withdrawalReason = "";
      }
      return next;
    });
  }

  function resetPassword(e) {
    e.preventDefault();
    if (!newPassword) return;
    updateData((d) => {
      const next = structuredClone(d);
      const parent = next.users.parents.find((p) => p.studentId === resetTarget);
      if (parent) parent.password = newPassword;
      return next;
    });
    setResetTarget(null);
    setNewPassword("");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-extrabold text-lg" style={{ color: COLORS.text }}>الطلاب وأولياء الأمور</h2>
        <PrimaryButton onClick={() => setShowForm((v) => !v)}>
          <span className="flex items-center gap-2"><Plus size={16} /> إضافة طالب جديد</span>
        </PrimaryButton>
      </div>

      {showForm && (
        <Card>
          <CardTitle icon={Plus}>بيانات الطالب وحساب ولي الأمر</CardTitle>
          <form onSubmit={addStudent} className="grid sm:grid-cols-2 gap-x-4">
            <Input label="اسم الطالب" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Select label="الفصل" value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
              <option value="">بلا فصل (يمكن التعيين لاحقاً)</option>
              {(data.classes || []).map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.period === "evening" ? "مسائي" : "صباحي"})</option>
              ))}
            </Select>
            <Input label="رقم الهوية" value={form.nationalId} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} />
            <Input label="تاريخ الميلاد" placeholder="DD/MM/YYYY" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
            <Select label="فصيلة الدم" value={form.bloodType} onChange={(e) => setForm({ ...form, bloodType: e.target.value })}>
              {["O+","O-","A+","A-","B+","B-","AB+","AB-"].map((bt) => <option key={bt}>{bt}</option>)}
            </Select>
            <Input label="رقم تواصل ولي الأمر" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            <Input label="اسم مستخدم ولي الأمر (رقم الجوال)" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            <Input label="كلمة المرور" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />

            {/* Fees section */}
            <div className="sm:col-span-2">
              <div className="font-extrabold text-sm mb-3 mt-2 pb-2 border-b" style={{ color: COLORS.text, borderColor: "#F0EEF7" }}>💰 الرسوم الدراسية</div>
              <div className="grid sm:grid-cols-2 gap-x-4">
                <Select label="نوع الرسوم" value={form.feesType} onChange={(e) => setForm({ ...form, feesType: e.target.value })}>
                  <option value="monthly">شهري</option>
                  <option value="installments">دفعات</option>
                </Select>
                {form.feesType === "monthly" && (
                  <Input label="المبلغ الشهري (ريال)" type="number" value={form.feesAmount} onChange={(e) => setForm({ ...form, feesAmount: e.target.value })} placeholder="مثال: 1500" />
                )}
              </div>
              {form.feesType === "installments" && (
                <div className="mt-3 flex flex-col gap-3">
                  {form.installments.map((inst, idx) => (
                    <div key={idx} className="grid sm:grid-cols-3 gap-x-3 items-end rounded-xl p-3" style={{ background: "#F8F7FC" }}>
                      <Input label={`تاريخ الدفعة ${idx + 1}`} type="date" value={inst.date} onChange={(e) => {
                        const next = form.installments.map((x, i) => i === idx ? { ...x, date: e.target.value } : x);
                        setForm({ ...form, installments: next });
                      }} />
                      <Input label="المبلغ (ريال)" type="number" value={inst.amount} onChange={(e) => {
                        const next = form.installments.map((x, i) => i === idx ? { ...x, amount: e.target.value } : x);
                        setForm({ ...form, installments: next });
                      }} placeholder="مثال: 2000" />
                      <div className="flex gap-2">
                        <label className="flex items-center gap-1 text-xs font-bold" style={{ color: COLORS.text }}>
                          <input type="checkbox" checked={inst.paid} onChange={(e) => {
                            const next = form.installments.map((x, i) => i === idx ? { ...x, paid: e.target.checked } : x);
                            setForm({ ...form, installments: next });
                          }} /> مدفوعة
                        </label>
                        {form.installments.length > 1 && (
                          <button type="button" onClick={() => setForm({ ...form, installments: form.installments.filter((_, i) => i !== idx) })} className="text-xs font-bold px-2" style={{ color: COLORS.red }}>حذف</button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => setForm({ ...form, installments: [...form.installments, { date: "", amount: "", paid: false }] })} className="text-sm font-extrabold px-4 py-2 rounded-xl w-fit" style={{ background: "#F3E8FF", color: COLORS.purple }}>
                    + إضافة دفعة
                  </button>
                </div>
              )}
            </div>

            <div className="sm:col-span-2 flex gap-3">
              <PrimaryButton type="submit">حفظ الطالب</PrimaryButton>
              <button type="button" onClick={() => setShowForm(false)} className="text-sm font-bold px-5" style={{ color: COLORS.sub }}>إلغاء</button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="flex flex-col gap-3">
          {data.students.map((s) => {
            const parent = data.users.parents.find((p) => p.studentId === s.id);
            return (
              <div key={s.id} className="flex items-center justify-between flex-wrap gap-3 rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg,#A78BFA,#5B2A86)" }}>{s.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm" style={{ color: COLORS.text }}>{s.name}</span>
                      {s.status === "withdrawn" ? (
                        <Badge color={COLORS.red} bg={COLORS.redBg}>منسحب</Badge>
                      ) : (
                        <Badge color={COLORS.green} bg={COLORS.greenBg}>نشط</Badge>
                      )}
                    </div>
                    <div className="text-xs" style={{ color: COLORS.sub }}>{s.grade} — {s.contact}</div>
                    {parent && <div className="text-xs mt-0.5" style={{ color: COLORS.sub }}>اسم الدخول: <b dir="ltr">{parent.username}</b></div>}
                    {s.fees && (
                      <div className="text-xs mt-0.5" style={{ color: COLORS.purple }}>
                        💰 {s.fees.type === "monthly" ? `${s.fees.amount?.toLocaleString()} ريال/شهر` : `دفعات (${s.fees.installments?.length || 0})`}
                      </div>
                    )}
                    {s.status === "withdrawn" && (
                      <div className="text-xs mt-0.5" style={{ color: COLORS.red }}>
                        تاريخ الانسحاب: {s.withdrawalDate || "-"} | السبب: {s.withdrawalReason || "-"}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => setResetTarget(s.id)} className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg" style={{ background: "#F3F0FB", color: COLORS.purple }}>
                    <Key size={14} /> إعادة تعيين كلمة المرور
                  </button>
                  {s.status === "withdrawn" ? (
                    <button onClick={() => reactivateStudent(s.id)} className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg" style={{ background: COLORS.greenBg, color: COLORS.green }}>
                      <RotateCcw size={14} /> إلغاء الانسحاب
                    </button>
                  ) : (
                    <button onClick={() => { setWithdrawTarget(s.id); setWithdrawForm({ date: new Date().toISOString().slice(0, 10), reason: "" }); }} className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg" style={{ background: COLORS.orangeBg, color: COLORS.orange }}>
                      <UserX size={14} /> تسجيل انسحاب
                    </button>
                  )}
                  <button onClick={() => removeStudent(s.id)} className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg" style={{ background: COLORS.redBg, color: COLORS.red }}>
                    <Trash2 size={14} /> حذف
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {resetTarget && (
        <Card>
          <CardTitle icon={Key}>إعادة تعيين كلمة المرور</CardTitle>
          <form onSubmit={resetPassword} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <Input label="كلمة المرور الجديدة" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <PrimaryButton type="submit">حفظ</PrimaryButton>
            <button type="button" onClick={() => { setResetTarget(null); setNewPassword(""); }} className="text-sm font-bold px-3" style={{ color: COLORS.sub }}>إلغاء</button>
          </form>
        </Card>
      )}
      {withdrawTarget && (
        <Card>
          <CardTitle icon={UserX} color={COLORS.orange}>تسجيل انسحاب الطالب</CardTitle>
          <form onSubmit={markWithdrawn} className="grid sm:grid-cols-2 gap-x-4 items-end">
            <Input label="تاريخ الانسحاب" type="date" value={withdrawForm.date} onChange={(e) => setWithdrawForm({ ...withdrawForm, date: e.target.value })} required />
            <Input label="سبب الانسحاب" value={withdrawForm.reason} onChange={(e) => setWithdrawForm({ ...withdrawForm, reason: e.target.value })} placeholder="مثال: انتقال السكن" required />
            <div className="sm:col-span-2 flex gap-3">
              <PrimaryButton type="submit">تأكيد الانسحاب</PrimaryButton>
              <button type="button" onClick={() => setWithdrawTarget(null)} className="text-sm font-bold px-3" style={{ color: COLORS.sub }}>إلغاء</button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

function HomeworkAdminPage({ data, updateData }) {
  const [form, setForm] = useState({ studentId: data.students[0]?.id || "", subject: "", title: "", due: "", fileUrl: "", videoUrl: "" });

  function addHomework(e) {
    e.preventDefault();
    if (!form.studentId || !form.subject || !form.title) return;
    updateData((d) => {
      const next = structuredClone(d);
      next.homework.push({ id: "hw_" + Date.now(), studentId: form.studentId, subject: form.subject, title: form.title, due: form.due || "غير محدد", status: "جديد", fileUrl: form.fileUrl, videoUrl: form.videoUrl });
      return next;
    });
    setForm({ studentId: form.studentId, subject: "", title: "", due: "", fileUrl: "", videoUrl: "" });
  }

  function removeHomework(id) {
    updateData((d) => {
      const next = structuredClone(d);
      next.homework = next.homework.filter((h) => h.id !== id);
      return next;
    });
  }

  function toggleStatus(id) {
    updateData((d) => {
      const next = structuredClone(d);
      const hw = next.homework.find((h) => h.id === id);
      if (hw) hw.status = hw.status === "جديد" ? "مكتمل" : "جديد";
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardTitle icon={Plus}>إضافة واجب جديد</CardTitle>
        <form onSubmit={addHomework} className="grid sm:grid-cols-2 gap-x-4">
          <Select label="الطالب" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
            {data.students.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.grade}</option>)}
          </Select>
          <Input label="المادة" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="مثال: اللغة الإنجليزية" required />
          <Input label="عنوان الواجب" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثال: Letter A Worksheet" required />
          <Input label="موعد التسليم" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} placeholder="مثال: الخميس" />
          <Input label="رابط ملف PDF / صورة الواجب (اختياري)" value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="https://..." />
          <Input label="رابط فيديو الشرح (اختياري)" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://..." />
          <div className="sm:col-span-2">
            <PrimaryButton type="submit">إضافة الواجب</PrimaryButton>
          </div>
        </form>
      </Card>

      <Card>
        <CardTitle icon={BookOpen}>الواجبات الحالية</CardTitle>
        <div className="flex flex-col gap-2">
          {data.homework.length === 0 && <p className="text-sm" style={{ color: COLORS.sub }}>لا توجد واجبات.</p>}
          {data.homework.map((h) => {
            const student = data.students.find((s) => s.id === h.studentId);
            return (
              <div key={h.id} className="flex items-center justify-between flex-wrap gap-3 rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
                <div>
                  <div className="font-extrabold text-sm" style={{ color: COLORS.text }}>{h.subject} — {h.title}</div>
                  <div className="text-xs" style={{ color: COLORS.sub }}>الطالب: {student?.name || "—"} | التسليم: {h.due}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleStatus(h.id)}>
                    <Badge color={h.status === "جديد" ? COLORS.green : COLORS.purple} bg={h.status === "جديد" ? COLORS.greenBg : "#F3E8FF"}>{h.status}</Badge>
                  </button>
                  <button onClick={() => removeHomework(h.id)} className="p-2 rounded-lg" style={{ background: COLORS.redBg, color: COLORS.red }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function AttendanceAdminPage({ data, updateData }) {
  const classes = data.classes || [];
  const classMap = Object.fromEntries(classes.map((c) => [c.id, c]));
  const activeStudents = data.students.filter((s) => s.status !== "withdrawn");

  const [periodFilter, setPeriodFilter] = useState("all");
  const filteredStudents = activeStudents.filter((s) => {
    if (periodFilter === "all") return true;
    const cls = classMap[s.classId];
    return cls && cls.period === periodFilter;
  });

  const [studentId, setStudentId] = useState(filteredStudents[0]?.id || activeStudents[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("حاضر");

  useEffect(() => {
    if (!filteredStudents.find((s) => s.id === studentId)) {
      setStudentId(filteredStudents[0]?.id || "");
    }
  }, [periodFilter]);

  function record(e) {
    e.preventDefault();
    if (!studentId || !date) return;
    updateData((d) => {
      const next = structuredClone(d);
      if (!next.attendance[studentId]) next.attendance[studentId] = {};
      next.attendance[studentId][date] = status;
      return next;
    });
  }

  const records = Object.entries(data.attendance[studentId] || {}).sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardTitle icon={ClipboardCheck}>تسجيل حضور / غياب</CardTitle>
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { key: "all", label: "الكل" },
            { key: "morning", label: "☀️ صباحي" },
            { key: "evening", label: "🌙 مسائي" },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setPeriodFilter(t.key)}
              className="px-4 py-2 rounded-xl text-sm font-extrabold transition"
              style={{
                background: periodFilter === t.key ? "linear-gradient(90deg,#7C3AED,#5B2A86)" : "#F8F7FC",
                color: periodFilter === t.key ? "white" : COLORS.text,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <form onSubmit={record} className="grid sm:grid-cols-2 gap-x-4 items-end">
          <Select label="الطالب" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            {filteredStudents.length === 0 && <option value="">لا يوجد طلاب في هذه الفترة</option>}
            {filteredStudents.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.grade}</option>)}
          </Select>
          <Input label="التاريخ" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Select label="الحالة" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="حاضر">حاضر</option>
            <option value="غائب">غائب</option>
          </Select>
          <div>
            <PrimaryButton type="submit" className="w-full" disabled={!studentId}>حفظ السجل</PrimaryButton>
          </div>
        </form>
      </Card>

      <Card>
        <CardTitle icon={Calendar}>سجل الحضور لهذا الطالب</CardTitle>
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
          {records.length === 0 && <p className="text-sm" style={{ color: COLORS.sub }}>لا يوجد سجل بعد.</p>}
          {records.map(([d, s]) => (
            <div key={d} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
              <span className="font-bold text-sm" style={{ color: COLORS.text }}>{d}</span>
              {s === "حاضر" ? (
                <span className="flex items-center gap-1 text-sm font-bold" style={{ color: COLORS.green }}><CheckCircle2 size={16} /> حاضر</span>
              ) : (
                <span className="flex items-center gap-1 text-sm font-bold" style={{ color: COLORS.red }}><XCircle size={16} /> غائب</span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ReportsAdminPage({ data, updateData }) {
  const [studentId, setStudentId] = useState(data.students[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [behavior, setBehavior] = useState(5);
  const [participation, setParticipation] = useState(5);
  const [focus, setFocus] = useState(5);
  const [activities, setActivities] = useState(5);
  const [notes, setNotes] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!studentId) return;
    updateData((d) => {
      const next = structuredClone(d);
      if (!next.dailyReports[studentId]) next.dailyReports[studentId] = [];
      next.dailyReports[studentId].push({ date, behavior, participation, focus, activities, notes });
      return next;
    });
    setNotes("");
  }

  function StarSelect({ label, value, setValue }) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-bold mb-1.5" style={{ color: COLORS.text }}>{label}</label>
        <div className="flex gap-1">
          {[1,2,3,4,5].map((n) => (
            <button type="button" key={n} onClick={() => setValue(n)}>
              <Star size={22} fill={n <= value ? "#FBBF24" : "none"} color={n <= value ? "#FBBF24" : "#D1D5DB"} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardTitle icon={Plus}>إضافة تقرير يومي</CardTitle>
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-x-4">
          <Select label="الطالب" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            {data.students.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.grade}</option>)}
          </Select>
          <Input label="التاريخ" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <StarSelect label="السلوك" value={behavior} setValue={setBehavior} />
          <StarSelect label="المشاركة" value={participation} setValue={setParticipation} />
          <StarSelect label="التركيز" value={focus} setValue={setFocus} />
          <StarSelect label="الأنشطة" value={activities} setValue={setActivities} />
          <div className="sm:col-span-2 mb-4">
            <label className="block text-sm font-bold mb-1.5" style={{ color: COLORS.text }}>ملاحظات المعلمة</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ borderColor: "#E5E7EB" }} />
          </div>
          <div className="sm:col-span-2">
            <PrimaryButton type="submit">حفظ التقرير</PrimaryButton>
          </div>
        </form>
      </Card>

      <Card>
        <CardTitle icon={FileText}>آخر التقارير</CardTitle>
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
          {(data.dailyReports[studentId] || []).slice().reverse().map((r, i) => (
            <div key={i} className="rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
              <div className="font-extrabold text-sm mb-1" style={{ color: COLORS.text }}>{r.date}</div>
              <div className="text-xs" style={{ color: COLORS.sub }}>{r.notes}</div>
            </div>
          ))}
          {(data.dailyReports[studentId] || []).length === 0 && <p className="text-sm" style={{ color: COLORS.sub }}>لا توجد تقارير بعد.</p>}
        </div>
      </Card>
    </div>
  );
}

function GradesAdminPage({ data, updateData }) {
  const [studentId, setStudentId] = useState(data.students[0]?.id || "");
  const grades = data.grades[studentId] || {};

  function update(subject, value) {
    updateData((d) => {
      const next = structuredClone(d);
      if (!next.grades[studentId]) next.grades[studentId] = {};
      next.grades[studentId][subject] = Number(value);
      return next;
    });
  }

  return (
    <Card>
      <CardTitle icon={BarChart3}>تحديث المستوى التعليمي</CardTitle>
      <Select label="الطالب" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
        {data.students.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.grade}</option>)}
      </Select>
      <div className="grid sm:grid-cols-2 gap-4 mt-2">
        {["English","Math","Arabic","Science"].map((subj) => (
          <div key={subj}>
            <label className="block text-sm font-bold mb-1.5" style={{ color: COLORS.text }}>{subj}</label>
            <input type="range" min="0" max="100" value={grades[subj] || 0} onChange={(e) => update(subj, e.target.value)} className="w-full" />
            <div className="text-sm font-extrabold mt-1" style={{ color: COLORS.purple }}>{grades[subj] || 0}%</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ScheduleAdminPage({ data, updateData }) {
  const schedule = data.schedule || {};
  const days = Object.keys(schedule);

  function update(day, periodIdx, value) {
    updateData((d) => {
      const next = structuredClone(d);
      next.schedule[day][periodIdx] = value;
      return next;
    });
  }

  return (
    <Card className="overflow-x-auto">
      <CardTitle icon={Calendar}>تعديل الجدول الدراسي الأسبوعي (مشترك لكل الطلاب)</CardTitle>
      <table className="w-full text-sm border-separate" style={{ borderSpacing: "0 8px" }}>
        <thead>
          <tr>
            <th className="text-right px-3 py-2 text-xs font-extrabold" style={{ color: COLORS.sub }}>اليوم</th>
            {schedule[days[0]]?.map((_, i) => <th key={i} className="px-3 py-2 text-xs font-extrabold" style={{ color: COLORS.sub }}>الحصة {i + 1}</th>)}
          </tr>
        </thead>
        <tbody>
          {days.map((d) => (
            <tr key={d} style={{ background: "#F8F7FC" }}>
              <td className="px-3 py-3 font-extrabold rounded-r-xl" style={{ color: COLORS.purple }}>{d}</td>
              {schedule[d].map((s, i) => (
                <td key={i} className="px-2 py-2">
                  <input value={s} onChange={(e) => update(d, i, e.target.value)} className="w-full text-center text-sm font-bold rounded-lg border px-2 py-1.5 outline-none" style={{ borderColor: "#E5E7EB", color: COLORS.text }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function ExamsAdminPage({ data, updateData }) {
  const [studentId, setStudentId] = useState(data.students[0]?.id || "");
  const [form, setForm] = useState({ subject: "", date: "", grade: "", note: "" });

  function add(e) {
    e.preventDefault();
    if (!form.subject) return;
    updateData((d) => {
      const next = structuredClone(d);
      if (!next.exams[studentId]) next.exams[studentId] = [];
      next.exams[studentId].push({ ...form });
      return next;
    });
    setForm({ subject: "", date: "", grade: "", note: "" });
  }

  function remove(idx) {
    updateData((d) => {
      const next = structuredClone(d);
      next.exams[studentId].splice(idx, 1);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardTitle icon={Plus}>إضافة نتيجة اختبار</CardTitle>
        <Select label="الطالب" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          {data.students.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.grade}</option>)}
        </Select>
        <form onSubmit={add} className="grid sm:grid-cols-2 gap-x-4 mt-2">
          <Input label="المادة" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          <Input label="تاريخ الاختبار" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="مثال: 15 يونيو" />
          <Input label="الدرجة" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="مثال: 18/20" />
          <Input label="ملاحظات" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <div className="sm:col-span-2">
            <PrimaryButton type="submit">إضافة</PrimaryButton>
          </div>
        </form>
      </Card>

      <Card>
        <CardTitle icon={GraduationCap}>الاختبارات المسجلة</CardTitle>
        <div className="flex flex-col gap-2">
          {(data.exams[studentId] || []).map((ex, i) => (
            <div key={i} className="flex items-center justify-between flex-wrap gap-2 rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
              <div>
                <div className="font-extrabold text-sm" style={{ color: COLORS.text }}>{ex.subject} — {ex.grade}</div>
                <div className="text-xs" style={{ color: COLORS.sub }}>{ex.date} | {ex.note}</div>
              </div>
              <button onClick={() => remove(i)} className="p-2 rounded-lg" style={{ background: COLORS.redBg, color: COLORS.red }}><Trash2 size={14} /></button>
            </div>
          ))}
          {(data.exams[studentId] || []).length === 0 && <p className="text-sm" style={{ color: COLORS.sub }}>لا توجد اختبارات.</p>}
        </div>
      </Card>
    </div>
  );
}

function GalleryAdminPage({ data, updateData }) {
  const [form, setForm] = useState({ title: "", color: "purple", studentId: "" });

  function add(e) {
    e.preventDefault();
    if (!form.title) return;
    updateData((d) => {
      const next = structuredClone(d);
      next.gallery.push({
        id: "g_" + Date.now(),
        title: form.title,
        color: form.color,
        studentId: form.studentId || null,
        images: [],
        count: 0,
      });
      return next;
    });
    setForm({ title: "", color: "purple", studentId: "" });
  }

  function remove(id) {
    updateData((d) => {
      const next = structuredClone(d);
      next.gallery = next.gallery.filter((g) => g.id !== id);
      return next;
    });
  }

  function removeImage(albumId, imgIdx) {
    updateData((d) => {
      const next = structuredClone(d);
      const album = next.gallery.find((g) => g.id === albumId);
      if (album) {
        album.images.splice(imgIdx, 1);
        album.count = album.images.length;
      }
      return next;
    });
  }

  function handleFiles(albumId, files) {
    Array.from(files).forEach(async (file) => {
      try {
        const img = await uploadGalleryImage(albumId, file);
        updateData((d) => {
          const next = structuredClone(d);
          const album = next.gallery.find((g) => g.id === albumId);
          if (album) {
            album.images = [...(album.images || []), img];
            album.count = album.images.length;
          }
          return next;
        });
      } catch (err) {
        console.error("Upload failed", err);
        alert("فشل رفع الصورة: " + err.message);
      }
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardTitle icon={Plus}>إضافة ألبوم أنشطة</CardTitle>
        <form onSubmit={add} className="grid sm:grid-cols-3 gap-x-4 items-end">
          <Input label="عنوان الألبوم" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Select label="مخصص لطالب (اختياري)" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
            <option value="">للجميع</option>
            {data.students.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.grade}</option>)}
          </Select>
          <Select label="اللون" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}>
            <option value="purple">بنفسجي</option>
            <option value="green">أخضر</option>
            <option value="blue">أزرق</option>
            <option value="orange">برتقالي</option>
          </Select>
          <div className="sm:col-span-3">
            <PrimaryButton type="submit">إضافة الألبوم</PrimaryButton>
          </div>
        </form>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.gallery.map((g) => {
          const owner = data.students.find((s) => s.id === g.studentId);
          return (
            <Card key={g.id} className="relative">
              <button onClick={() => remove(g.id)} className="absolute top-3 left-3 p-1.5 rounded-lg z-10" style={{ background: COLORS.redBg, color: COLORS.red }}><Trash2 size={14} /></button>
              <div className="text-center mb-3">
                <ImageIcon size={28} className="mx-auto mb-1" style={{ color: COLORS.purple }} />
                <h3 className="font-extrabold text-sm" style={{ color: COLORS.text }}>{g.title}</h3>
                <p className="text-xs" style={{ color: COLORS.sub }}>{owner ? owner.name : "للجميع"} · {g.images?.length || 0} صور</p>
              </div>

              {g.images && g.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {g.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img.url} alt="" className="w-full h-16 object-cover rounded-lg" />
                      <button onClick={() => removeImage(g.id, idx)} className="absolute -top-1.5 -left-1.5 p-1 rounded-full" style={{ background: COLORS.red, color: "white" }}>
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex items-center justify-center gap-2 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer" style={{ background: "#F3F0FB", color: COLORS.purple }}>
                <Upload size={14} /> رفع صور
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(g.id, e.target.files)} />
              </label>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function AnnouncementsAdminPage({ data, updateData }) {
  const [form, setForm] = useState({ title: "إعلان من المدرسة", desc: "", type: "orange" });

  function add(e) {
    e.preventDefault();
    if (!form.desc) return;
    updateData((d) => {
      const next = structuredClone(d);
      next.announcements.unshift({ id: "a_" + Date.now(), title: form.title, desc: form.desc, type: form.type });
      return next;
    });
    setForm({ title: "إعلان من المدرسة", desc: "", type: "orange" });
  }

  function remove(id) {
    updateData((d) => {
      const next = structuredClone(d);
      next.announcements = next.announcements.filter((a) => a.id !== id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardTitle icon={Plus}>إرسال إعلان جماعي</CardTitle>
        <form onSubmit={add} className="grid sm:grid-cols-2 gap-x-4">
          <Input label="عنوان الإشعار" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Select label="النوع" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="green">🟢 واجب جديد</option>
            <option value="blue">🔵 حصة أونلاين</option>
            <option value="orange">🟠 إعلان من المدرسة</option>
            <option value="red">🔴 غياب / ملاحظة هامة</option>
          </Select>
          <div className="sm:col-span-2 mb-4">
            <label className="block text-sm font-bold mb-1.5" style={{ color: COLORS.text }}>نص الإعلان</label>
            <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ borderColor: "#E5E7EB" }} required />
          </div>
          <div className="sm:col-span-2">
            <PrimaryButton type="submit">إرسال للجميع</PrimaryButton>
          </div>
        </form>
      </Card>

      <Card>
        <CardTitle icon={Bell}>الإعلانات الحالية</CardTitle>
        <div className="flex flex-col gap-2">
          {data.announcements.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-2 rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
              <div>
                <div className="font-extrabold text-sm" style={{ color: COLORS.text }}>{a.title}</div>
                <div className="text-xs" style={{ color: COLORS.sub }}>{a.desc}</div>
              </div>
              <button onClick={() => remove(a.id)} className="p-2 rounded-lg" style={{ background: COLORS.redBg, color: COLORS.red }}><Trash2 size={14} /></button>
            </div>
          ))}
          {data.announcements.length === 0 && <p className="text-sm" style={{ color: COLORS.sub }}>لا توجد إعلانات.</p>}
        </div>
      </Card>
    </div>
  );
}

function MessagesAdminPage({ data, updateData }) {
  const [studentId, setStudentId] = useState(data.students[0]?.id || "");
  const [text, setText] = useState("");
  const msgs = data.messages[studentId] || [];

  function send() {
    if (!text.trim()) return;
    updateData((d) => {
      const next = structuredClone(d);
      if (!next.messages[studentId]) next.messages[studentId] = [];
      next.messages[studentId].push({ from: "إدارة المدرسة", text: text.trim(), time: "الآن", sender: "admin" });
      return next;
    });
    setText("");
  }

  return (
    <Card className="flex flex-col" style={{ minHeight: 420 }}>
      <CardTitle icon={MessageCircle}>الرسائل مع أولياء الأمور</CardTitle>
      <Select label="اختر الطالب / ولي الأمر" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
        {data.students.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.grade}</option>)}
      </Select>
      <div className="flex-1 flex flex-col gap-3 mb-4 overflow-y-auto max-h-72">
        {msgs.map((m, i) => {
          const me = m.sender === "admin";
          return (
            <div key={i} className={`max-w-[80%] ${me ? "self-start" : "self-end"}`}>
              <div className="rounded-2xl px-4 py-2.5 text-sm" style={{ background: me ? "linear-gradient(90deg,#7C3AED,#5B2A86)" : "#F1EFF8", color: me ? "white" : COLORS.text }}>
                {!me && <div className="text-[11px] font-extrabold mb-0.5" style={{ color: COLORS.purple }}>{m.from}</div>}
                {m.text}
              </div>
              <div className="text-[10px] mt-1 px-1" style={{ color: COLORS.sub }}>{m.time}</div>
            </div>
          );
        })}
        {msgs.length === 0 && <p className="text-sm" style={{ color: COLORS.sub }}>لا توجد رسائل بعد.</p>}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="اكتب ردًا..." className="flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none" style={{ borderColor: "#E5E7EB" }} />
        <button onClick={send} className="px-5 rounded-xl font-bold text-white text-sm" style={{ background: "linear-gradient(90deg,#7C3AED,#5B2A86)" }}>إرسال</button>
      </div>
    </Card>
  );
}

function SettingsAdminPage({ data, updateData }) {
  const [whatsapp, setWhatsapp] = useState(data.settings?.whatsappNumber || "");
  const [saved, setSaved] = useState(false);

  function save(e) {
    e.preventDefault();
    updateData((d) => {
      const next = structuredClone(d);
      if (!next.settings) next.settings = {};
      next.settings.whatsappNumber = whatsapp.replace(/[^0-9]/g, "");
      return next;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const cleanNumber = whatsapp.replace(/[^0-9]/g, "");
  const testLink = cleanNumber ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent("رسالة تجريبية من لوحة الإدارة")}` : null;

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardTitle icon={Settings}>إعدادات التواصل عبر واتساب</CardTitle>
        <p className="text-sm mb-4" style={{ color: COLORS.sub }}>
          أدخل رقم واتساب الإدارة (مع رمز الدولة بدون + أو مسافات أو أصفار في البداية، مثال: <span dir="ltr" className="font-bold">966500000000</span>).
          سيظهر زر "تواصل عبر واتساب" في واجهة ولي الأمر ويفتح محادثة مباشرة مع هذا الرقم.
        </p>
        <form onSubmit={save} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[220px]">
            <Input
              label="رقم واتساب الإدارة"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="966500000000"
              dir="ltr"
              style={{ textAlign: "left" }}
            />
          </div>
          <PrimaryButton type="submit">حفظ</PrimaryButton>
        </form>
        {saved && (
          <div className="mt-3 text-sm font-bold rounded-lg px-3 py-2 inline-block" style={{ background: COLORS.greenBg, color: COLORS.green }}>
            ✅ تم الحفظ بنجاح
          </div>
        )}
      </Card>

      <Card>
        <CardTitle icon={MessageCircle} color="#25D366">التحقق من الربط</CardTitle>
        {data.settings?.whatsappNumber ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm" style={{ color: COLORS.text }}>
              الرقم المحفوظ حاليًا: <b dir="ltr">{data.settings.whatsappNumber}</b>
            </p>
            <a
              href={testLink || `https://wa.me/${data.settings.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold text-white text-sm w-fit"
              style={{ background: "#25D366" }}
            >
              اختبار فتح محادثة واتساب
            </a>
            <p className="text-xs" style={{ color: COLORS.sub }}>
              هذا نفس الزر العائم الذي سيظهر لولي الأمر في الزاوية السفلية من شاشته.
            </p>
          </div>
        ) : (
          <p className="text-sm" style={{ color: COLORS.sub }}>لم يتم إدخال رقم واتساب بعد. أدخل الرقم أعلاه واضغط حفظ.</p>
        )}
      </Card>
    </div>
  );
}

function ClassesAdminPage({ data, updateData }) {
  const classes = data.classes || [];
  const [form, setForm] = useState({ name: "", period: "morning" });

  function addClass(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    updateData((d) => {
      const next = structuredClone(d);
      if (!next.classes) next.classes = [];
      next.classes.push({ id: "cls_" + Date.now(), name: form.name.trim(), period: form.period });
      return next;
    });
    setForm({ name: "", period: "morning" });
  }

  function renameClass(id, name) {
    updateData((d) => {
      const next = structuredClone(d);
      const cls = (next.classes || []).find((c) => c.id === id);
      if (!cls) return next;
      cls.name = name;
      next.students.forEach((s) => { if (s.classId === id) s.grade = name; });
      return next;
    });
  }

  function setClassPeriod(id, period) {
    updateData((d) => {
      const next = structuredClone(d);
      const cls = (next.classes || []).find((c) => c.id === id);
      if (cls) cls.period = period;
      return next;
    });
  }

  function removeClass(id) {
    if (!confirm("هل أنت متأكد من حذف هذا الفصل؟ سيصبح الطلاب المسجلون فيه بلا فصل.")) return;
    updateData((d) => {
      const next = structuredClone(d);
      next.classes = (next.classes || []).filter((c) => c.id !== id);
      next.students.forEach((s) => { if (s.classId === id) { s.classId = null; s.grade = "غير محدد"; } });
      return next;
    });
  }

  function assignStudent(studentId, classId) {
    updateData((d) => {
      const next = structuredClone(d);
      const student = next.students.find((s) => s.id === studentId);
      if (!student) return next;
      student.classId = classId || null;
      const cls = (next.classes || []).find((c) => c.id === classId);
      student.grade = cls ? cls.name : "غير محدد";
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardTitle icon={Layers}>إضافة فصل جديد</CardTitle>
        <form onSubmit={addClass} className="grid sm:grid-cols-2 gap-x-4 items-end">
          <Input label="اسم الفصل" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: KG1 — فصل 1" required />
          <Select label="الفترة" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}>
            <option value="morning">☀️ صباحي</option>
            <option value="evening">🌙 مسائي</option>
          </Select>
          <div className="sm:col-span-2">
            <PrimaryButton type="submit">إضافة الفصل</PrimaryButton>
          </div>
        </form>
      </Card>

      <Card>
        <CardTitle icon={Layers}>الفصول الحالية</CardTitle>
        <div className="flex flex-col gap-3">
          {classes.length === 0 && <p className="text-sm" style={{ color: COLORS.sub }}>لا توجد فصول مضافة بعد. أضف فصلاً من الأعلى.</p>}
          {classes.map((c) => {
            const students = data.students.filter((s) => s.classId === c.id);
            return (
              <div key={c.id} className="rounded-xl p-4" style={{ background: "#F8F7FC" }}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                    <input
                      value={c.name}
                      onChange={(e) => renameClass(c.id, e.target.value)}
                      className="font-extrabold text-sm rounded-lg border px-3 py-1.5 outline-none focus:border-[#A78BFA] flex-1"
                      style={{ borderColor: "#E5E7EB", color: COLORS.text, background: "white" }}
                    />
                    <select
                      value={c.period}
                      onChange={(e) => setClassPeriod(c.id, e.target.value)}
                      className="text-xs font-extrabold rounded-full px-2.5 py-1.5 border outline-none"
                      style={{
                        borderColor: "#E5E7EB",
                        color: c.period === "evening" ? COLORS.purple : COLORS.blue,
                        background: c.period === "evening" ? "#F3E8FF" : COLORS.blueBg,
                      }}
                    >
                      <option value="morning">☀️ صباحي</option>
                      <option value="evening">🌙 مسائي</option>
                    </select>
                  </div>
                  <button onClick={() => removeClass(c.id)} className="p-2 rounded-lg" style={{ background: COLORS.redBg, color: COLORS.red }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="text-xs mb-2" style={{ color: COLORS.sub }}>{students.length} طالب/ة</div>
                {students.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {students.map((s) => <Badge key={s.id} color={COLORS.purple} bg="#F3E8FF">{s.name}</Badge>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardTitle icon={Users}>تعيين الطلاب للفصول</CardTitle>
        <div className="flex flex-col gap-2">
          {data.students.length === 0 && <p className="text-sm" style={{ color: COLORS.sub }}>لا يوجد طلاب مسجلون.</p>}
          {data.students.map((s) => (
            <div key={s.id} className="flex items-center justify-between flex-wrap gap-2 rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
              <div className="font-bold text-sm flex items-center gap-2" style={{ color: COLORS.text }}>
                {s.name}
                {s.status === "withdrawn" && <Badge color={COLORS.red} bg={COLORS.redBg}>منسحب</Badge>}
              </div>
              <select
                value={s.classId || ""}
                onChange={(e) => assignStudent(s.id, e.target.value)}
                className="rounded-xl border px-3 py-2 text-sm outline-none bg-white focus:border-[#A78BFA]"
                style={{ borderColor: "#E5E7EB" }}
              >
                <option value="">بلا فصل</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.period === "evening" ? "مسائي" : "صباحي"})</option>)}
              </select>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Bar({ label, value, total, color, bg }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-xs font-bold mb-1" style={{ color: COLORS.text }}>
        <span>{label}</span>
        <span>{value} ({pct}%)</span>
      </div>
      <div className="w-full h-2.5 rounded-full" style={{ background: "#EEE" }}>
        <div className="h-2.5 rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function AttendanceReportsPage({ data }) {
  const classes = data.classes || [];
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  const todayStr = today.toISOString().slice(0, 10);

  const [classFilter, setClassFilter] = useState("all");
  const [from, setFrom] = useState(firstOfMonth);
  const [to, setTo] = useState(todayStr);

  const scopedStudents = data.students.filter((s) => classFilter === "all" || s.classId === classFilter);
  const activeScoped = scopedStudents.filter((s) => s.status !== "withdrawn");
  const withdrawnScoped = scopedStudents.filter((s) => s.status === "withdrawn");

  function countsFor(studentId) {
    const records = data.attendance[studentId] || {};
    let present = 0, absent = 0;
    Object.entries(records).forEach(([d, v]) => {
      if (d < from || d > to) return;
      if (v === "حاضر") present++;
      else if (v === "غائب") absent++;
    });
    return { present, absent };
  }

  let totalPresent = 0, totalAbsent = 0;
  const rows = activeScoped.map((s) => {
    const { present, absent } = countsFor(s.id);
    totalPresent += present;
    totalAbsent += absent;
    const total = present + absent;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;
    return { ...s, present, absent, pct };
  });

  const className = classFilter === "all" ? "كل الفصول" : (classes.find((c) => c.id === classFilter)?.name || "—");
  const totalDays = totalPresent + totalAbsent;

  return (
    <div className="flex flex-col gap-5">
      <Card className="no-print">
        <CardTitle icon={PieChart}>تقارير الحضور والغياب والانسحاب</CardTitle>
        <div className="grid sm:grid-cols-3 gap-x-4 items-end">
          <Select label="الفصل" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="all">كل الفصول</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.period === "evening" ? "مسائي" : "صباحي"})</option>)}
          </Select>
          <Input label="من تاريخ" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input label="إلى تاريخ" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="mt-2">
          <PrimaryButton onClick={() => {
            const clsName = classFilter === "all" ? "كل الفصول" : (classes.find((c) => c.id === classFilter)?.name || "—");
            const rowsHtml = rows.map((s) => `
              <tr>
                <td>${s.name}</td>
                <td>${s.grade}</td>
                <td style="color:green;text-align:center">${s.present}</td>
                <td style="color:red;text-align:center">${s.absent}</td>
                <td style="text-align:center">${s.pct}%</td>
                <td style="text-align:center">${
                  s.fees?.type === "monthly"
                    ? `${s.fees.amount?.toLocaleString()} ريال/شهر`
                    : s.fees?.type === "installments"
                      ? s.fees.installments?.map((i, idx) => `دفعة ${idx+1}: ${Number(i.amount).toLocaleString()} ريال ${i.paid ? "✅" : "⏳"}`).join("<br/>")
                      : "—"
                }</td>
              </tr>`).join("");
            const withdrawnHtml = withdrawnScoped.length > 0 ? `
              <h3 style="margin-top:24px">الطلاب المنسحبون</h3>
              <table><thead><tr><th>الاسم</th><th>الفصل</th><th>تاريخ الانسحاب</th><th>السبب</th></tr></thead><tbody>
              ${withdrawnScoped.map((s) => `<tr><td>${s.name}</td><td>${s.grade}</td><td>${s.withdrawalDate||"-"}</td><td>${s.withdrawalReason||"-"}</td></tr>`).join("")}
              </tbody></table>` : "";
            const html = `<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"/>
              <style>
                body{font-family:Tajawal,Arial,sans-serif;padding:24px;direction:rtl}
                h1{font-size:20px;margin-bottom:4px}
                p{font-size:12px;color:#666;margin-bottom:16px}
                table{width:100%;border-collapse:collapse;font-size:13px}
                th{background:#F3E8FF;padding:8px;text-align:right;border:1px solid #ddd}
                td{padding:8px;border:1px solid #ddd}
                .summary{display:flex;gap:24px;margin-bottom:16px;font-size:13px}
                .summary b{font-size:18px;display:block}
                @media print{button{display:none}}
              </style>
              </head><body>
              <button onclick="window.print()" style="margin-bottom:16px;padding:8px 20px;background:#7C3AED;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px">🖨️ طباعة</button>
              <h1>تقرير الحضور والغياب — ${clsName}</h1>
              <p>الفترة من ${from} إلى ${to} | إجمالي الطلاب النشطين: ${rows.length} | المنسحبون: ${withdrawnScoped.length}</p>
              <div class="summary">
                <div><b style="color:green">${totalPresent}</b>إجمالي أيام الحضور</div>
                <div><b style="color:red">${totalAbsent}</b>إجمالي أيام الغياب</div>
                <div><b>${totalDays > 0 ? Math.round((totalPresent/totalDays)*100) : 0}%</b>نسبة الحضور الكلية</div>
              </div>
              <table><thead><tr><th>الاسم</th><th>الفصل</th><th>حضور</th><th>غياب</th><th>النسبة</th><th>الرسوم</th></tr></thead>
              <tbody>${rowsHtml}</tbody></table>
              ${withdrawnHtml}
              </body></html>`;
            const win = window.open("", "_blank");
            if (win) { win.document.write(html); win.document.close(); }
          }}>
            <span className="flex items-center gap-2"><Printer size={16} /> طباعة التقرير</span>
          </PrimaryButton>
        </div>
      </Card>

      <Card>
        <div className="mb-4">
          <h2 className="font-extrabold text-lg" style={{ color: COLORS.text }}>تقرير الحضور — {className}</h2>
          <p className="text-xs" style={{ color: COLORS.sub }}>الفترة من {from} إلى {to}</p>
        </div>

        <CardTitle icon={BarChart3}>الملخص الإجمالي</CardTitle>
        <Bar label="إجمالي أيام الحضور" value={totalPresent} total={Math.max(totalDays, 1)} color={COLORS.green} />
        <Bar label="إجمالي أيام الغياب" value={totalAbsent} total={Math.max(totalDays, 1)} color={COLORS.red} />
        <div className="flex items-center justify-between text-xs font-bold mt-3 mb-1" style={{ color: COLORS.text }}>
          <span>عدد الطلاب المنسحبين</span>
          <span>{withdrawnScoped.length}</span>
        </div>
      </Card>

      <Card>
        <CardTitle icon={ClipboardCheck}>تفاصيل الحضور لكل طالب</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" dir="rtl">
            <thead>
              <tr style={{ color: COLORS.sub }}>
                <th className="text-right py-2 font-bold">الطالب</th>
                <th className="text-right py-2 font-bold">الفصل</th>
                <th className="text-center py-2 font-bold">أيام الحضور</th>
                <th className="text-center py-2 font-bold">أيام الغياب</th>
                <th className="text-center py-2 font-bold">نسبة الحضور</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={5} className="text-center py-4" style={{ color: COLORS.sub }}>لا يوجد طلاب في هذا النطاق.</td></tr>
              )}
              {rows.map((s) => (
                <tr key={s.id} style={{ borderTop: "1px solid #F0EEF7" }}>
                  <td className="py-2 font-extrabold" style={{ color: COLORS.text }}>{s.name}</td>
                  <td className="py-2" style={{ color: COLORS.sub }}>{s.grade}</td>
                  <td className="py-2 text-center" style={{ color: COLORS.green }}>{s.present}</td>
                  <td className="py-2 text-center" style={{ color: COLORS.red }}>{s.absent}</td>
                  <td className="py-2 text-center font-extrabold" style={{ color: COLORS.text }}>{s.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {withdrawnScoped.length > 0 && (
        <Card>
          <CardTitle icon={UserX} color={COLORS.orange}>الطلاب المنسحبون</CardTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" dir="rtl">
              <thead>
                <tr style={{ color: COLORS.sub }}>
                  <th className="text-right py-2 font-bold">الطالب</th>
                  <th className="text-right py-2 font-bold">الفصل</th>
                  <th className="text-right py-2 font-bold">تاريخ الانسحاب</th>
                  <th className="text-right py-2 font-bold">السبب</th>
                </tr>
              </thead>
              <tbody>
                {withdrawnScoped.map((s) => (
                  <tr key={s.id} style={{ borderTop: "1px solid #F0EEF7" }}>
                    <td className="py-2 font-extrabold" style={{ color: COLORS.text }}>{s.name}</td>
                    <td className="py-2" style={{ color: COLORS.sub }}>{s.grade}</td>
                    <td className="py-2" style={{ color: COLORS.red }}>{s.withdrawalDate || "-"}</td>
                    <td className="py-2" style={{ color: COLORS.sub }}>{s.withdrawalReason || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

const ALL_PERMISSIONS = [
  { id: "attendance", label: "تسجيل الحضور والغياب", icon: "📋" },
  { id: "homework",   label: "إدارة الواجبات",        icon: "📚" },
  { id: "reports",    label: "التقارير اليومية",       icon: "📝" },
  { id: "grades",     label: "الدرجات",                icon: "⭐" },
  { id: "exams",      label: "الاختبارات",             icon: "📄" },
  { id: "students",   label: "عرض قائمة الطلاب",      icon: "👧" },
];

function TeachersAdminPage({ data, updateData }) {
  const teachers = data.teachers || [];
  const classes = data.classes || [];
  const defaultPerms = ALL_PERMISSIONS.map((p) => p.id);
  const [form, setForm] = useState({ name: "", username: "", password: "", classIds: [], permissions: defaultPerms });

  function toggleFormPerm(perm) {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter((p) => p !== perm)
        : [...f.permissions, perm],
    }));
  }

  function toggleFormClass(classId) {
    setForm((f) => ({
      ...f,
      classIds: f.classIds.includes(classId)
        ? f.classIds.filter((c) => c !== classId)
        : [...f.classIds, classId],
    }));
  }

  function addTeacher(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.username.trim() || !form.password.trim()) return;
    updateData((d) => {
      const next = structuredClone(d);
      if (!next.teachers) next.teachers = [];
      next.teachers.push({
        id: "tch_" + Date.now(),
        name: form.name.trim(),
        username: form.username.trim(),
        password: form.password,
        classIds: form.classIds,
        permissions: form.permissions,
      });
      return next;
    });
    setForm({ name: "", username: "", password: "", classIds: [], permissions: defaultPerms });
  }

  function removeTeacher(id) {
    if (!confirm("هل تريد حذف هذه المعلمة؟")) return;
    updateData((d) => {
      const next = structuredClone(d);
      next.teachers = (next.teachers || []).filter((t) => t.id !== id);
      return next;
    });
  }

  function toggleTeacherClass(teacherId, classId) {
    updateData((d) => {
      const next = structuredClone(d);
      const teacher = (next.teachers || []).find((t) => t.id === teacherId);
      if (!teacher) return next;
      teacher.classIds = teacher.classIds.includes(classId)
        ? teacher.classIds.filter((c) => c !== classId)
        : [...teacher.classIds, classId];
      return next;
    });
  }

  function toggleTeacherPerm(teacherId, perm) {
    updateData((d) => {
      const next = structuredClone(d);
      const teacher = (next.teachers || []).find((t) => t.id === teacherId);
      if (!teacher) return next;
      const perms = teacher.permissions || [];
      teacher.permissions = perms.includes(perm)
        ? perms.filter((p) => p !== perm)
        : [...perms, perm];
      return next;
    });
  }

  function resetTeacherPassword(teacherId, newPass) {
    if (!newPass.trim()) return;
    updateData((d) => {
      const next = structuredClone(d);
      const teacher = (next.teachers || []).find((t) => t.id === teacherId);
      if (teacher) teacher.password = newPass.trim();
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Add teacher form */}
      <Card>
        <CardTitle icon={GraduationCap}>إضافة معلمة جديدة</CardTitle>
        <form onSubmit={addTeacher} className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-3 gap-x-4">
            <Input label="اسم المعلمة" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="اسم المستخدم" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            <Input label="كلمة المرور" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>

          <div>
            <div className="text-sm font-bold mb-2" style={{ color: COLORS.text }}>الفصول المسموح بها</div>
            <div className="flex flex-wrap gap-2">
              {classes.length === 0 && <span className="text-xs" style={{ color: COLORS.sub }}>لا توجد فصول — أضف فصولاً أولاً من صفحة إدارة الفصول</span>}
              {classes.map((c) => (
                <label key={c.id} className="flex items-center gap-1 text-xs font-bold cursor-pointer px-3 py-1.5 rounded-full border transition" style={{ borderColor: form.classIds.includes(c.id) ? COLORS.purple : "#E5E7EB", background: form.classIds.includes(c.id) ? "#F3E8FF" : "white", color: form.classIds.includes(c.id) ? COLORS.purple : COLORS.sub }}>
                  <input type="checkbox" className="hidden" checked={form.classIds.includes(c.id)} onChange={() => toggleFormClass(c.id)} />
                  {form.classIds.includes(c.id) ? "✓ " : ""}{c.name} ({c.period === "evening" ? "م" : "ص"})
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold mb-2" style={{ color: COLORS.text }}>الصلاحيات</div>
            <div className="flex flex-wrap gap-2">
              {ALL_PERMISSIONS.map((p) => (
                <label key={p.id} className="flex items-center gap-1 text-xs font-bold cursor-pointer px-3 py-1.5 rounded-full border transition" style={{ borderColor: form.permissions.includes(p.id) ? COLORS.green : "#E5E7EB", background: form.permissions.includes(p.id) ? COLORS.greenBg : "white", color: form.permissions.includes(p.id) ? COLORS.green : COLORS.sub }}>
                  <input type="checkbox" className="hidden" checked={form.permissions.includes(p.id)} onChange={() => toggleFormPerm(p.id)} />
                  {p.icon} {p.label}
                </label>
              ))}
            </div>
          </div>

          <div><PrimaryButton type="submit">إضافة المعلمة</PrimaryButton></div>
        </form>
      </Card>

      {/* Teachers list */}
      <Card>
        <CardTitle icon={GraduationCap}>المعلمات الحاليات ({teachers.length})</CardTitle>
        {teachers.length === 0 && <p className="text-sm" style={{ color: COLORS.sub }}>لا توجد معلمات مضافة بعد.</p>}
        <div className="flex flex-col gap-4">
          {teachers.map((t) => (
            <div key={t.id} className="rounded-xl p-4 border" style={{ background: "#FDFCFF", borderColor: "#EDE8F7" }}>
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <div>
                  <div className="font-extrabold text-sm flex items-center gap-2" style={{ color: COLORS.text }}>
                    🧑‍🏫 {t.name}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: COLORS.sub }}>
                    اسم الدخول: <b dir="ltr">{t.username}</b>
                  </div>
                </div>
                <button onClick={() => removeTeacher(t.id)} className="p-2 rounded-lg" style={{ background: COLORS.redBg, color: COLORS.red }}>
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Classes */}
              <div className="mb-4">
                <div className="text-xs font-extrabold mb-2" style={{ color: COLORS.sub }}>📌 الفصول المسموح بها:</div>
                <div className="flex flex-wrap gap-2">
                  {classes.length === 0 && <span className="text-xs" style={{ color: COLORS.sub }}>لا توجد فصول</span>}
                  {classes.map((c) => (
                    <label key={c.id} className="flex items-center gap-1 text-xs font-bold cursor-pointer px-3 py-1.5 rounded-full border transition" style={{ borderColor: (t.classIds || []).includes(c.id) ? COLORS.purple : "#E5E7EB", background: (t.classIds || []).includes(c.id) ? "#F3E8FF" : "white", color: (t.classIds || []).includes(c.id) ? COLORS.purple : COLORS.sub }}>
                      <input type="checkbox" className="hidden" checked={(t.classIds || []).includes(c.id)} onChange={() => toggleTeacherClass(t.id, c.id)} />
                      {(t.classIds || []).includes(c.id) ? "✓ " : ""}{c.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div className="mb-4">
                <div className="text-xs font-extrabold mb-2" style={{ color: COLORS.sub }}>🔐 الصلاحيات:</div>
                <div className="flex flex-wrap gap-2">
                  {ALL_PERMISSIONS.map((p) => {
                    const has = (t.permissions || []).includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center gap-1 text-xs font-bold cursor-pointer px-3 py-1.5 rounded-full border transition" style={{ borderColor: has ? COLORS.green : "#E5E7EB", background: has ? COLORS.greenBg : "white", color: has ? COLORS.green : COLORS.sub }}>
                        <input type="checkbox" className="hidden" checked={has} onChange={() => toggleTeacherPerm(t.id, p.id)} />
                        {p.icon} {p.label}
                      </label>
                    );
                  })}
                </div>
              </div>

              <ResetPasswordInline onSave={(p) => resetTeacherPassword(t.id, p)} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ResetPasswordInline({ onSave }) {
  const [show, setShow] = useState(false);
  const [val, setVal] = useState("");
  if (!show) return (
    <button onClick={() => setShow(true)} className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: "#F3F0FB", color: COLORS.purple }}>
      <Key size={12} className="inline ml-1" /> تغيير كلمة المرور
    </button>
  );
  return (
    <div className="flex gap-2 items-center">
      <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="كلمة المرور الجديدة" className="rounded-xl border px-3 py-1.5 text-xs outline-none flex-1" style={{ borderColor: "#E5E7EB" }} />
      <button onClick={() => { onSave(val); setVal(""); setShow(false); }} className="text-xs font-bold px-3 py-1.5 rounded-lg text-white" style={{ background: COLORS.purple }}>حفظ</button>
      <button onClick={() => setShow(false)} className="text-xs px-2" style={{ color: COLORS.sub }}>إلغاء</button>
    </div>
  );
}

const PAGES = {
  overview: OverviewPage, students: StudentsPage, classes: ClassesAdminPage,
  teachers: TeachersAdminPage, homework: HomeworkAdminPage,
  attendance: AttendanceAdminPage, attendanceReports: AttendanceReportsPage, reports: ReportsAdminPage, grades: GradesAdminPage,
  schedule: ScheduleAdminPage, exams: ExamsAdminPage, gallery: GalleryAdminPage,
  announcements: AnnouncementsAdminPage, messages: MessagesAdminPage, settings: SettingsAdminPage,
};

export default function AdminDashboard({ data, updateData, onLogout }) {
  const [active, setActive] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const Page = PAGES[active];

  return (
    <div className="min-h-screen flex" dir="rtl" style={{ background: COLORS.bg }}>
      <Sidebar active={active} setActive={setActive} onLogout={onLogout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <div className="no-print">
          <TopBar title={TITLES[active]} onMenu={() => setMobileOpen(true)} />
        </div>
        <Page data={data} updateData={updateData} />
      </main>
    </div>
  );
}
