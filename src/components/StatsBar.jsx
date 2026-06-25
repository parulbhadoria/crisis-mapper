import { AlertTriangle, CheckCircle2, Users, Activity } from "lucide-react";

export default function StatsBar({ stats }) {
  return (
    <div className="glass-card flex flex-wrap items-center justify-between gap-4 px-6 py-4 rounded-2xl border border-slate-700/60">

      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-red-500/15 flex items-center justify-center">
          <AlertTriangle className="text-red-400" size={22} />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Active
          </p>

          <h2 className="text-2xl font-bold text-red-400">
            {stats.activeCrises}
          </h2>
        </div>
      </div>

      <div className="hidden md:block h-10 w-px bg-slate-700" />

      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-green-500/15 flex items-center justify-center">
          <CheckCircle2 className="text-green-400" size={22} />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Resolved
          </p>

          <h2 className="text-2xl font-bold text-green-400">
            {stats.resolvedToday}
          </h2>
        </div>
      </div>

      <div className="hidden md:block h-10 w-px bg-slate-700" />

      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-cyan-500/15 flex items-center justify-center">
          <Users className="text-cyan-400" size={22} />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">
            Helpers
          </p>

          <h2 className="text-2xl font-bold text-cyan-400">
            {stats.helpersAvailable}
          </h2>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 rounded-full bg-green-500/15 px-4 py-2">
        <Activity
          size={16}
          className="text-green-400 animate-pulse"
        />

        <span className="text-sm font-semibold text-green-400">
          LIVE
        </span>
      </div>

    </div>
  );
}