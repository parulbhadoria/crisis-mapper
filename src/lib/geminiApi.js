import { GEMINI_SYSTEM_PROMPT } from './constants';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function parseCrisisMessage(userMessage) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: `${GEMINI_SYSTEM_PROMPT}\n\nUser message: ${userMessage}` }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 256,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    throw new Error('Empty response from Gemini');
  }

  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      locationHint: parsed.location_hint || '',
      category: parsed.category || 'Medical',
      severity: parsed.severity || 'Urgent',
      note: (parsed.note || '').slice(0, 100),
      type: parsed.type || 'needs_help',
    };
  } catch {
    throw new Error('Failed to parse Gemini response');
  }
}

export async function geocodeLocationHint(hint) {
  if (!hint?.trim()) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(hint)}&limit=1`;
  const response = await fetch(url, {
    headers: { 'Accept-Language': 'en' },
  });

  if (!response.ok) return null;

  const results = await response.json();
  if (!results?.length) return null;

  return {
    lat: parseFloat(results[0].lat),
    lng: parseFloat(results[0].lon),
  };
}
