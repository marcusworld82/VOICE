import { useEffect, useState } from "react";
import { loadConfig, saveConfig } from "../lib/config";

export default function Setup() {
  const [tenantSlug, setTenantSlug] = useState("");
  const [bookingLink, setBookingLink] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const cfg = loadConfig();
    setTenantSlug(cfg.tenantSlug);
    setBookingLink(cfg.bookingLink);
  }, []);

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    saveConfig({ tenantSlug, bookingLink });
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <div className="max-w-xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-semibold mb-4">Project Setup</h1>
        <p className="text-sm text-white/70 mb-6">
          Set your default tenant slug and public booking link.
        </p>
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Tenant Slug</label>
            <input 
              className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="acme-dental" 
              value={tenantSlug} 
              onChange={(e) => setTenantSlug(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Public Booking Link</label>
            <input 
              className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="https://calendly.com/your-client/booking" 
              value={bookingLink} 
              onChange={(e) => setBookingLink(e.target.value)} 
            />
          </div>
          <button type="submit" className="w-full py-2 rounded-xl bg-amber-400 text-black font-medium hover:bg-amber-300 transition">
            Save Settings
          </button>
          {saved && <p className="text-emerald-400 text-sm">Saved!</p>}
        </form>
      </div>
    </div>
  );
}