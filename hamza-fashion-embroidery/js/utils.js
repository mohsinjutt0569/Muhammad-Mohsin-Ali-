// utils.js – shared helper functions for Hamza Fashion Embroidery

/**
 * Hash a plain‑text password using SHA‑256 and return a hex string.
 * @param {string} password
 * @returns {Promise<string>} Hex‑encoded hash
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Simple localStorage helpers */
export function loadJSON(key) {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : null;
}

export function saveJSON(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj));
}

/** Generate a simple unique ID */
export function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

/** Format a Date to a readable string */
export function formatDate(date = new Date()) {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
