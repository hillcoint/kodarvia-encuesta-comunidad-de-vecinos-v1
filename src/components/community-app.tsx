import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  Download,
  ExternalLink,
  Home,
  Link2,
  MessageSquareText,
  QrCode as QrIcon,
  RefreshCcw,
  ShieldCheck,
  Star,
  Users,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  EDIFICIOS,
  SERVICIOS,
  addResponse,
  exportResponses,
  pushAlert,
  readResponses,
  resetDemoData,
  seedResponses,
  updateResponseState,
  type EstadoRespuesta,
  type Respuesta,
} from "../lib/community-store";

const slate = "#1E293B";
const emerald = "#059669";
const amber = "#D97706";
const red = "#DC2626";
const light = "#F8FAFC";

const card = "rounded-2xl border border-slate-200 bg-white shadow-sm";
const input = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10";
const primaryButton = "inline-flex items-center justify-center gap-2 rounded-xl bg-[#059669] px-4 py-3 font-semibold text-white transition hover:bg-[#047857] disabled:cursor-not-allowed disabled:opacity-40";
const secondaryButton = "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50";

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${compact ? "h-9 w-9" : "h-11 w-11"} grid place-items-center rounded-xl bg-[#059669] text-white shadow-sm`}>
        <Building2 size={compact ? 19 : 23} strokeWidth={2.4} />
      </div>
      <div>
        <div className={`${compact ? "text-base" : "text-lg"} font-bold leading-tight text-slate-800`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Convivir
        </div>
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Gestión de comunidades</div>
      </div>
    </div>
  );
}

function Stars({ value, onChange, large = false }: { value: number; onChange?: (value: number) => void; large?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3, 4, 5].map((number) => (
        <button
          key={number}
          type="button"
          aria-label={`${number} estrellas`}
          onClick={() => onChange?.(number)}
          className={`grid ${large ? "h-14 w-14" : "h-9 w-9"} place-items-center rounded-xl transition ${onChange ? "hover:-translate-y-0.5 hover:bg-amber-50" : "cursor-default"}`}
        >
          <Star
            size={large ? 38 : 23}
            className={number <= value ? "fill-[#D97706] text-[#D97706]" : "fill-transparent text-slate-300"}
            strokeWidth={1.8}
          />
        </button>
      ))}
    </div>
  );
}

function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-4 py-5 sm:px-6 sm:py-8">
        <div className="mb-7 flex items-center justify-between">
          <Logo />
          <a href="/admin" className="text-xs font-semibold text-slate-400 transition hover:text-slate-700">Administración</a>
        </div>
        <div className="flex flex-1 items-center justify-center">{children}</div>
        <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">
          Demo frontend · Los datos se almacenan únicamente en este dispositivo.
        </p>
      </div>
    </main>
  );
}

const emptySurvey = {
  valoracionGeneral: 0,
  tiempoRespuesta: 0,
  tratoPersonal: 0,
  valoracionServicio: 0,
  comentario: "",
  contacto: "",
  consentimiento: false,
};

export function SurveyPage() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [edificio, setEdificio] = useState(EDIFICIOS[0]);
  const [servicio, setServicio] = useState(SERVICIOS[0]);
  const [survey, setSurvey] = useState(emptySurvey);
  const [submitted, setSubmitted] = useState<Respuesta | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const e = params.get("edificio") || params.get("e");
    const s = params.get("servicio") || params.get("s");
    if (e && EDIFICIOS.includes(e)) setEdificio(e);
    if (s && SERVICIOS.includes(s)) setServicio(s);
  }, []);

  const questions = [
    { key: "valoracionGeneral", title: "¿Cómo valorarías la atención recibida?", hint: "Tu valoración general", type: "rating" },
    { key: "tiempoRespuesta", title: "¿Qué te pareció el tiempo de respuesta?", hint: "Rapidez en la atención", type: "rating" },
    { key: "tratoPersonal", title: "¿Cómo fue el trato del personal?", hint: "Amabilidad y disposición", type: "rating" },
    { key: "valoracionServicio", title: "¿Cómo valorarías el resultado del servicio?", hint: servicio, type: "rating" },
    { key: "comentario", title: "¿Quieres contarnos algo más?", hint: "Tu comentario nos ayuda a mejorar", type: "comment" },
    { key: "contacto", title: "¿Podemos contactarte si necesitamos ampliar información?", hint: "Este dato es opcional", type: "contact" },
  ] as const;

  const current = questions[step];
  const ratingValue = current?.type === "rating" ? Number(survey[current.key]) : 0;
  const canContinue = current?.type === "rating" ? ratingValue > 0 : true;

  const submit = () => {
    if (!survey.consentimiento) return;
    const response: Respuesta = {
      id: `R-${Date.now()}`,
      fecha: new Date().toISOString(),
      edificio,
      servicio,
      valoracionGeneral: survey.valoracionGeneral,
      tiempoRespuesta: survey.tiempoRespuesta,
      tratoPersonal: survey.tratoPersonal,
      valoracionServicio: survey.valoracionServicio,
      comentario: survey.comentario.trim(),
      contacto: survey.contacto.trim() || undefined,
      consentimiento: true,
      estado: survey.valoracionGeneral <= 2 ? "Pendiente" : "Resuelto",
    };
    addResponse(response);
    if (response.valoracionGeneral <= 2) {
      pushAlert(response);
      setShowAlert(true);
    }
    setSubmitted(response);
  };

  if (submitted) {
    const low = submitted.valoracionGeneral <= 2;
    const high = submitted.valoracionGeneral >= 4;
    return (
      <PublicShell>
        <section className={`${card} w-full overflow-hidden p-6 text-center sm:p-8`}>
          <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${low ? "bg-red-50 text-[#DC2626]" : high ? "bg-emerald-50 text-[#059669]" : "bg-amber-50 text-[#D97706]"}`}>
            {low ? <MessageSquareText size={32} /> : <CheckCircle2 size={34} />}
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {low ? "Gracias por contárnoslo" : high ? "¡Gracias por tu valoración!" : "Gracias por ayudarnos a mejorar"}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            {low
              ? "Sentimos que tu experiencia no haya sido la esperada. Nuestro equipo ya tiene registrada la incidencia para revisarla cuanto antes."
              : high
                ? "Nos alegra saber que tu experiencia ha sido positiva. Tu opinión también puede ayudar a otros residentes."
                : "Hemos recibido tu valoración. Revisaremos tus comentarios para seguir mejorando el servicio."}
          </p>
          {low && (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-left text-sm text-red-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 shrink-0 text-[#DC2626]" size={20} />
                <div><strong>Alerta interna registrada.</strong><br />Se ha simulado el aviso inmediato al equipo responsable por WhatsApp/correo.</div>
              </div>
            </div>
          )}
          {high && (
            <a href="#resena-simulada" onClick={(e) => e.preventDefault()} className={`${primaryButton} mt-6 w-full sm:w-auto`}>
              Dejar reseña en Google <ExternalLink size={17} />
            </a>
          )}
          <button
            onClick={() => { setSubmitted(null); setStarted(false); setStep(0); setSurvey(emptySurvey); setShowAlert(false); }}
            className={`${secondaryButton} mt-4 w-full sm:ml-2 sm:w-auto`}
          >
            Nueva valoración
          </button>
        </section>
        {showAlert && (
          <div className="fixed bottom-5 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl bg-[#1E293B] p-4 text-sm text-white shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-500/20 text-red-300"><AlertTriangle size={19} /></div>
              <div className="flex-1"><strong>Aviso crítico simulado</strong><p className="mt-1 text-xs leading-5 text-slate-300">Aviso enviado al equipo por WhatsApp/correo.</p></div>
              <button aria-label="Cerrar" onClick={() => setShowAlert(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
          </div>
        )}
      </PublicShell>
    );
  }

  if (!started) {
    return (
      <PublicShell>
        <section className={`${card} w-full p-6 sm:p-8`}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <ShieldCheck size={15} /> Encuesta de satisfacción
          </div>
          <h1 className="text-3xl font-bold leading-tight text-slate-800 sm:text-4xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Valora tu comunidad en menos de 1 minuto
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">Tu opinión nos permite resolver incidencias antes y mejorar cada servicio.</p>
          <div className="mt-7 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Conjunto residencial
              <select value={edificio} onChange={(e) => setEdificio(e.target.value)} className={`${input} mt-2`}>
                {EDIFICIOS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">Servicio recibido
              <select value={servicio} onChange={(e) => setServicio(e.target.value)} className={`${input} mt-2`}>
                {SERVICIOS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <button onClick={() => setStarted(true)} className={`${primaryButton} mt-7 w-full`}>Comenzar <ArrowRight size={18} /></button>
          <p className="mt-4 text-center text-xs text-slate-400">6 preguntas breves · Sin registro · Datos de demo locales</p>
        </section>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <section className={`${card} w-full p-6 sm:p-8`}>
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Pregunta {step + 1} de {questions.length}</span><span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#059669] transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
        </div>
        <div className="min-h-[250px]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#059669]">{current.hint}</p>
          <h2 className="mt-3 text-2xl font-bold leading-snug text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{current.title}</h2>
          {current.type === "rating" && <div className="mt-9"><Stars large value={ratingValue} onChange={(value) => setSurvey((prev) => ({ ...prev, [current.key]: value }))} /><p className="mt-4 text-center text-sm text-slate-400">{ratingValue ? `${ratingValue} de 5` : "Toca una estrella"}</p></div>}
          {current.type === "comment" && <textarea value={survey.comentario} onChange={(e) => setSurvey((prev) => ({ ...prev, comentario: e.target.value }))} placeholder="Cuéntanos más..." rows={5} className={`${input} mt-6 resize-none`} />}
          {current.type === "contact" && (
            <div className="mt-6 space-y-4">
              <input value={survey.contacto} onChange={(e) => setSurvey((prev) => ({ ...prev, contacto: e.target.value }))} placeholder="Nombre y teléfono o correo (opcional)" className={input} />
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-5 text-slate-600">
                <input type="checkbox" checked={survey.consentimiento} onChange={(e) => setSurvey((prev) => ({ ...prev, consentimiento: e.target.checked }))} className="mt-1 h-4 w-4 accent-[#059669]" />
                <span><strong className="text-slate-700">Acepto el tratamiento de mis datos.</strong> Texto legal provisional de demostración; Kodarvia incorporará la política definitiva.</span>
              </label>
            </div>
          )}
        </div>
        <div className="mt-7 flex gap-3">
          <button onClick={() => step === 0 ? setStarted(false) : setStep((s) => s - 1)} className={`${secondaryButton} px-3 sm:px-4`}><ArrowLeft size={18} /><span className="hidden sm:inline">Atrás</span></button>
          {step < questions.length - 1 ? (
            <button disabled={!canContinue} onClick={() => setStep((s) => s + 1)} className={`${primaryButton} flex-1`}>Continuar <ArrowRight size={18} /></button>
          ) : (
            <button disabled={!survey.consentimiento} onClick={submit} className={`${primaryButton} flex-1`}>Enviar valoración <Check size={18} /></button>
          )}
        </div>
      </section>
    </PublicShell>
  );
}

function AdminShell({ children, active }: { children: React.ReactNode; active: "dashboard" | "access" | "room" }) {
  const links = [
    { id: "dashboard", href: "/admin", label: "Panel", icon: BarChart3 },
    { id: "access", href: "/accesos", label: "Enlaces y QR", icon: QrIcon },
    { id: "room", href: "/sala", label: "Vista de sala", icon: Home },
  ] as const;
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo compact />
          <a href="/encuesta" className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"><ExternalLink size={15} /> Ver encuesta</a>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <nav className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {links.map(({ id, href, label, icon: Icon }) => <a key={id} href={href} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active === id ? "bg-[#1E293B] text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}><Icon size={17} />{label}</a>)}
        </nav>
        {children}
      </div>
    </main>
  );
}

function Kpi({ label, value, helper, icon: Icon, tone = "emerald" }: { label: string; value: string; helper: string; icon: React.ElementType; tone?: "emerald" | "amber" | "red" | "slate" }) {
  const tones = { emerald: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", red: "bg-red-50 text-red-700", slate: "bg-slate-100 text-slate-700" };
  return <div className={`${card} p-5`}><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</p><p className="mt-1 text-xs text-slate-400">{helper}</p></div><div className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}><Icon size={20} /></div></div></div>;
}

function useResponses() {
  const [responses, setResponses] = useState<Respuesta[]>(seedResponses());
  useEffect(() => {
    const refresh = () => setResponses(readResponses());
    refresh();
    window.addEventListener("convivir-data-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("convivir-data-changed", refresh); window.removeEventListener("storage", refresh); };
  }, []);
  return [responses, setResponses] as const;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function AdminPage() {
  const [responses, setResponses] = useResponses();
  const [building, setBuilding] = useState("Todos");
  const [score, setScore] = useState("Todas");
  const [from, setFrom] = useState("");
  const [selected, setSelected] = useState<Respuesta | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const filtered = useMemo(() => responses.filter((r) => {
    if (building !== "Todos" && r.edificio !== building) return false;
    if (score !== "Todas" && r.valoracionGeneral !== Number(score)) return false;
    if (from && new Date(r.fecha) < new Date(`${from}T00:00:00`)) return false;
    return true;
  }), [responses, building, score, from]);

  const average = filtered.length ? filtered.reduce((acc, r) => acc + r.valoracionGeneral, 0) / filtered.length : 0;
  const critical = filtered.filter((r) => r.valoracionGeneral <= 2 && r.estado !== "Resuelto").length;
  const distribution = [1, 2, 3, 4, 5].map((stars) => ({ estrellas: `${stars}★`, respuestas: filtered.filter((r) => r.valoracionGeneral === stars).length }));
  const aspects = [
    { name: "Tiempo de respuesta", value: filtered.length ? filtered.reduce((a, r) => a + r.tiempoRespuesta, 0) / filtered.length : 0 },
    { name: "Trato del personal", value: filtered.length ? filtered.reduce((a, r) => a + r.tratoPersonal, 0) / filtered.length : 0 },
    { name: "Resultado del servicio", value: filtered.length ? filtered.reduce((a, r) => a + r.valoracionServicio, 0) / filtered.length : 0 },
  ].sort((a, b) => b.value - a.value);
  const evolution = useMemo(() => {
    const groups = new Map<string, number[]>();
    [...filtered].reverse().forEach((r) => {
      const key = r.fecha.slice(5, 10);
      groups.set(key, [...(groups.get(key) || []), r.valoracionGeneral]);
    });
    return [...groups.entries()].slice(-10).map(([fecha, values]) => ({ fecha, promedio: Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)) }));
  }, [filtered]);

  const changeState = (id: string, estado: EstadoRespuesta) => {
    updateResponseState(id, estado);
    const updated = readResponses();
    setResponses(updated);
    setSelected((prev) => prev?.id === id ? { ...prev, estado } : prev);
  };

  return (
    <AdminShell active="dashboard">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div><p className="text-sm font-semibold text-[#059669]">Administración</p><h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Satisfacción de residentes</h1><p className="mt-1 text-sm text-slate-500">Indicadores y seguimiento de servicios en tiempo real.</p></div>
        <button onClick={() => { const data = resetDemoData(); setResponses(data); }} className={secondaryButton}><RefreshCcw size={16} /> Reiniciar demo</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Promedio general" value={`${average.toFixed(1)} / 5`} helper={`${filtered.length} respuestas filtradas`} icon={Star} />
        <Kpi label="Respuestas" value={String(filtered.length)} helper="Registros visibles" icon={ClipboardList} tone="slate" />
        <Kpi label="Incidencias activas" value={String(critical)} helper="Valoraciones 1-2 sin resolver" icon={AlertTriangle} tone={critical ? "red" : "emerald"} />
        <Kpi label="Mejor aspecto" value={aspects[0]?.value.toFixed(1) || "0.0"} helper={aspects[0]?.name || "Sin datos"} icon={Users} tone="amber" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className={`${card} p-5`}><div className="mb-5"><h2 className="font-bold text-slate-800">Distribución de estrellas</h2><p className="text-xs text-slate-400">Valoración general</p></div><div className="h-64">{mounted && <ResponsiveContainer width="100%" height="100%"><BarChart data={distribution}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="estrellas" tickLine={false} axisLine={false} fontSize={12} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} /><Tooltip cursor={{ fill: "#f8fafc" }} /><Bar dataKey="respuestas" fill={emerald} radius={[7, 7, 0, 0]} /></BarChart></ResponsiveContainer>}</div></section>
        <section className={`${card} p-5`}><div className="mb-5"><h2 className="font-bold text-slate-800">Evolución reciente</h2><p className="text-xs text-slate-400">Promedio diario de satisfacción</p></div><div className="h-64">{mounted && <ResponsiveContainer width="100%" height="100%"><LineChart data={evolution}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="fecha" tickLine={false} axisLine={false} fontSize={11} /><YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tickLine={false} axisLine={false} fontSize={12} /><Tooltip /><Line type="monotone" dataKey="promedio" stroke={slate} strokeWidth={3} dot={{ r: 3, fill: emerald }} activeDot={{ r: 5 }} /></LineChart></ResponsiveContainer>}</div></section>
      </div>

      <section className={`${card} mt-4 p-5`}>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center"><div><h2 className="font-bold text-slate-800">Bandeja de respuestas</h2><p className="text-xs text-slate-400">Filtra, revisa comentarios y actualiza el estado de atención.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => exportResponses(responses, "csv")} className={`${secondaryButton} py-2 text-sm`}><Download size={15} /> CSV</button><button onClick={() => exportResponses(responses, "json")} className={`${secondaryButton} py-2 text-sm`}><Download size={15} /> JSON</button></div></div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <select value={building} onChange={(e) => setBuilding(e.target.value)} className={input}><option>Todos</option>{EDIFICIOS.map((e) => <option key={e}>{e}</option>)}</select>
          <select value={score} onChange={(e) => setScore(e.target.value)} className={input}><option>Todas</option>{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} estrellas</option>)}</select>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={input} aria-label="Desde fecha" />
        </div>
        <div className="mt-4 hidden overflow-x-auto md:block"><table className="w-full min-w-[850px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400"><th className="py-3 pr-3">Puntuación</th><th className="px-3 py-3">Edificio</th><th className="px-3 py-3">Servicio</th><th className="px-3 py-3">Fecha</th><th className="px-3 py-3">Estado</th><th className="py-3 pl-3"></th></tr></thead><tbody>{filtered.map((r) => <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"><td className="py-3 pr-3"><span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 font-bold ${r.valoracionGeneral <= 2 ? "bg-red-50 text-red-700" : r.valoracionGeneral === 3 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{r.valoracionGeneral}<Star size={13} className="fill-current" /></span></td><td className="px-3 py-3 font-medium text-slate-700">{r.edificio}</td><td className="px-3 py-3 text-slate-500">{r.servicio}</td><td className="px-3 py-3 text-slate-500">{formatDate(r.fecha)}</td><td className="px-3 py-3"><StatusBadge estado={r.estado} /></td><td className="py-3 pl-3 text-right"><button onClick={() => setSelected(r)} className="text-xs font-semibold text-[#059669] hover:underline">Ver detalle</button></td></tr>)}</tbody></table></div>
        <div className="mt-4 space-y-3 md:hidden">{filtered.map((r) => <button key={r.id} onClick={() => setSelected(r)} className="w-full rounded-xl border border-slate-200 p-4 text-left"><div className="flex items-center justify-between"><span className="font-bold text-slate-800">{r.valoracionGeneral} ★</span><StatusBadge estado={r.estado} /></div><p className="mt-2 text-sm font-semibold text-slate-700">{r.edificio}</p><p className="mt-1 text-xs text-slate-400">{r.servicio} · {formatDate(r.fecha)}</p><p className="mt-3 line-clamp-2 text-sm text-slate-500">{r.comentario || "Sin comentario"}</p></button>)}</div>
        {!filtered.length && <div className="py-10 text-center text-sm text-slate-400">No hay respuestas que coincidan con los filtros.</div>}
      </section>

      {selected && <ResponseModal response={selected} onClose={() => setSelected(null)} onChangeState={changeState} />}
    </AdminShell>
  );
}

function StatusBadge({ estado }: { estado: EstadoRespuesta }) {
  const css = estado === "Resuelto" ? "bg-emerald-50 text-emerald-700" : estado === "En atención" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${css}`}>{estado}</span>;
}

function ResponseModal({ response, onClose, onChangeState }: { response: Respuesta; onClose: () => void; onChangeState: (id: string, estado: EstadoRespuesta) => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-end bg-slate-900/40 p-0 backdrop-blur-sm sm:place-items-center sm:p-4" onMouseDown={(e) => e.currentTarget === e.target && onClose()}><div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-xl sm:rounded-3xl"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold text-[#059669]">{response.id}</p><h3 className="mt-1 text-xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Detalle de la valoración</h3></div><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500"><X size={18} /></button></div><div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4"><div><p className="text-xs text-slate-400">Valoración general</p><p className="mt-1 text-2xl font-bold text-slate-800">{response.valoracionGeneral} / 5</p></div><Stars value={response.valoracionGeneral} /></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Detail label="Edificio" value={response.edificio} /><Detail label="Servicio" value={response.servicio} /><Detail label="Fecha" value={formatDate(response.fecha)} /><Detail label="Contacto" value={response.contacto || "No facilitado"} /></div><div className="mt-4 rounded-xl border border-slate-200 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Comentario</p><p className="mt-2 text-sm leading-6 text-slate-700">{response.comentario || "El residente no dejó comentario."}</p></div><div className="mt-5"><label className="text-sm font-semibold text-slate-700">Estado de atención<select value={response.estado} onChange={(e) => onChangeState(response.id, e.target.value as EstadoRespuesta)} className={`${input} mt-2`}><option>Pendiente</option><option>En atención</option><option>Resuelto</option></select></label></div></div></div>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-slate-200 p-3"><p className="text-xs text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-700">{value}</p></div>; }

function hashString(text: string) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}

function DemoQr({ value }: { value: string }) {
  const size = 29;
  const seed = hashString(value);
  const finder = (r: number, c: number, top: number, left: number) => {
    const rr = r - top; const cc = c - left;
    if (rr < 0 || rr > 6 || cc < 0 || cc > 6) return null;
    return rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4);
  };
  const isDark = (r: number, c: number) => {
    for (const [top, left] of [[0,0],[0,size-7],[size-7,0]]) { const result = finder(r,c,top,left); if (result !== null) return result; }
    if (r === 6 || c === 6) return (r + c) % 2 === 0;
    const n = Math.imul(seed ^ (r * 73856093) ^ (c * 19349663), 83492791) >>> 0;
    return ((n >>> ((r + c) % 16)) & 1) === 1;
  };
  const quiet = 3;
  return <svg role="img" aria-label="Previsualización del código QR" viewBox={`0 0 ${size + quiet * 2} ${size + quiet * 2}`} className="h-full w-full rounded-xl bg-white"><rect width="100%" height="100%" fill="white" />{Array.from({ length: size }, (_, r) => Array.from({ length: size }, (_, c) => isDark(r,c) ? <rect key={`${r}-${c}`} x={c + quiet} y={r + quiet} width="1" height="1" fill="#1E293B" /> : null))}</svg>;
}

export function AccessPage() {
  const [building, setBuilding] = useState(EDIFICIOS[0]);
  const [service, setService] = useState(SERVICIOS[0]);
  const [origin, setOrigin] = useState("https://demo.local");
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (typeof window !== "undefined") setOrigin(window.location.origin); }, []);
  const url = `${origin}/encuesta?edificio=${encodeURIComponent(building)}&servicio=${encodeURIComponent(service)}`;
  const copy = async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); } };
  return <AdminShell active="access"><div className="mb-6"><p className="text-sm font-semibold text-[#059669]">Accesos</p><h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Generador de enlace y QR</h1><p className="mt-1 text-sm text-slate-500">Prepara un acceso contextualizado para cada conjunto y tipo de servicio.</p></div><div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><section className={`${card} p-6`}><div className="space-y-4"><label className="block text-sm font-semibold text-slate-700">Edificio<select value={building} onChange={(e) => setBuilding(e.target.value)} className={`${input} mt-2`}>{EDIFICIOS.map((e) => <option key={e}>{e}</option>)}</select></label><label className="block text-sm font-semibold text-slate-700">Tipo de servicio<select value={service} onChange={(e) => setService(e.target.value)} className={`${input} mt-2`}>{SERVICIOS.map((e) => <option key={e}>{e}</option>)}</select></label></div><div className="mt-6 rounded-xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400"><Link2 size={14} /> Enlace parametrizado</div><p className="mt-2 break-all text-sm leading-6 text-slate-600">{url}</p></div><div className="mt-4 flex flex-col gap-2 sm:flex-row"><button onClick={copy} className={`${primaryButton} flex-1`}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? "Copiado" : "Copiar enlace"}</button><a href={url} className={secondaryButton}>Abrir encuesta <ExternalLink size={16} /></a></div></section><section className={`${card} flex flex-col items-center justify-center p-6 text-center`}><div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"><QrIcon size={14} /> Vista previa QR</div><div className="aspect-square w-full max-w-[290px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><DemoQr value={url} /></div><h2 className="mt-5 font-bold text-slate-800">{building}</h2><p className="mt-1 text-sm text-slate-500">{service}</p><p className="mt-4 max-w-sm text-xs leading-5 text-slate-400">El QR se genera visualmente en el frontend a partir del enlace. En producción puede sustituirse por el generador definitivo sin cambiar el flujo.</p></section></div></AdminShell>;
}

export function RoomPage() {
  const [responses] = useResponses();
  const month = responses.filter((r) => r.fecha.startsWith("2026-09"));
  const average = month.length ? month.reduce((a, r) => a + r.valoracionGeneral, 0) / month.length : 0;
  const positive = month.length ? Math.round((month.filter((r) => r.valoracionGeneral >= 4).length / month.length) * 100) : 0;
  const resolved = month.length ? Math.round((month.filter((r) => r.estado === "Resuelto").length / month.length) * 100) : 0;
  return <AdminShell active="room"><section className="overflow-hidden rounded-3xl bg-[#1E293B] p-6 text-white shadow-xl sm:p-10"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200"><Home size={14} /> Vista de sala · Septiembre 2026</div><h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Así nos valoran nuestras comunidades</h1><p className="mt-3 text-sm text-slate-300">Indicadores mensuales de Gestión de Comunidades Convivir.</p></div><Logo compact /></div><div className="mt-10 grid gap-4 sm:grid-cols-3"><RoomMetric value={average.toFixed(1)} label="Promedio general" suffix="/ 5" /><RoomMetric value={`${positive}%`} label="Valoraciones positivas" /><RoomMetric value={`${resolved}%`} label="Casos resueltos" /></div><div className="mt-8 rounded-2xl bg-white/10 p-5"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-white">Participación del mes</p><p className="mt-1 text-xs text-slate-300">{month.length} respuestas recibidas</p></div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#059669]"><Users size={22} /></div></div><div className="mt-5 grid grid-cols-5 gap-2">{[1,2,3,4,5].map((n) => { const count = month.filter((r) => r.valoracionGeneral === n).length; return <div key={n} className="rounded-xl bg-white/10 p-3 text-center"><p className="text-xl font-bold">{count}</p><p className="mt-1 text-[10px] text-slate-300">{n} ★</p></div>; })}</div></div></section></AdminShell>;
}

function RoomMetric({ value, label, suffix }: { value: string; label: string; suffix?: string }) { return <div className="rounded-2xl border border-white/10 bg-white/10 p-5"><p className="text-4xl font-bold sm:text-5xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}<span className="ml-1 text-lg text-slate-300">{suffix}</span></p><p className="mt-2 text-sm text-slate-300">{label}</p></div>; }
