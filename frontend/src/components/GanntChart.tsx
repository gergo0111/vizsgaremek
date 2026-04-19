import { useEffect, useMemo, useState } from "react";
import "./gantt/GanttChart.css";
import type { Munka } from "../interfaces/Munka";
import { apiGet } from "../lib/api";
import { isAdmin, getUser } from "../lib/auth";
import { WorkDisplay } from "./works/WorkDisplay";


type ViewMode = "week" | "month" | "year";

type StatusKey =
  | "p0_25"
  | "p25_50"
  | "p50_75"
  | "p75_100"
  | "late"
  | "done"
  | "planned";

type SortKey = "name" | "start" | "end" | "progress";

type DecoratedWork = Munka & {
  progress: number;
  status: StatusKey;
  start: Date;
  end: Date;
};

function progressColorClass(progress: number) {
  if (progress === 0) return "pt-bar--planned";
  if (progress >= 100) return "pt-bar--done";
  if (progress < 25) return "pt-bar--p0_25";
  if (progress < 50) return "pt-bar--p25_50";
  if (progress < 75) return "pt-bar--p50_75";
  return "pt-bar--p75_100";
}

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfMonth(d: Date) {
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfYear(d: Date) {
  const x = new Date(d.getFullYear(), 0, 1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function daysBetweenInclusive(a: Date, b: Date) {
  const start = new Date(a);
  start.setHours(0, 0, 0, 0);
  const end = new Date(b);
  end.setHours(0, 0, 0, 0);
  const ms = 24 * 60 * 60 * 1000;
  return Math.floor((end.getTime() - start.getTime()) / ms) + 1;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function isWeekend(d: Date) {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function formatMonthDay(d: Date) {
  return d.toLocaleDateString("hu-HU", { month: "short", day: "numeric" });
}

function formatDowHu(d: Date) {
  return d.toLocaleDateString("hu-HU", { weekday: "short" });
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function computeProgressPercent(w: Munka) {
  const total = w.feladat?.length ?? 0;
  const done = w.feladat?.filter((f) => f.isCompleted).length ?? 0;
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function computeStatus(progress: number, start: Date, end: Date): StatusKey {
  const now = new Date();
  if (progress >= 100) return "done";
  if (progress === 0 && start.getTime() > now.getTime()) return "planned";
  if (progress < 100 && end.getTime() < now.getTime()) return "late";
  if (progress < 25) return "p0_25";
  if (progress < 50) return "p25_50";
  if (progress < 75) return "p50_75";
  return "p75_100";
}

export function GanntChart() {
  const user = getUser();
  const isAdminUser = isAdmin();
  const currentUserId = user?.user_id ?? user?.id;

  const [works, setWorks] = useState<Munka[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [anchorDate, setAnchorDate] = useState<Date>(() => new Date());
  const [sortKey, setSortKey] = useState<SortKey>("start");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedWork, setSelectedWork] = useState<DecoratedWork | null>(null);
  const [filters, setFilters] = useState<Record<StatusKey, boolean>>({
    p0_25: true,
    p25_50: true,
    p50_75: true,
    p75_100: true,
    late: true,
    done: true,
    planned: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        const data = await apiGet<Munka[]>("/munka");
        let filtered = Array.isArray(data) ? data : [];
        if (!isAdminUser && currentUserId) {
          filtered = filtered.filter((w) => 
            w.munkaUsers?.some((mu) => mu.user_id === currentUserId)
          );
        }
        if (!cancelled) setWorks(filtered);
      } catch (e) {
        if (!cancelled) setError("Hiba történt az adatok betöltésekor.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdminUser, currentUserId]);

  const decoratedAll = useMemo<DecoratedWork[]>(() => {
    return works
      .map((w) => {
        const start = new Date(w.kezdeti_datum);
        const end = new Date(w.varhato_befejezes_datuma);
        const progress = computeProgressPercent(w);
        const status = computeStatus(progress, start, end);
        return { ...w, start, end, progress, status };
      })
      .filter(
        (w) =>
          !Number.isNaN(w.start.getTime()) && !Number.isNaN(w.end.getTime()),
      );
  }, [works]);

  const { rangeStart, rangeEnd, days } = useMemo(() => {
    const a = new Date(anchorDate);
    a.setHours(0, 0, 0, 0);
    if (viewMode === "week") {
      const start = startOfWeek(a);
      const end = addDays(start, 13);
      return {
        rangeStart: start,
        rangeEnd: end,
        days: Array.from({ length: 14 }, (_, i) => addDays(start, i)),
      };
    }
    if (viewMode === "month") {
      const start = startOfMonth(a);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      const len = daysBetweenInclusive(start, end);
      return {
        rangeStart: start,
        rangeEnd: end,
        days: Array.from({ length: len }, (_, i) => addDays(start, i)),
      };
    }
    const start = startOfYear(a);
    const end = new Date(start.getFullYear(), 11, 31);
    const len = daysBetweenInclusive(start, end);
    return {
      rangeStart: start,
      rangeEnd: end,
      days: Array.from({ length: len }, (_, i) => addDays(start, i)),
    };
  }, [anchorDate, viewMode]);

  const filteredSorted = useMemo<DecoratedWork[]>(() => {
    const visible = decoratedAll.filter((w) => {
      const isStatusMatch = filters[w.status];
      const isInView = w.start <= rangeEnd && w.end >= rangeStart;
      return isStatusMatch && isInView;
    });

    const dir = sortDir === "asc" ? 1 : -1;
    return [...visible].sort((a, b) => {
      switch (sortKey) {
        case "name":
          return a.munka_neve.localeCompare(b.munka_neve) * dir;
        case "start":
          return (a.start.getTime() - b.start.getTime()) * dir;
        case "end":
          return (a.end.getTime() - b.end.getTime()) * dir;
        case "progress":
          return (a.progress - b.progress) * dir;
        default:
          return 0;
      }
    });
  }, [decoratedAll, filters, sortKey, sortDir, rangeStart, rangeEnd]);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  function step(delta: number) {
    setAnchorDate((prev) => {
      const x = new Date(prev);
      if (viewMode === "week") x.setDate(x.getDate() + delta * 7);
      if (viewMode === "month") x.setMonth(x.getMonth() + delta);
      if (viewMode === "year") x.setFullYear(x.getFullYear() + delta);
      return x;
    });
  }

  function handleWorkSave(updatedWork: Munka) {
    setWorks((prev) =>
      prev.map((w) => (w.munka_id === updatedWork.munka_id ? updatedWork : w)),
    );
  }

  return (
    <div className="pt-page">
      <div className="pt-main">
        <div className="pt-panel pt-left">
          <div className="pt-panelHeader">
            <span>Rendezés</span>
            <span className="pt-dropdown">▼</span>
          </div>

          <div className="pt-sortBar">
            <div className="pt-sortGroup">
              <button
                className={`pt-sortBtn ${sortKey === "name" && sortDir === "asc" ? "pt-sortBtn--active" : ""}`}
                onClick={() => {
                  setSortKey("name");
                  setSortDir("asc");
                }}
              >
                Név ▲
              </button>
              <button
                className={`pt-sortBtn ${sortKey === "name" && sortDir === "desc" ? "pt-sortBtn--active" : ""}`}
                onClick={() => {
                  setSortKey("name");
                  setSortDir("desc");
                }}
              >
                Név ▼
              </button>
            </div>
            <div className="pt-sortGroup">
              <button
                className={`pt-sortBtn ${sortKey === "start" && sortDir === "asc" ? "pt-sortBtn--active" : ""}`}
                onClick={() => {
                  setSortKey("start");
                  setSortDir("asc");
                }}
              >
                Kezdet ▲
              </button>
              <button
                className={`pt-sortBtn ${sortKey === "start" && sortDir === "desc" ? "pt-sortBtn--active" : ""}`}
                onClick={() => {
                  setSortKey("start");
                  setSortDir("desc");
                }}
              >
                Kezdet ▼
              </button>
            </div>
            <div className="pt-sortGroup">
              <button
                className={`pt-sortBtn ${sortKey === "end" && sortDir === "asc" ? "pt-sortBtn--active" : ""}`}
                onClick={() => {
                  setSortKey("end");
                  setSortDir("asc");
                }}
              >
                Határidő ▲
              </button>
              <button
                className={`pt-sortBtn ${sortKey === "end" && sortDir === "desc" ? "pt-sortBtn--active" : ""}`}
                onClick={() => {
                  setSortKey("end");
                  setSortDir("desc");
                }}
              >
                Határidő ▼
              </button>
            </div>
          </div>

          <div className="pt-leftList">
            {error && <div className="pt-error">{error}</div>}
            {filteredSorted.map((w) => (
              <div key={w.munka_id} className="pt-workCard">
                <div
                  className={`pt-bar ${progressColorClass(w.progress)} ${w.status === "late" ? "pt-bar--late" : ""}`}
                >
                  <div
                    className="pt-barFill"
                    style={{ width: `${w.progress}%` }}
                  />
                  <div className="pt-barLabel">
                    {w.munka_neve} {w.progress}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="pt-panel pt-right"
          style={{ ["--pt-days" as any]: days.length }}
        >
          <div className="pt-ganttHeader">
            <div className="pt-ganttYearNav">
              <button className="pt-navBtn" onClick={() => step(-1)}>
                ◀
              </button>
              <div className="pt-year">{rangeStart.getFullYear()}</div>
              <button className="pt-navBtn" onClick={() => step(1)}>
                ▶
              </button>
            </div>
            <div className="pt-filter">
              <select
                className="pt-viewSelect"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as ViewMode)}
              >
                <option value="week">Heti</option>
                <option value="month">Havi</option>
                <option value="year">Éves</option>
              </select>
              <button
                className="pt-todayBtn"
                onClick={() => setAnchorDate(new Date())}
              >
                Ma
              </button>
            </div>
          </div>

          <div className="pt-ganttGrid">
            <div className="pt-col pt-col--label">Dátum:</div>
            {days.map((d) => (
              <div
                key={d.toISOString()}
                className={`pt-col ${isWeekend(d) ? "pt-col--weekend" : ""} ${sameDay(d, today) ? "pt-col--today" : ""}`}
              >
                <div className="pt-colTop">
                  <div className="pt-colDate">{formatMonthDay(d)}</div>
                  <div className="pt-colDow">{formatDowHu(d)}</div>
                </div>
              </div>
            ))}

            {filteredSorted.map((w) => {
              const totalDays = days.length;

              const visibleStart = new Date(
                Math.max(w.start.getTime(), rangeStart.getTime()),
              );
              const visibleEnd = new Date(
                Math.min(w.end.getTime(), rangeEnd.getTime()),
              );

              const startOffset =
                daysBetweenInclusive(rangeStart, visibleStart) - 1;
              const span = daysBetweenInclusive(visibleStart, visibleEnd);

              const leftPct = (startOffset / totalDays) * 100;
              const widthPct = (span / totalDays) * 100;

              return (
                <div
                  key={w.munka_id}
                  className="pt-gridRow"
                  onClick={() => setSelectedWork(w)}
                >
                  <div />
                  <div className="pt-rowTrack">
                    <div
                      className={`pt-ganttBar ${progressColorClass(w.progress)} ${w.status === "late" ? "pt-bar--late" : ""}`}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    >
                      <div
                        className="pt-ganttBarFill"
                        style={{ width: `${w.progress}%` }}
                      />
                      <div className="pt-ganttBarLabel">{w.munka_neve}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-legend">
            {(Object.keys(filters) as StatusKey[]).map((key) => (
              <label key={key} className="pt-legendItem">
                <input
                  type="checkbox"
                  checked={filters[key]}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                />
                <span className={`pt-dot pt-dot--${key}`} />
                {key === "p0_25" && "0% - 25%"}
                {key === "p25_50" && "25% - 50%"}
                {key === "p50_75" && "50% - 75%"}
                {key === "p75_100" && "75% - 100%"}
                {key === "late" && "Késésben"}
                {key === "done" && "Kész"}
                {key === "planned" && "Tervezett"}
              </label>
            ))}
          </div>
        </div>
      </div>

      {selectedWork && (
        <WorkDisplay
          work={selectedWork}
          onClose={() => setSelectedWork(null)}
          onSave={handleWorkSave}
        />
      )}
    </div>
  );
}

export default GanntChart;
