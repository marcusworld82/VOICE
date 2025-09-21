import { useEffect, useState } from "react";
import { loadConfig } from "../lib/config";
type Ints = { retellVoiceId:string; retellAgentId:string; n8nListSlots:string; n8nBook:string; n8nReschedule:string; n8nCancel:string; };
const LS_KEY = "voicehub_integrations";
export default function Integrations(){
  const { tenantSlug } = loadConfig();
  const [d,setD] = useState<Ints>({ retellVoiceId:"", retellAgentId:"", n8nListSlots:"", n8nBook:"", n8nReschedule:"", n8nCancel:"" });
  useEffect(()=>{ const s = localStorage.getItem(LS_KEY); if(s) setD(JSON.parse(s)); },[]);
  function save(e:React.FormEvent){ e.preventDefault(); localStorage.setItem(LS_KEY, JSON.stringify(d)); alert("Saved locally"); }
  const placeholderBackend = "https://YOUR-BACKEND";
  return (
    <div style={{padding:20}}>
      <h1>Integrations</h1>
      <form onSubmit={save}>
        {(["retellVoiceId","retellAgentId","n8nListSlots","n8nBook","n8nReschedule","n8nCancel"] as (keyof Ints)[])
          .map(k=> <div key={k} style={{marginTop:8}}><label>{k}</label><br/><input value={d[k]||""} onChange={e=>setD({...d,[k]:e.target.value})}/></div>)}
        <button type="submit" style={{marginTop:12}}>Save</button>
      </form>
      <div style={{marginTop:16}}>
        <div><b>Retell webhook (format):</b> <code>{`${placeholderBackend}/retell-hook?tenant=${tenantSlug||"<slug>"}`}</code></div>
        <div><b>n8n webhook (format):</b> <code>{`\`${placeholderBackend}/n8n-hook?tenant=${tenantSlug||"<slug>"}\``}</code></div>
      </div>
    </div>
  );
}