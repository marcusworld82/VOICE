export type AppConfig = { tenantSlug: string; bookingLink: string; };
const LS_KEY = "voicehub_settings";
export function loadConfig(): AppConfig {
  const envTenant = import.meta.env.VITE_TENANT_SLUG as string | undefined;
  const envBooking = import.meta.env.VITE_PUBLIC_BOOKING_LINK as string | undefined;
  const saved = localStorage.getItem(LS_KEY);
  if (saved) { try { const p = JSON.parse(saved); return {
    tenantSlug: p.tenantSlug || envTenant || "", bookingLink: p.bookingLink || envBooking || "" }; } catch {} }
  return { tenantSlug: envTenant || "", bookingLink: envBooking || "" };
}
export function saveConfig(cfg: AppConfig) { localStorage.setItem(LS_KEY, JSON.stringify(cfg)); }