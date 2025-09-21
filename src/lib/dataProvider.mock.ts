export type CallRow = {
  id: string;
  direction: "inbound" | "outbound";
  from: string;
  to: string;
  started_at: string;
  duration_sec: number;
  disposition: string;
  notes_short?: string;
};

export type ApptRow = {
  id: string;
  service_name: string;
  start_at: string;
  end_at: string;
  status: "booked" | "rescheduled" | "cancelled";
};

export async function fetchCallsMock(): Promise<CallRow[]> {
  return [
    { id: "demo-1", direction: "inbound", from: "+15551234567", to: "+15557654321", started_at: new Date().toISOString(), duration_sec: 180, disposition: "INFO_ONLY" },
  ];
}

export async function fetchApptsMock(): Promise<ApptRow[]> {
  const now = new Date();
  const end = new Date(now.getTime() + 30 * 60000);
  return [
    { id: "appt-1", service_name: "Consult", start_at: now.toISOString(), end_at: end.toISOString(), status: "booked" },
  ];
}