export const CATEGORIES = {
  Medical: { color: '#ef4444', label: 'Medical', emoji: '🔴' },
  Water: { color: '#3b82f6', label: 'Water', emoji: '🔵' },
  Food: { color: '#f97316', label: 'Food', emoji: '🟠' },
  Shelter: { color: '#a855f7', label: 'Shelter', emoji: '🟣' },
  Power: { color: '#eab308', label: 'Power Outage', emoji: '🟡' },
  Help: { color: '#22c55e', label: 'Offering Help', emoji: '🟢' },
};

export const CATEGORY_LIST = ['Medical', 'Water', 'Food', 'Shelter', 'Power', 'Help'];

export const SEVERITY_CONFIG = {
  Low: { size: 12, label: 'Low' },
  Urgent: { size: 18, label: 'Urgent' },
  Critical: { size: 24, label: 'Critical' },
};

export const RESOLVED_COLOR = '#64748b';

export const WORLD_CENTER = [20, 0];
export const DEFAULT_ZOOM = 3;
export const USER_ZOOM = 13;

export const PIN_EXPIRY_HOURS = 24;

export const GEMINI_SYSTEM_PROMPT = `You are a crisis reporting assistant for a disaster relief map. 
Extract information from the user's message and return ONLY a valid JSON object. 
No explanation, no markdown, no backticks. Just raw JSON.

{
  "location_hint": "the place or address they mentioned, or empty string if none",
  "category": "one of exactly: Medical, Water, Food, Shelter, Power, Help",
  "severity": "one of exactly: Low, Urgent, Critical",
  "note": "a clean 1-sentence summary of the situation, under 100 characters",
  "type": "one of exactly: needs_help, offering_help"
}

If the user seems to be offering help, set type to offering_help and category to Help.
If severity is not clear, default to Urgent.
If category is not clear, default to Medical.`;
