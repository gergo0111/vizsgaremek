import { useEffect, useMemo, useState } from "react";
import "./gantt/GanttChart.css";
import type { Munka } from "../interfaces/Munka";
import { apiGet } from "../lib/api";
import { getUser } from "../lib/auth";
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
	const ms = 24 * 60 * 60 * 1000;
	const start = new Date(a);
	start.setHours(0, 0, 0, 0);
	const end = new Date(b);
	end.setHours(0, 0, 0, 0);
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
	const isAdmin = user?.isAdmin === true;
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
				if (!isAdmin && currentUserId) {
					filtered = filtered.filter((w) => w.user_id === currentUserId);
				}
				if (!cancelled) setWorks(filtered);
			} catch (e) {
				if (!cancelled) {
					setError(e instanceof Error ? e.message : "Hiba történt");
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [isAdmin, currentUserId]);

	const decoratedAll = useMemo<DecoratedWork[]>(() => {
		return works
			.map((w) => {
				const start = new Date(w.kezdeti_datum);
				const end = new Date(w.varhato_befejezes_datuma);
				const progress = computeProgressPercent(w);
				const status = computeStatus(progress, start, end);
				return { ...w, start, end, progress, status };
			})
			.filter((w) => !Number.isNaN(w.start.getTime()) && !Number.isNaN(w.end.getTime()));
	}, [works]);

	const filteredSorted = useMemo<DecoratedWork[]>(() => {
		const visible = decoratedAll.filter((w) => filters[w.status]);
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
			}
		});
	}, [decoratedAll, filters, sortKey, sortDir]);

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
			const end = addDays(new Date(start.getFullYear(), start.getMonth() + 1, 0), 0);
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

	function setFilter(key: StatusKey, value: boolean) {
		setFilters((prev) => ({ ...prev, [key]: value }));
	}

	function toggleSort(next: SortKey) {
		setSortKey((prev) => {
			if (prev !== next) {
				setSortDir("asc");
				return next;
			}
			setSortDir((d) => (d === "asc" ? "desc" : "asc"));
			return prev;
		});
	}

	function closeModal() {
		setSelectedWork(null);
	}

	function handleWorkSave(updatedWork: Munka) {
		setWorks((prev) =>
			prev.map((w) => (w.munka_id === updatedWork.munka_id ? updatedWork : w))
		);
	}

	useEffect(() => {
		if (!selectedWork) return;
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") closeModal();
		}
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [selectedWork]);

	return (
		<div className="pt-page">
			<div className="pt-main">
				<div className="pt-panel pt-left">
					<div className="pt-panelHeader">
						<span>Rendezés</span>
						<span className="pt-dropdown">▼</span>
					</div>

					<div className="pt-sortBar">
						<button className="pt-sortBtn" type="button" onClick={() => toggleSort("name")}>
							Név
							{sortKey === "name" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
						</button>
						<button className="pt-sortBtn" type="button" onClick={() => toggleSort("start")}>
							Kezdet
							{sortKey === "start" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
						</button>
						<button className="pt-sortBtn" type="button" onClick={() => toggleSort("end")}>
							Határidő
							{sortKey === "end" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
						</button>
						<button
							className="pt-sortBtn"
							type="button"
							onClick={() => toggleSort("progress")}
						>
							%
							{sortKey === "progress" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
						</button>
					</div>

					<div className="pt-leftList">
						{error && <div className="pt-error">{error}</div>}
						{!error && filteredSorted.length === 0 && (
							<div className="pt-empty">Nincs megjeleníthető munka.</div>
						)}
						{filteredSorted.map((w) => (
							<div key={w.munka_id} className="pt-workCard">
								<div
									className={`pt-bar ${progressColorClass(w.progress)} ${
										w.status === "late" ? "pt-bar--late" : ""
									}`}
								>
									<div
										className="pt-barFill"
										style={{ width: `${Math.min(100, Math.max(0, w.progress))}%` }}
									/>
									<div className="pt-barLabel">
										{w.munka_neve} {w.progress}%
									</div>
									<div className="pt-barKnob" />
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="pt-panel pt-right" style={{ ["--pt-days" as any]: days.length }}>
					<div className="pt-ganttHeader">
						<div className="pt-ganttYearNav">
							<button
								className="pt-navBtn"
								type="button"
								aria-label="Previous"
								onClick={() => step(-1)}
							>
								◀
							</button>
							<div className="pt-year">{rangeStart.getFullYear()}</div>
							<button
								className="pt-navBtn"
								type="button"
								aria-label="Next"
								onClick={() => step(1)}
							>
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
							<button className="pt-todayBtn" type="button" onClick={() => setAnchorDate(new Date())}>
								Ma
							</button>
						</div>
					</div>

					<div className="pt-ganttGrid">
						<div className="pt-col pt-col--label">Dátum:</div>
						{days.map((d) => {
							const weekend = isWeekend(d);
							const todayCol = sameDay(d, today);
							return (
								<div
									key={d.toISOString()}
									className={
										"pt-col" +
										(weekend ? " pt-col--weekend" : "") +
										(todayCol ? " pt-col--today" : "")
									}
								>
									<div className="pt-colTop">
										<div className="pt-colDate">{formatMonthDay(d)}</div>
										<div className="pt-colDow">{formatDowHu(d)}</div>
									</div>
								</div>
							);
						})}

						{filteredSorted.map((w) => {
							const totalDays = days.length;
							const visibleStart = new Date(
								Math.max(w.start.getTime(), rangeStart.getTime()),
							);
							const visibleEnd = new Date(Math.min(w.end.getTime(), rangeEnd.getTime()));
							const isOutside = visibleEnd.getTime() < rangeStart.getTime() || visibleStart.getTime() > rangeEnd.getTime();
							const startOffset = clamp(daysBetweenInclusive(rangeStart, visibleStart) - 1, 0, totalDays - 1);
							const span = clamp(daysBetweenInclusive(visibleStart, visibleEnd), 1, totalDays);
							const leftPct = (startOffset / totalDays) * 100;
							const widthPct = (span / totalDays) * 100;

							return (
								<div key={w.munka_id} className="pt-gridRow" onClick={() => setSelectedWork(w)} style={{ cursor: "pointer" }}>
									<div></div>
									<div className="pt-rowTrack">
										<div
											className={`pt-ganttBar ${progressColorClass(w.progress)} ${
												w.status === "late" ? "pt-bar--late" : ""
											}`}
											style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
										>
											<div className="pt-ganttBarFill" style={{ width: `${w.progress}%` }} />
											<div className="pt-ganttBarLabel">
												{w.munka_neve} {w.progress}%
											</div>
											<div className="pt-ganttKnob" />
										</div>
									</div>
								</div>
							);
						})}
					</div>

			{selectedWork && (
				<WorkDisplay work={selectedWork} onClose={closeModal} onSave={handleWorkSave} />
			)}

			<div className="pt-legend">
						<label className="pt-legendItem">
							<input type="checkbox" checked={filters.p0_25} onChange={(e) => setFilter("p0_25", e.target.checked)} />
							<span className="pt-dot pt-dot--p0_25" />
							Folyamatban (0% - 25%)
						</label>
						<label className="pt-legendItem">
							<input type="checkbox" checked={filters.p25_50} onChange={(e) => setFilter("p25_50", e.target.checked)} />
							<span className="pt-dot pt-dot--p25_50" />
							Folyamatban (25% - 50%)
						</label>
						<label className="pt-legendItem">
							<input type="checkbox" checked={filters.p50_75} onChange={(e) => setFilter("p50_75", e.target.checked)} />
							<span className="pt-dot pt-dot--p50_75" />
							Folyamatban (50% - 75%)
						</label>
						<label className="pt-legendItem">
							<input type="checkbox" checked={filters.p75_100} onChange={(e) => setFilter("p75_100", e.target.checked)} />
							<span className="pt-dot pt-dot--p75_100" />
							Folyamatban (75% - 100%)
						</label>
						<label className="pt-legendItem">
							<input type="checkbox" checked={filters.late} onChange={(e) => setFilter("late", e.target.checked)} />
							<span className="pt-dot pt-dot--late" />
							Késésben
						</label>
						<label className="pt-legendItem">
							<input type="checkbox" checked={filters.done} onChange={(e) => setFilter("done", e.target.checked)} />
							<span className="pt-dot pt-dot--done" />
							Kész
						</label>
						<label className="pt-legendItem">
							<input type="checkbox" checked={filters.planned} onChange={(e) => setFilter("planned", e.target.checked)} />
							<span className="pt-dot pt-dot--planned" />
								Tervezett
						</label>
					</div>
					
				</div>
			</div>
		</div>
	);
}

export default GanntChart;
