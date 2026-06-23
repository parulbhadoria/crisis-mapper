import { useEffect, useState } from 'react';
import { ThumbsUp, CheckCircle, Share2 } from 'lucide-react';
import { CATEGORIES, SEVERITY_CONFIG } from '../lib/constants';

function formatTime(timestamp) {
  if (!timestamp) return 'Just now';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return date.toLocaleDateString();
}

export default function PinPopup({ pin, onResolve, onUpvote, upvoted }) {
  const [copied, setCopied] = useState(false);
  const category = CATEGORIES[pin.category] || CATEGORIES.Medical;
  const isResolved = pin.status === 'resolved';

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  function handleShare() {
    const url = `${window.location.origin}/pin/${pin.id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
  }

  return (
    <div className="pin-popup min-w-[220px] max-w-[280px]">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: isResolved ? '#64748b' : category.color }}
        />
        <span className="font-semibold text-slate-900 text-sm">
          {category.label}
          {isResolved && ' — Resolved'}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span
          className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
            pin.severity === 'Critical'
              ? 'bg-red-100 text-red-700'
              : pin.severity === 'Urgent'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-slate-100 text-slate-600'
          }`}
        >
          {SEVERITY_CONFIG[pin.severity]?.label || pin.severity}
        </span>
        <span className="text-xs text-slate-500">{formatTime(pin.createdAt)}</span>
      </div>

      {pin.note && (
        <p className="text-sm text-slate-700 mb-2 leading-snug">{pin.note}</p>
      )}

      <p className="text-xs text-slate-500 mb-3">
        Posted by <span className="font-medium">{pin.name || 'Anonymous'}</span>
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => onUpvote(pin.id)}
          disabled={upvoted || isResolved}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-50"
        >
          <ThumbsUp size={14} />
          {pin.upvotes || 0}
          {(pin.upvotes || 0) === 1 ? ' person' : ' people'} confirmed
        </button>

        {!isResolved && (
          <button
            type="button"
            onClick={() => onResolve(pin.id)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
          >
            <CheckCircle size={14} />
            Mark Resolved
          </button>
        )}

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <Share2 size={14} />
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>
    </div>
  );
}
