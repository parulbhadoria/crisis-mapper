export default function StatsBar({ stats }) {
  return (
    <div className="glass-card px-4 py-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
      <span className="text-slate-300">
        <span className="font-extrabold text-red-400">{stats.activeCrises}</span> active crises
      </span>
      <span className="text-slate-600 hidden sm:inline">|</span>
      <span className="text-slate-300">
        <span className="font-extrabold text-green-400">{stats.resolvedToday}</span> resolved today
      </span>
      <span className="text-slate-600 hidden sm:inline">|</span>
      <span className="text-slate-300">
        <span className="font-extrabold text-green-400">{stats.helpersAvailable}</span> helpers available
      </span>
    </div>
  );
}
