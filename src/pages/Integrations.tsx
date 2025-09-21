import { useEffect, useState } from "react";
import { loadConfig } from "../lib/config";

const LS_KEY = "voicehub_integrations";

type Integrations = {
  retellVoiceId: string;
  retellAgentId: string;
  n8nListSlots: string;
  n8nBook: string;
  n8nReschedule: string;
  n8nCancel: string;
};

export default function Integrations() {
  const { tenantSlug } = loadConfig();
  const [data, setData] = useState<Integrations>({
    retellVoiceId: "",
    retellAgentId: "",
    n8nListSlots: "",
    n8nBook: "",
    n8nReschedule: "",
    n8nCancel: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) setData(JSON.parse(saved));
  }, []);

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    alert("Saved locally. You'll wire real keys later.");
  }

  const placeholderBackend = "https://YOUR-BACKEND"; // later replace with Supabase Function or n8n
  const copyRetell = `${placeholderBackend}/retell-hook?tenant=${tenantSlug || "<slug>"}`;
  const copyN8n = `${placeholderBackend}/n8n-hook?tenant=${tenantSlug || "<slug>"}`;

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
          <h1 className="text-2xl font-semibold mb-1">Integrations</h1>
          <p className="text-sm text-white/70 mb-4">Store IDs here for reference. Real wiring happens server-side.</p>
          <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Retell Voice ID</label>
              <input 
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2"
                value={data.retellVoiceId} 
                onChange={(e)=>setData({...data, retellVoiceId: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Retell Agent ID</label>
              <input 
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2"
                value={data.retellAgentId} 
                onChange={(e)=>setData({...data, retellAgentId: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">n8n List Slots URL</label>
              <input 
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2"
                value={data.n8nListSlots} 
                onChange={(e)=>setData({...data, n8nListSlots: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">n8n Book URL</label>
              <input 
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2"
                value={data.n8nBook} 
                onChange={(e)=>setData({...data, n8nBook: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">n8n Reschedule URL</label>
              <input 
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2"
                value={data.n8nReschedule} 
                onChange={(e)=>setData({...data, n8nReschedule: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">n8n Cancel URL</label>
              <input 
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2"
                value={data.n8nCancel} 
                onChange={(e)=>setData({...data, n8nCancel: e.target.value})}
              />
            </div>
            <button className="col-span-full w-full py-2 rounded-xl bg-amber-400 text-black font-medium hover:bg-amber-300 transition">
              Save Integrations (Local)
            </button>
          </form>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-2">Copy Webhook URLs (placeholders)</h2>
          <p className="text-sm text-white/70 mb-3">Use these formats when wiring Retell and n8n later.</p>
          <div className="space-y-2 text-sm">
            <div><span className="text-amber-300">Retell →</span> <code className="bg-black/50 px-2 py-1 rounded">{copyRetell}</code></div>
            <div><span className="text-amber-300">n8n →</span> <code className="bg-black/50 px-2 py-1 rounded">{copyN8n}</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}