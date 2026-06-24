import { useEffect, useMemo, useState } from 'react';
import { ThumbsUp, CheckCircle, Share2 } from 'lucide-react';
import { CATEGORIES, SEVERITY_CONFIG } from '../lib/constants';
import { auth } from "../lib/auth";
import L from "leaflet";
import { VERIFY_RADIUS_METERS } from "../lib/constants";

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

export default function PinPopup({ pin, pins, onResolve, onUpvote, onConfirm, upvoted, }) {
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const category = CATEGORIES[pin.category] || CATEGORIES.Medical;
  const isResolved = pin.status === 'resolved';
  const currentUid = auth.currentUser?.uid;

  const alreadyConfirmed =
    pin.confirmedBy?.includes(currentUid);

  const nearbyHelpers = useMemo(() => {
  if (!pins || pin.type !== "needs_help") return [];

  return pins
    .filter(
      (p) =>
        p.type === "offering_help" &&
        p.status === "active" &&
        p.id !== pin.id
    )
    .map((helper) => ({
      ...helper,
      distance: L.latLng(pin.lat, pin.lng).distanceTo(
        L.latLng(helper.lat, helper.lng)
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);
}, [pins, pin]);

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

  async function handleVerify() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }

  setVerifying(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const user = L.latLng(
        position.coords.latitude,
        position.coords.longitude
      );

      const incident = L.latLng(pin.lat, pin.lng);

      const distance = user.distanceTo(incident);

      if (distance > VERIFY_RADIUS_METERS) {
        alert(
          `You are ${(distance / 1000).toFixed(2)} km away.\n\nOnly nearby witnesses can verify this report.`
        );

        setVerifying(false);
        return;
      }

      await onConfirm(pin.id);

      alert(`Verified successfully!`);

      setVerifying(false);
    },
    () => {
      alert("Unable to fetch your location.");
      setVerifying(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    }
  );
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

      <div className="mb-3">
  <div className="flex items-center justify-between text-xs">
    <span className="text-slate-500">
      Verification Score
    </span>

    <span className={`font-semibold ${
  (pin.verificationScore || 0) >= 70
    ? 'text-green-600'
    : (pin.verificationScore || 0) >= 40
    ? 'text-yellow-600'
    : 'text-red-600'
}`}>
      {pin.verificationScore || 0}%
    </span>
  </div>

  <div className="mt-1 w-full h-2 bg-slate-200 rounded-full overflow-hidden">
    <div
      className="h-full bg-green-500 transition-all"
      style={{
        width: `${pin.verificationScore || 0}%`,
      }}
    />
  </div>
</div>

{pin.type === "needs_help" && nearbyHelpers.length > 0 && (
  <div className="mt-3 mb-3 rounded-lg border border-green-200 bg-green-50 p-3">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-sm font-semibold text-green-800">
        🤝 Nearby Assistance
      </h4>

      <span className="text-xs font-medium text-green-700">
        {nearbyHelpers.length} Available
      </span>
    </div>

    <p className="text-xs text-slate-600 mb-3">
      Closest helper is{" "}
      <span className="font-semibold text-green-700">
        {nearbyHelpers[0].distance < 1000
          ? `${Math.round(nearbyHelpers[0].distance)} m`
          : `${(nearbyHelpers[0].distance / 1000).toFixed(1)} km`}
      </span>{" "}
      away.
    </p>

    <div className="space-y-2">
      {nearbyHelpers.map((helper) => (
        <div
          key={helper.id}
          className="rounded-md bg-white border border-slate-200 p-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">
              {helper.helpType || "General Volunteer"}
            </span>

            <span className="text-xs font-medium text-blue-600">
              {helper.distance < 1000
                ? `${Math.round(helper.distance)} m`
                : `${(helper.distance / 1000).toFixed(1)} km`}
            </span>
          </div>

          {helper.availability && (
            <div className="text-[11px] text-green-600 mt-1">
              🟢 {helper.availability}
            </div>
          )}

          {helper.note && (
            <div className="text-[11px] text-slate-500 mt-1">
              {helper.note}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}

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
          disabled={alreadyConfirmed || verifying}
          onClick={handleVerify}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors disabled:opacity-50"
          >
            ✓
          {
          alreadyConfirmed
            ? "Verified"
            : verifying
            ? "Checking Location..."
            : "Verify Report"
        }
          </button>
        )}

        {!isResolved && pin.ownerId === auth.currentUser?.uid && (
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
