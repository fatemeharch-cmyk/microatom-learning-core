/** Shared helpers for the Persian/RTL analytics cards. */

export function toFa(n: number | string | null | undefined): string {
  if (n === null || n === undefined || n === "") return "—";
  return String(n).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

/** Format an ISO / timestamp value as a short Jalali date. */
export function formatJalali(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const raw = typeof value === "number" ? value : Date.parse(String(value));
  const d = new Date(raw);
  if (!Number.isFinite(d.getTime())) return String(value);
  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  } catch {
    return String(value);
  }
}

export function pct(v: number | null | undefined): string {
  if (v === null || v === undefined || !Number.isFinite(Number(v))) return "—";
  return `${toFa(Math.round(Number(v)))}٪`;
}

export function toneForScore(v: number | null | undefined): string {
  const n = Number(v);
  if (!Number.isFinite(n)) return "bg-slate-50 text-slate-700";
  if (n >= 75) return "bg-emerald-50 text-emerald-700";
  if (n >= 50) return "bg-amber-50 text-amber-700";
  return "bg-rose-50 text-rose-700";
}

export function AnalyticsCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        {icon && (
          <span className="h-9 w-9 rounded-xl bg-violet-50 text-violet-600 grid place-items-center">
            {icon}
          </span>
        )}
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function AnalyticsEmpty({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 gap-2 text-slate-500">
      <p className="text-xs">{title}</p>
    </div>
  );
}
