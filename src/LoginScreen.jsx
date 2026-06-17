import React, { useState } from "react";
import { COLORS, Logo } from "./theme.jsx";

export default function LoginScreen({ data, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const u = username.trim();
    const p = password;

    // check admin
    if (data.users.admin.username === u && data.users.admin.password === p) {
      onLogin({ role: "admin", name: data.users.admin.name });
      return;
    }

    // check parents
    const parent = data.users.parents.find((pu) => pu.username === u && pu.password === p);
    if (parent) {
      const student = data.students.find((s) => s.id === parent.studentId);
      onLogin({ role: "parent", studentId: parent.studentId, studentName: student?.name || "" });
      return;
    }

    setError("اسم المستخدم أو كلمة المرور غير صحيحة");
  }

  return (
    <div className="min-h-screen w-full flex" dir="rtl">
      {/* form side */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="text-3xl mb-3">👋</div>
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: COLORS.text }}>أهلاً بعودتك</h1>
          <p className="text-sm mb-8" style={{ color: COLORS.sub }}>سجّل دخولك للوصول إلى منصة Elite التعليمية</p>

          <label className="block text-sm font-bold mb-2" style={{ color: COLORS.text }}>
            اسم المستخدم
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="اسم المستخدم"
            className="w-full rounded-xl border px-4 py-3 mb-5 text-sm outline-none transition"
            style={{ borderColor: "#E5E7EB", direction: "ltr", textAlign: "right" }}
          />

          <label className="block text-sm font-bold mb-2" style={{ color: COLORS.text }}>كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border px-4 py-3 mb-3 text-sm outline-none transition"
            style={{ borderColor: COLORS.purpleLight, boxShadow: `0 0 0 2px ${COLORS.purpleLight}33` }}
          />

          {error && (
            <div className="text-sm font-bold mb-3 rounded-lg px-3 py-2" style={{ background: COLORS.redBg, color: COLORS.red }}>
              {error}
            </div>
          )}

          <label className="flex items-center gap-2 text-sm mb-6" style={{ color: COLORS.sub }}>
            <input type="checkbox" className="rounded" /> تذكرني
          </label>

          <button
            type="submit"
            className="w-full rounded-xl py-3 font-bold text-white text-sm shadow-lg transition hover:opacity-90"
            style={{ background: "linear-gradient(90deg,#7C3AED,#5B2A86)" }}
          >
            تسجيل الدخول
          </button>

          <p className="text-center text-xs mt-6" style={{ color: "#C4C4C4" }}>Elite International Schools © 2026</p>

          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => { window.location.hash = "teacher"; }}
              className="text-xs"
              style={{ color: "#E5E5E5", background: "none", border: "none", cursor: "pointer" }}
            >
              دخول المعلمات
            </button>
          </div>
        </form>
      </div>

      {/* brand side */}
      <div
        className="hidden md:flex flex-1 flex-col items-center justify-center text-white p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#3F1E63,#7C3AED 70%,#A78BFA)" }}
      >
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="rounded-full flex items-center justify-center mb-6 overflow-hidden bg-white/10" style={{ width: 140, height: 140, border: "2px solid rgba(255,255,255,0.25)" }}>
            <img src="/logo.jpeg" alt="EIS Logo" className="w-full h-full object-contain p-3" />
          </div>
          <h2 className="text-2xl font-extrabold mb-1">Elite International Schools</h2>
          <p className="opacity-80 mb-8">مدارس النخبة العالمية</p>

          <div className="w-full max-w-xs flex flex-col gap-3">
            {[
              { icon: "🎒", text: "منهج دراسي متطور" },
              { icon: "👨‍👩‍👧", text: "تواصل مع أولياء الأمور" },
              { icon: "📊", text: "متابعة الأداء والحضور" },
            ].map((f) => (
              <div key={f.text} className="rounded-xl px-5 py-3 text-sm font-bold flex items-center gap-3 justify-end" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                {f.text} <span>{f.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
