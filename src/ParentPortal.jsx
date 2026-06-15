import React, { useState } from "react";
import {
  Home, BookOpen, Calendar, Video, ClipboardCheck, BarChart3,
  Image as ImageIcon, MessageCircle, FileText, Bell,
  LogOut, ChevronLeft, Star, CheckCircle2, XCircle, Clock,
  GraduationCap, User, Download, Play, Menu, ExternalLink,
} from "lucide-react";
import { COLORS, Logo, Card, CardTitle, RingProgress } from "./theme.jsx";

const NAV_ITEMS = [
  { id: "home", label: "الرئيسية", icon: Home },
  { id: "homework", label: "الواجبات", icon: BookOpen },
  { id: "online", label: "الحصص الأونلاين", icon: Video },
  { id: "attendance", label: "الحضور والغياب", icon: ClipboardCheck },
  { id: "reports", label: "التقارير اليومية", icon: FileText },
  { id: "grades", label: "المستوى التعليمي", icon: BarChart3 },
  { id: "schedule", label: "الجدول الدراسي", icon: Calendar },
  { id: "exams", label: "الاختبارات", icon: GraduationCap },
  { id: "gallery", label: "الأنشطة والصور", icon: ImageIcon },
  { id: "messages", label: "الرسائل", icon: MessageCircle },
  { id: "profile", label: "ملف الطفل", icon: User },
];

const TITLES = Object.fromEntries(NAV_ITEMS.map((i) => [i.id, i.label]));

function Sidebar({ active, setActive, onLogout, mobileOpen, setMobileOpen, studentName }) {
  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setMobileOpen(false)} />}
      <aside
        className={`fixed md:sticky top-0 right-0 h-screen z-40 w-64 shrink-0 flex flex-col transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
        style={{ background: "linear-gradient(180deg,#3F1E63,#5B2A86)" }}
      >
        <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <Logo light />
        </div>
        <div className="px-5 py-3 text-xs" style={{ color: "#D8CCF2" }}>
          ولي أمر: <span className="font-extrabold text-white">{studentName}</span>
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

function TopBar({ title, onMenu, studentName }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button onClick={onMenu} className="md:hidden p-2 rounded-lg bg-white shadow">
        <Menu size={18} style={{ color: COLORS.purple }} />
      </button>
      <h1 className="text-xl font-extrabold" style={{ color: COLORS.text }}>{title}</h1>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-full bg-white shadow">
          <Bell size={18} style={{ color: COLORS.purple }} />
          <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center text-white font-bold" style={{ background: COLORS.red }}>3</span>
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-white rounded-full pl-4 pr-1 py-1 shadow">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: "linear-gradient(135deg,#A78BFA,#5B2A86)" }}>{studentName?.[0] || "؟"}</div>
          <div className="text-xs font-bold" style={{ color: COLORS.text }}>ولي أمر {studentName}</div>
        </div>
      </div>
    </div>
  );
}

function NotificationChip({ bg, text, title, desc }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: bg }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: text }} />
        <span className="text-sm font-extrabold" style={{ color: text }}>{title}</span>
      </div>
      <p className="text-xs" style={{ color: COLORS.sub }}>{desc}</p>
    </div>
  );
}

function Stat({ value, label, color }) {
  return (
    <div className="bg-[#F8F7FC] rounded-xl py-3">
      <div className="text-xl font-extrabold" style={{ color }}>{value}</div>
      <div className="text-[11px]" style={{ color: COLORS.sub }}>{label}</div>
    </div>
  );
}

function QuickLink({ icon: Icon, title, desc, color, onClick }) {
  return (
    <div onClick={onClick} className="rounded-xl p-4 flex flex-col items-end text-right gap-2 cursor-pointer hover:shadow-md transition" style={{ background: "#F8F7FC" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}1A` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="text-sm font-extrabold" style={{ color: COLORS.text }}>{title}</div>
      <div className="text-xs" style={{ color: COLORS.sub }}>{desc}</div>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, href }) {
  const content = (
    <span className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg transition hover:opacity-90" style={{ background: "#F3F0FB", color: COLORS.purple }}>
      <Icon size={14} /> {label}
    </span>
  );
  if (href) {
    return <a href={href} target="_blank" rel="noreferrer">{content}</a>;
  }
  return <button>{content}</button>;
}

// ---------------- PAGES ----------------

function HomePage({ student, data, setActive }) {
  const attendance = data.attendance[student.id] || {};
  const dates = Object.keys(attendance).sort();
  const total = dates.length;
  const present = dates.filter((d) => attendance[d] === "حاضر").length;
  const absent = total - present;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  const homework = (data.homework || []).filter((h) => h.studentId === student.id);
  const newHomework = homework.filter((h) => h.status === "جديد");

  const onlineClasses = (data.onlineClasses || []).filter((c) => c.studentId === student.id);
  const liveClass = onlineClasses.find((c) => c.live);

  const reports = data.dailyReports[student.id] || [];
  const latestReport = reports[reports.length - 1];

  const announcements = data.announcements || [];

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "linear-gradient(110deg,#5B2A86,#8B5CF6)" }}>
        <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -left-20 bottom-0 w-52 h-52 rounded-full bg-white/5" />
        <h2 className="text-xl font-extrabold mb-1 relative z-10">✨ أهلاً بك</h2>
        <p className="text-sm opacity-90 relative z-10">🏆 لوحتك الخاصة بـ {student.name} — {student.grade}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {newHomework[0] && (
          <NotificationChip bg={COLORS.greenBg} text={COLORS.green} title="واجب جديد"
            desc={`${newHomework[0].subject} — تسليم ${newHomework[0].due}`} />
        )}
        {liveClass && (
          <NotificationChip bg={COLORS.blueBg} text={COLORS.blue} title="حصة أونلاين"
            desc={`${liveClass.subject} — ${liveClass.time}`} />
        )}
        {announcements[0] && (
          <NotificationChip bg={COLORS.orangeBg} text={COLORS.orange} title="إعلان من المدرسة"
            desc={announcements[0].desc} />
        )}
        {absent > 0 ? (
          <NotificationChip bg={COLORS.redBg} text={COLORS.red} title="تنبيه غياب"
            desc={`تم تسجيل ${absent} يوم غياب`} />
        ) : (
          <NotificationChip bg={COLORS.redBg} text={COLORS.red} title="ملاحظة هامة"
            desc="يرجى مراجعة تقرير اليوم" />
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <CardTitle icon={Bell} color={COLORS.orange}>سجل الغياب</CardTitle>
          <div className="text-center mb-3">
            <div className="text-5xl font-extrabold" style={{ color: COLORS.purple }}>{absent}</div>
            <div className="text-sm" style={{ color: COLORS.sub }}>يوم غياب خلال الفصل الدراسي</div>
          </div>
          {absent === 0 ? (
            <div className="rounded-xl py-2 text-center text-sm font-bold mb-4" style={{ background: COLORS.greenBg, color: COLORS.green }}>
              ⭐ ما تغيبت أي يوم! استمر
            </div>
          ) : (
            <div className="rounded-xl py-2 text-center text-sm font-bold mb-4" style={{ background: COLORS.orangeBg, color: COLORS.orange }}>
              يرجى متابعة الحضور بانتظام
            </div>
          )}
          <div className="grid grid-cols-3 text-center gap-2">
            <Stat value={present} label="يوم حضور" color={COLORS.purple} />
            <Stat value={absent} label="يوم غياب" color={COLORS.red} />
            <Stat value={total} label="إجمالي الأيام" color={COLORS.blue} />
          </div>
        </Card>

        <Card>
          <CardTitle icon={BarChart3} color={COLORS.green}>نسبة الحضور الإجمالية</CardTitle>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-extrabold mb-1" style={{ color: COLORS.green }}>{pct}%</div>
              <div className="text-sm" style={{ color: COLORS.sub }}>نسبة حضورك خلال الفصل</div>
              <div className="text-xs mt-2 flex items-center gap-1 font-bold" style={{ color: COLORS.orange }}>
                <Star size={14} fill={COLORS.orange} /> {pct >= 90 ? "ممتاز" : pct >= 75 ? "جيد جدًا" : "بحاجة لتحسين"}
              </div>
            </div>
            <RingProgress percent={pct} color={COLORS.green} />
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle icon={Play} color={COLORS.purpleMid}>صالة المتابعة السريعة</CardTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickLink icon={BookOpen} title="الواجبات اليومية" desc={`${newHomework.length} واجبات بانتظارك`} color={COLORS.green} onClick={() => setActive("homework")} />
          <QuickLink icon={Video} title="الحصص الأونلاين" desc={liveClass ? `حصة الآن: ${liveClass.subject}` : "لا توجد حصة الآن"} color={COLORS.blue} onClick={() => setActive("online")} />
          <QuickLink icon={FileText} title="تقرير اليوم" desc={latestReport ? "تم رصد التقييم" : "لم يصدر بعد"} color={COLORS.purple} onClick={() => setActive("reports")} />
          <QuickLink icon={ImageIcon} title="أنشطة الأسبوع" desc={`${(data.gallery || []).length} ألبومات`} color={COLORS.orange} onClick={() => setActive("gallery")} />
        </div>
      </Card>
    </div>
  );
}

function HomeworkPage({ student, data }) {
  const items = (data.homework || []).filter((h) => h.studentId === student.id);
  if (items.length === 0) {
    return <Card><p className="text-sm" style={{ color: COLORS.sub }}>لا توجد واجبات حالياً.</p></Card>;
  }
  return (
    <div className="flex flex-col gap-4">
      {items.map((it) => (
        <Card key={it.id}>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full" style={{ background: it.status === "جديد" ? COLORS.greenBg : "#F3E8FF", color: it.status === "جديد" ? COLORS.green : COLORS.purple }}>
                {it.status === "جديد" ? "🟢 واجب جديد" : "✅ تم التسليم"}
              </span>
              <h3 className="font-extrabold mt-2" style={{ color: COLORS.text }}>{it.subject}</h3>
              <p className="text-sm" style={{ color: COLORS.sub }}>{it.title}</p>
            </div>
            <div className="text-left">
              <div className="text-xs" style={{ color: COLORS.sub }}>موعد التسليم</div>
              <div className="font-extrabold" style={{ color: COLORS.purple }}>{it.due}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {it.fileUrl && <ActionBtn icon={Download} label="ملف الواجب / PDF" href={it.fileUrl} />}
            {it.videoUrl && <ActionBtn icon={Play} label="فيديو الشرح" href={it.videoUrl} />}
            {!it.fileUrl && !it.videoUrl && (
              <span className="text-xs" style={{ color: COLORS.sub }}>لم يتم إرفاق ملفات لهذا الواجب بعد.</span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

function OnlinePage({ student, data }) {
  const classes = (data.onlineClasses || []).filter((c) => c.studentId === student.id);
  if (classes.length === 0) {
    return <Card><p className="text-sm" style={{ color: COLORS.sub }}>لا توجد حصص أونلاين مجدولة.</p></Card>;
  }
  return (
    <div className="flex flex-col gap-4">
      {classes.map((c) => (
        <Card key={c.id} className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: COLORS.blueBg }}>
              <Video size={22} style={{ color: COLORS.blue }} />
            </div>
            <div>
              <h3 className="font-extrabold" style={{ color: COLORS.text }}>{c.subject}</h3>
              <p className="text-sm flex items-center gap-1" style={{ color: COLORS.sub }}><Clock size={14} /> {c.time}</p>
            </div>
          </div>
          {c.live ? (
            <a href={c.link || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition" style={{ background: "linear-gradient(90deg,#7C3AED,#5B2A86)" }}>
              <Play size={16} /> دخول الحصة <ExternalLink size={14} />
            </a>
          ) : (
            <button disabled className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background: "#D1D5DB", cursor: "not-allowed" }}>
              <Play size={16} /> لم تبدأ بعد
            </button>
          )}
        </Card>
      ))}
    </div>
  );
}

function AttendancePage({ student, data }) {
  const attendance = data.attendance[student.id] || {};
  const dates = Object.keys(attendance).sort();
  const total = dates.length;
  const present = dates.filter((d) => attendance[d] === "حاضر").length;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <Card className="lg:col-span-1 flex flex-col items-center justify-center">
        <CardTitle icon={ClipboardCheck} color={COLORS.green}>نسبة الحضور</CardTitle>
        <RingProgress percent={pct} color={COLORS.green} />
        <p className="text-sm mt-3 text-center" style={{ color: COLORS.sub }}>{present} أيام حضور من أصل {total}</p>
      </Card>
      <Card className="lg:col-span-2">
        <CardTitle icon={Calendar}>السجل اليومي</CardTitle>
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
          {dates.length === 0 && <p className="text-sm" style={{ color: COLORS.sub }}>لا يوجد سجل حضور بعد.</p>}
          {dates.map((d) => (
            <div key={d} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
              <span className="font-bold text-sm" style={{ color: COLORS.text }}>{d}</span>
              {attendance[d] === "حاضر" ? (
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

function ReportsPage({ student, data }) {
  const reports = (data.dailyReports[student.id] || []).slice().reverse();
  if (reports.length === 0) {
    return <Card><p className="text-sm" style={{ color: COLORS.sub }}>لم يتم إصدار تقارير يومية بعد.</p></Card>;
  }
  return (
    <div className="flex flex-col gap-4">
      {reports.map((r, idx) => {
        const ratings = [
          { label: "السلوك", value: r.behavior },
          { label: "المشاركة", value: r.participation },
          { label: "التركيز", value: r.focus },
          { label: "الأنشطة", value: r.activities },
        ];
        return (
          <Card key={idx}>
            <div className="flex items-center justify-between mb-4">
              <CardTitle icon={FileText}>تقرير يوم {r.date}</CardTitle>
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: COLORS.greenBg, color: COLORS.green }}>تم الإرسال</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              {ratings.map((rt) => (
                <div key={rt.label} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
                  <span className="font-bold text-sm" style={{ color: COLORS.text }}>{rt.label}</span>
                  <span className="flex gap-0.5">
                    {[1,2,3,4,5].map((n) => <Star key={n} size={16} fill={n <= rt.value ? "#FBBF24" : "none"} color={n <= rt.value ? "#FBBF24" : "#D1D5DB"} />)}
                  </span>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4" style={{ background: COLORS.orangeBg }}>
              <h4 className="text-sm font-extrabold mb-1" style={{ color: COLORS.orange }}>📝 ملاحظات المعلمة</h4>
              <p className="text-sm" style={{ color: COLORS.text }}>{r.notes}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function GradesPage({ student, data }) {
  const subjects = data.grades[student.id] || {};
  const colorMap = { English: COLORS.blue, Math: COLORS.green, Arabic: COLORS.purple, Science: COLORS.orange };
  const entries = Object.entries(subjects);
  return (
    <Card>
      <CardTitle icon={BarChart3}>المستوى التعليمي لكل مادة</CardTitle>
      <div className="flex flex-col gap-5">
        {entries.length === 0 && <p className="text-sm" style={{ color: COLORS.sub }}>لا توجد بيانات بعد.</p>}
        {entries.map(([name, value]) => (
          <div key={name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm" style={{ color: COLORS.text }}>{name}</span>
              <span className="font-extrabold text-sm" style={{ color: colorMap[name] || COLORS.purple }}>{value}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#F1EFF8]">
              <div className="h-2.5 rounded-full" style={{ width: `${value}%`, background: colorMap[name] || COLORS.purple }} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs mt-5" style={{ color: COLORS.sub }}>📈 الرسم البياني للتطور الشهري متاح في تقرير نهاية كل شهر.</p>
    </Card>
  );
}

function SchedulePage({ data }) {
  const schedule = data.schedule || {};
  const days = Object.keys(schedule);
  const periodCount = days.length > 0 ? schedule[days[0]].length : 6;
  const periods = Array.from({ length: periodCount }, (_, i) => `الحصة ${i + 1}`);

  return (
    <Card className="overflow-x-auto">
      <CardTitle icon={Calendar}>الجدول الدراسي الأسبوعي</CardTitle>
      <table className="w-full text-sm border-separate" style={{ borderSpacing: "0 8px" }}>
        <thead>
          <tr>
            <th className="text-right px-3 py-2 text-xs font-extrabold" style={{ color: COLORS.sub }}>اليوم</th>
            {periods.map((p) => <th key={p} className="px-3 py-2 text-xs font-extrabold" style={{ color: COLORS.sub }}>{p}</th>)}
          </tr>
        </thead>
        <tbody>
          {days.map((d) => (
            <tr key={d} style={{ background: "#F8F7FC" }}>
              <td className="px-3 py-3 font-extrabold rounded-r-xl" style={{ color: COLORS.purple }}>{d}</td>
              {schedule[d].map((s, i) => (
                <td key={i} className={`px-3 py-3 text-center font-bold ${i === schedule[d].length - 1 ? "rounded-l-xl" : ""}`} style={{ color: COLORS.text }}>{s}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function ExamsPage({ student, data }) {
  const exams = data.exams[student.id] || [];
  if (exams.length === 0) {
    return <Card><p className="text-sm" style={{ color: COLORS.sub }}>لا توجد اختبارات مسجلة بعد.</p></Card>;
  }
  return (
    <div className="flex flex-col gap-4">
      {exams.map((e, i) => (
        <Card key={i} className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#F3E8FF" }}>
              <GraduationCap size={22} style={{ color: COLORS.purple }} />
            </div>
            <div>
              <h3 className="font-extrabold" style={{ color: COLORS.text }}>{e.subject}</h3>
              <p className="text-xs" style={{ color: COLORS.sub }}>تاريخ الاختبار: {e.date}</p>
              <p className="text-xs mt-1" style={{ color: COLORS.sub }}>{e.note}</p>
            </div>
          </div>
          <div className="text-2xl font-extrabold" style={{ color: COLORS.green }}>{e.grade}</div>
        </Card>
      ))}
    </div>
  );
}

function GalleryPage({ student, data }) {
  const albums = (data.gallery || []).filter((a) => !a.studentId || a.studentId === student.id);
  const colorMap = { green: COLORS.green, blue: COLORS.blue, orange: COLORS.orange, purple: COLORS.purple };

  if (albums.length === 0) {
    return <Card><p className="text-sm" style={{ color: COLORS.sub }}>لا توجد أنشطة أو صور حتى الآن.</p></Card>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {albums.map((a) => {
        const images = a.images || [];
        return (
          <Card key={a.id}>
            <div className="text-center mb-3">
              <h3 className="font-extrabold text-sm" style={{ color: COLORS.text }}>{a.title}</h3>
              <p className="text-xs" style={{ color: COLORS.sub }}>{images.length} صور</p>
            </div>
            {images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, idx) => (
                  <img key={idx} src={img.url} alt={a.title} className="w-full h-20 object-cover rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="w-full h-28 rounded-xl flex items-center justify-center" style={{ background: `${colorMap[a.color] || COLORS.purple}1A` }}>
                <ImageIcon size={32} style={{ color: colorMap[a.color] || COLORS.purple }} />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function MessagesPage({ student, data, updateData }) {
  const msgs = data.messages[student.id] || [];
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;
    const newMsg = { from: "ولي الأمر", text: text.trim(), time: "الآن", sender: "parent" };
    updateData((d) => {
      const next = structuredClone(d);
      if (!next.messages[student.id]) next.messages[student.id] = [];
      next.messages[student.id].push(newMsg);
      return next;
    });
    setText("");
  }

  return (
    <Card className="flex flex-col" style={{ minHeight: 420 }}>
      <CardTitle icon={MessageCircle}>الرسائل</CardTitle>
      <div className="flex-1 flex flex-col gap-3 mb-4 overflow-y-auto max-h-96">
        {msgs.map((m, i) => {
          const me = m.sender === "parent";
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
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="اكتب رسالتك..."
          className="flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none"
          style={{ borderColor: "#E5E7EB" }}
        />
        <button onClick={send} className="px-5 rounded-xl font-bold text-white text-sm" style={{ background: "linear-gradient(90deg,#7C3AED,#5B2A86)" }}>إرسال</button>
      </div>
    </Card>
  );
}

function ProfilePage({ student }) {
  const fields = [
    { label: "الاسم", value: student.name },
    { label: "الصف", value: student.grade },
    { label: "رقم الهوية", value: student.nationalId },
    { label: "تاريخ الميلاد", value: student.birthDate },
    { label: "فصيلة الدم", value: student.bloodType },
    { label: "بيانات التواصل", value: student.contact },
  ];
  return (
    <Card>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-extrabold" style={{ background: "linear-gradient(135deg,#A78BFA,#5B2A86)" }}>{student.avatar}</div>
        <div>
          <h3 className="font-extrabold text-lg" style={{ color: COLORS.text }}>{student.name}</h3>
          <p className="text-sm" style={{ color: COLORS.sub }}>طالب — {student.grade}</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.label} className="rounded-xl px-4 py-3" style={{ background: "#F8F7FC" }}>
            <div className="text-xs mb-1" style={{ color: COLORS.sub }}>{f.label}</div>
            <div className="font-bold text-sm" style={{ color: COLORS.text }}>{f.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

const PAGES = {
  home: HomePage, homework: HomeworkPage, online: OnlinePage, attendance: AttendancePage,
  reports: ReportsPage, grades: GradesPage, schedule: SchedulePage, exams: ExamsPage,
  gallery: GalleryPage, messages: MessagesPage, profile: ProfilePage,
};

function WhatsAppButton({ number, studentName }) {
  if (!number) return null;
  const cleanNumber = number.replace(/[^0-9]/g, "");
  if (!cleanNumber) return null;
  const message = encodeURIComponent(`السلام عليكم، أنا ولي أمر الطالب/ة ${studentName} وأحتاج التواصل بخصوص:`);
  const link = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full shadow-lg px-4 py-3 font-bold text-white text-sm transition hover:opacity-90"
      style={{ background: "#25D366" }}
      title="تواصل مع الإدارة عبر واتساب"
    >
      {/* WhatsApp glyph */}
      <svg width="22" height="22" viewBox="0 0 32 32" fill="white" aria-hidden="true">
        <path d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.36.66 4.57 1.8 6.45L4 29l7.73-1.78a11.95 11.95 0 0 0 4.31.8c6.64 0 12.04-5.4 12.04-12.04C28.08 8.4 22.68 3 16.04 3zm0 21.9c-1.5 0-2.94-.36-4.2-1.04l-.3-.16-3.66.84.78-3.55-.2-.32a9.85 9.85 0 0 1-1.5-5.23c0-5.46 4.44-9.9 9.9-9.9 5.46 0 9.9 4.44 9.9 9.9 0 5.46-4.44 9.9-9.9 9.9z"/>
        <path d="M21.5 18.18c-.3-.15-1.74-.86-2-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.63.07-1.7-.85-2.82-1.52-3.94-3.45-.3-.51.3-.47.85-1.56.1-.2.05-.37-.05-.52-.1-.15-.66-1.6-.9-2.18-.24-.57-.48-.49-.66-.5-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.08 3.18 5.04 4.33 2.96 1.15 2.96.77 3.5.72.53-.05 1.74-.71 1.98-1.4.24-.7.24-1.3.17-1.4-.07-.12-.27-.2-.57-.34z"/>
      </svg>
      تواصل عبر واتساب
    </a>
  );
}

export default function ParentPortal({ data, updateData, studentId, onLogout }) {
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const student = data.students.find((s) => s.id === studentId);
  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <Card>
          <p>لم يتم العثور على بيانات الطالب.</p>
          <button onClick={onLogout} className="mt-4 underline">تسجيل الخروج</button>
        </Card>
      </div>
    );
  }

  const Page = PAGES[active];

  return (
    <div className="min-h-screen flex" dir="rtl" style={{ background: COLORS.bg }}>
      <Sidebar active={active} setActive={setActive} onLogout={onLogout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} studentName={student.name} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <TopBar title={TITLES[active]} onMenu={() => setMobileOpen(true)} studentName={student.name} />
        <Page student={student} data={data} updateData={updateData} setActive={setActive} />
      </main>
      <WhatsAppButton number={data.settings?.whatsappNumber} studentName={student.name} />
    </div>
  );
}
