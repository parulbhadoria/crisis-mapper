import { CATEGORIES, CATEGORY_LIST } from '../lib/constants';

export default function FilterBar({
  activeCategories,
  onToggleCategory,
  showNeedsHelp,
  showOfferingHelp,
  onToggleType,
  categoryCounts,
  viewMode,
  onToggleViewMode,
}) {
  return (
    <div className="glass-card p-3 md:p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1">
          Filter
        </span>
        {CATEGORY_LIST.map((cat) => {
          const active = activeCategories.includes(cat);
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onToggleCategory(cat)}
              className={`filter-chip ${active ? 'filter-chip-active' : ''}`}
              style={
                active
                  ? { borderColor: CATEGORIES[cat].color, color: CATEGORIES[cat].color }
                  : {}
              }
            >
              {CATEGORIES[cat].emoji} {CATEGORIES[cat].label}
              {count > 0 && (
                <span className="ml-1 text-xs opacity-70">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onToggleType('needs_help')}
          className={`filter-chip ${showNeedsHelp ? 'filter-chip-active border-red-500 text-red-400' : ''}`}
        >
          🆘 Needs Help
        </button>
        <button
          type="button"
          onClick={() => onToggleType('offering_help')}
          className={`filter-chip ${showOfferingHelp ? 'filter-chip-active border-green-500 text-green-400' : ''}`}
        >
          🤝 Offering Help
        </button>

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => onToggleViewMode('pins')}
            className={`filter-chip ${viewMode === 'pins' ? 'filter-chip-active' : ''}`}
          >
            📍 Pin View
          </button>
          <button
            type="button"
            onClick={() => onToggleViewMode('heatmap')}
            className={`filter-chip ${viewMode === 'heatmap' ? 'filter-chip-active' : ''}`}
          >
            🔥 Heatmap
          </button>
        </div>
      </div>
    </div>
  );
}
