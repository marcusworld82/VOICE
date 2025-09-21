import { useEffect, useState } from "react";
import { loadConfig, saveConfig } from "../lib/config";
export default function Setup() {
  const [tenantSlug, setTenantSlug] = useState("");
  const [bookingLink, setBookingLink] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(()=>{ const c = loadConfig(); setTenantSlug(c.tenantSlug); setBookingLink(c.bookingLink); },[]);
  function onSave(e: React.FormEvent){ e.preventDefault(); saveConfig({ tenantSlug, bookingLink }); setSaved(true); setTimeout(()=>setSaved(false), 1200); }
  return (
    <div style={{padding:20}}>
      <h1>Project Setup</h1>
      <form onSubmit={onSave}>
        <div><label>Tenant Slug</label><br/><input value={tenantSlug} onChange={e=>setTenantSlug(e.target.value)} placeholder="acme-dental"/></div>
        <div style={{marginTop:8}}><label>Public Booking Link</label><br/><input value={bookingLink} onChange={e=>setBookingLink(e.target.value)} placeholder="https://calendly.com/your-client/booking"/></div>
        <button type="submit" style={{marginTop:12}}>Save</button>
        {saved && <div style={{color:"green"}}>Saved</div>}
      </form>
    </div>
  );
}