export function isEmailAllowed(email?: string | null) {
  if (!email) return false;
  const env = process.env.ALLOWLIST_EMAILS || "";
  const allowed = env.split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(email.toLowerCase());
}
