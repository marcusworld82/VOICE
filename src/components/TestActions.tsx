import { useState } from "react";

type CallRow = { id: string; direction: "inbound"|"outbound"; from: string; to: string; started_at: string; duration_sec: number; disposition: string; };
type ApptRow = { id: string; service_name: string; start_at: string; end_at: string; status: "booked"|"rescheduled"|"cancelled"; };

export default function TestActions() {
  const [calls, setCalls] = useState<CallRow[]>([]);
  const [appts, setAppts] = useState<ApptRow[]>([]);

  function addTestCall() {
    setCalls((prev)=>[
      { id: `demo-${prev.length+1}`, direction: "inbound", from: "+15551234567", to: "+15557654321", started_at: new Date().toISOString(), duration_sec: 120, disposition: "INFO_ONLY" },
      ...prev
    ]);
  }

  function addTestAppt() {
    const now = new Date();
    const end = new Date(now.getTime()+30*60000);
    setAppts((prev)=>[
      { id: `appt-${prev.length+1}`, service_name: "Consult", start_at: now.toISOString(), end_at: end.toISOString(), status: "booked" },
      ...prev
    ]);
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center gap-3">
        <button onClick={addTestCall} className="px-3 py-2 rounded-lg bg-amber-400 text-black font-medium hover:bg-amber-300">Insert Test Call</button>
        <button onClick={addTestAppt} className="px-3 py-2 rounded-lg bg-amber-400 text-black font-medium hover:bg-amber-300">Insert Test Booking</button>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h3 className="font-semibold mb-2">Calls (Local)</h3>
          <ul className="space-y-1">{calls.map(c=><li key={c.id}><code className="bg-black/50 px-2 py-1 rounded">{c.id}</code> {c.direction} {c.from} → {c.to} · {c.disposition}</li>)}</ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Appointments (Local)</h3>
          <ul className="space-y-1">{appts.map(a=><li key={a.id}><code className="bg-black/50 px-2 py-1 rounded">{a.id}</code> {a.service_name} · {a.status}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}