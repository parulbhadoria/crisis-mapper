import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CATEGORY_LIST, CATEGORIES } from '../lib/constants';

const EMPTY_FORM = {
  category: 'Medical',
  severity: 'Urgent',
  note: '',
  name: '',
  lat: null,
  lng: null,
  type: 'needs_help',
};

export default function PinForm({ isOpen, onClose, onSubmit, initialData, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (isOpen) {
      setForm({ ...EMPTY_FORM, ...initialData });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  function handleChange(field, value) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'category' && value === 'Help') {
        updated.type = 'offering_help';
      } else if (field === 'category' && value !== 'Help') {
        updated.type = 'needs_help';
      }
      return updated;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.lat == null || form.lng == null) return;
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md glass-card p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-white">Drop a Pin</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="input-field"
            >
              {CATEGORY_LIST.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORIES[cat].emoji} {CATEGORIES[cat].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              Severity
            </label>
            <div className="flex gap-3">
              {['Low', 'Urgent', 'Critical'].map((sev) => (
                <label key={sev} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="severity"
                    value={sev}
                    checked={form.severity === sev}
                    onChange={(e) => handleChange('severity', e.target.value)}
                    className="accent-red-500"
                  />
                  <span className="text-sm text-slate-300">{sev}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              Note <span className="text-slate-500 font-normal">(max 100 chars)</span>
            </label>
            <input
              type="text"
              value={form.note}
              onChange={(e) => handleChange('note', e.target.value.slice(0, 100))}
              placeholder="Describe the situation..."
              className="input-field"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              Your name <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Anonymous"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              Coordinates
            </label>
            <input
              type="text"
              readOnly
              value={
                form.lat != null && form.lng != null
                  ? `${form.lat.toFixed(5)}, ${form.lng.toFixed(5)}`
                  : 'Click the map to set location'
              }
              className="input-field opacity-60 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || form.lat == null}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Dropping Pin...' : 'Drop Pin'}
          </button>
        </form>
      </div>
    </div>
  );
}
