import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Clock, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getTodayStudyPlan,
  reorderStudyPlan,
  updateStudyPlanStatus,
  type StudyPlanItem,
} from "@/lib/services/content-service";

type Status = StudyPlanItem["status"];

const STATUSES: Status[] = ["todo", "in_progress", "done"];

const COLUMN_META: Record<Status, { title: string; badgeCls: string; headerCls: string }> = {
  todo: {
    title: "🟦 انجام نشده",
    badgeCls: "bg-sky-100 text-sky-700",
    headerCls: "border-sky-200 bg-sky-50/60",
  },
  in_progress: {
    title: "🟨 در حال انجام",
    badgeCls: "bg-amber-100 text-amber-800",
    headerCls: "border-amber-200 bg-amber-50/60",
  },
  done: {
    title: "🟩 انجام شد",
    badgeCls: "bg-emerald-100 text-emerald-700",
    headerCls: "border-emerald-200 bg-emerald-50/60",
  },
};

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const toFa = (n: number | string) =>
  String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function nextStatus(s: Status): Status | null {
  const i = STATUSES.indexOf(s);
  return i < STATUSES.length - 1 ? STATUSES[i + 1] : null;
}
function prevStatus(s: Status): Status | null {
  const i = STATUSES.indexOf(s);
  return i > 0 ? STATUSES[i - 1] : null;
}

function sortByOrder(items: StudyPlanItem[]): StudyPlanItem[] {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder);
}

export interface StudyPlanBoardProps {
  studentId: string;
}

export function StudyPlanBoard({ studentId }: StudyPlanBoardProps) {
  const [items, setItems] = useState<StudyPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const reorderTimers = useRef<Record<Status, ReturnType<typeof setTimeout> | null>>({
    todo: null,
    in_progress: null,
    done: null,
  });
  const date = useMemo(() => todayISO(), []);

  const load = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    setError(false);
    try {
      const data = await getTodayStudyPlan(studentId, date);
      setItems(sortByOrder(data));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [studentId, date]);

  useEffect(() => {
    void load();
  }, [load]);

  // Live timer tick every second while any card is in progress
  const hasRunning = items.some((i) => i.status === "in_progress");
  useEffect(() => {
    if (!hasRunning) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [hasRunning]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  };

  const scheduleReorder = useCallback((status: Status, currentItems: StudyPlanItem[]) => {
    const existing = reorderTimers.current[status];
    if (existing) clearTimeout(existing);
    reorderTimers.current[status] = setTimeout(() => {
      const inCol = currentItems
        .filter((i) => i.status === status)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((i, idx) => ({ id: i.id, displayOrder: idx }));
      if (inCol.length === 0) return;
      reorderStudyPlan(inCol).catch(() => {
        showToast("ذخیره ترتیب جدید با خطا مواجه شد");
      });
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(reorderTimers.current).forEach((t) => t && clearTimeout(t));
    };
  }, []);

  const computeElapsedMinutes = (item: StudyPlanItem): number => {
    if (item.startedAt) {
      const started = Date.parse(item.startedAt);
      if (Number.isFinite(started)) {
        return Math.max(0, Math.round((Date.now() - started) / 60000));
      }
    }
    return item.actualMinutes ?? 0;
  };

  const changeStatus = async (item: StudyPlanItem, newStatus: Status) => {
    if (item.status === newStatus) return;
    const prev = items;
    // Optimistic update
    const nowIso = new Date().toISOString();
    const patched: StudyPlanItem = {
      ...item,
      status: newStatus,
      startedAt:
        newStatus === "in_progress" && !item.startedAt ? nowIso : item.startedAt,
      completedAt: newStatus === "done" ? nowIso : item.completedAt,
    };
    const optimistic = items.map((i) => (i.id === item.id ? patched : i));
    setItems(optimistic);
    try {
      const actualMinutes =
        newStatus === "done" ? computeElapsedMinutes(patched) : undefined;
      const updated = await updateStudyPlanStatus(item.id, newStatus, actualMinutes);
      setItems((curr) => curr.map((i) => (i.id === item.id ? { ...i, ...updated } : i)));
    } catch {
      setItems(prev);
      showToast("به‌روزرسانی وضعیت با خطا مواجه شد");
    }
  };

  // Drag & drop state
  const dragItemId = useRef<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    dragItemId.current = id;
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", id);
    } catch {
      /* ignore */
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnCard = (
    e: React.DragEvent,
    targetStatus: Status,
    targetId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const id = dragItemId.current;
    dragItemId.current = null;
    if (!id || id === targetId) return;
    reorderOrMove(id, targetStatus, targetId);
  };
  const handleDropOnColumn = (e: React.DragEvent, targetStatus: Status) => {
    e.preventDefault();
    const id = dragItemId.current;
    dragItemId.current = null;
    if (!id) return;
    reorderOrMove(id, targetStatus, null);
  };

  const reorderOrMove = (id: string, targetStatus: Status, beforeId: string | null) => {
    const src = items.find((i) => i.id === id);
    if (!src) return;
    const others = items.filter((i) => i.id !== id);
    const colOthers = others.filter((i) => i.status === targetStatus);
    let insertIndex = colOthers.length;
    if (beforeId) {
      const idx = colOthers.findIndex((i) => i.id === beforeId);
      if (idx >= 0) insertIndex = idx;
    }
    const nowIso = new Date().toISOString();
    const statusChanged = src.status !== targetStatus;
    const movedItem: StudyPlanItem = {
      ...src,
      status: targetStatus,
      startedAt:
        statusChanged && targetStatus === "in_progress" && !src.startedAt
          ? nowIso
          : src.startedAt,
      completedAt:
        statusChanged && targetStatus === "done" ? nowIso : src.completedAt,
    };
    const newCol = [...colOthers];
    newCol.splice(insertIndex, 0, movedItem);
    const reordered = newCol.map((i, idx) => ({ ...i, displayOrder: idx }));
    const otherCols = others.filter((i) => i.status !== targetStatus);
    const merged = sortByOrder([...otherCols, ...reordered]);
    const prevItems = items;
    setItems(merged);

    if (statusChanged) {
      const actualMinutes =
        targetStatus === "done" ? computeElapsedMinutes(movedItem) : undefined;
      updateStudyPlanStatus(src.id, targetStatus, actualMinutes)
        .then((updated) => {
          setItems((curr) =>
            curr.map((i) => (i.id === src.id ? { ...i, ...updated, status: targetStatus, displayOrder: i.displayOrder } : i)),
          );
        })
        .catch(() => {
          setItems(prevItems);
          showToast("به‌روزرسانی وضعیت با خطا مواجه شد");
        });
    }
    scheduleReorder(targetStatus, merged);
  };

  if (loading) {
    return (
      <div className="grid gap-3 md:grid-cols-3">
        {STATUSES.map((s) => (
          <Card key={s} className="min-h-[240px]">
            <CardContent className="p-4 flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mx-2" />
              در حال بارگذاری…
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <p className="text-sm">بارگذاری برنامه امروز با خطا مواجه شد</p>
          <Button size="sm" variant="outline" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4 mx-1" /> تلاش دوباره
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          امروز هنوز موموریتی در برنامه‌ات نیست
        </CardContent>
      </Card>
    );
  }

  const byStatus: Record<Status, StudyPlanItem[]> = {
    todo: items.filter((i) => i.status === "todo").sort((a, b) => a.displayOrder - b.displayOrder),
    in_progress: items.filter((i) => i.status === "in_progress").sort((a, b) => a.displayOrder - b.displayOrder),
    done: items.filter((i) => i.status === "done").sort((a, b) => a.displayOrder - b.displayOrder),
  };

  return (
    <div className="space-y-3" dir="rtl">
      {toast && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs p-2 text-center">
          {toast}
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-3">
        {STATUSES.map((status) => {
          const meta = COLUMN_META[status];
          const cards = byStatus[status];
          return (
            <div
              key={status}
              className={`rounded-2xl border p-3 min-h-[280px] flex flex-col gap-2 ${meta.headerCls}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnColumn(e, status)}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold">{meta.title}</h3>
                <Badge variant="secondary" className={`${meta.badgeCls} border-0`}>
                  {toFa(cards.length)}
                </Badge>
              </div>
              <div className="flex-1 space-y-2">
                {cards.length === 0 && (
                  <p className="text-[11px] text-muted-foreground text-center pt-6">
                    خالی
                  </p>
                )}
                {cards.map((item) => (
                  <PlanCard
                    key={item.id}
                    item={item}
                    now={now}
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDropOnCard={(e) => handleDropOnCard(e, status, item.id)}
                    onDragOver={handleDragOver}
                    onAdvance={() => {
                      const n = nextStatus(item.status);
                      if (n) void changeStatus(item, n);
                    }}
                    onBack={() => {
                      const p = prevStatus(item.status);
                      if (p) void changeStatus(item, p);
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface PlanCardProps {
  item: StudyPlanItem;
  now: number;
  onDragStart: (e: React.DragEvent) => void;
  onDropOnCard: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onAdvance: () => void;
  onBack: () => void;
}

function PlanCard({
  item,
  now,
  onDragStart,
  onDropOnCard,
  onDragOver,
  onAdvance,
  onBack,
}: PlanCardProps) {
  const canAdvance = nextStatus(item.status) !== null;
  const canBack = prevStatus(item.status) !== null;

  let elapsedLabel: string | null = null;
  if (item.status === "in_progress" && item.startedAt) {
    const started = Date.parse(item.startedAt);
    if (Number.isFinite(started)) {
      const seconds = Math.max(0, Math.floor((now - started) / 1000));
      const mm = Math.floor(seconds / 60);
      const ss = seconds % 60;
      elapsedLabel = `${toFa(String(mm).padStart(2, "0"))}:${toFa(String(ss).padStart(2, "0"))}`;
    }
  }

  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onDrop={onDropOnCard}
      onDragOver={onDragOver}
      className="bg-white/95 border shadow-sm cursor-grab active:cursor-grabbing"
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">
              {item.subjectTitle || "—"}
            </p>
            <p className="text-sm font-semibold leading-6 line-clamp-2">
              {item.title || "—"}
            </p>
          </div>
          {item.source && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-0 shrink-0 text-[10px]"
            >
              {item.source === "daily_mission" ? "ماموریت روزانه" : item.source}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {toFa(item.targetMinutes)} دقیقه
          </span>
          {elapsedLabel && (
            <span className="font-mono text-amber-700" dir="ltr">
              {elapsedLabel}
            </span>
          )}
          {item.status === "done" && item.actualMinutes != null && (
            <span className="text-emerald-700">
              انجام‌شده در {toFa(item.actualMinutes)} دقیقه
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-full"
            onClick={onBack}
            disabled={!canBack}
            aria-label="مرحله قبل"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 rounded-full"
            onClick={onAdvance}
            disabled={!canAdvance}
            aria-label="مرحله بعد"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
