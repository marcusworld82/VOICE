import { useLocation } from 'react-router-dom';

export default function SettingsFab(){
  const location = useLocation();
  
  // Only show setup button on settings page
  if (location.pathname !== '/settings') {
    return null;
  }
  
  const btn = { position:"fixed" as const, right:16, bottom:16, padding:"10px 14px", borderRadius:12, background:"#ffd166", color:"#000" };
  return (
    <div style={{position:"fixed", right:16, bottom:16, display:"flex", gap:8}}>
      <a href="/setup" style={btn}>Setup</a>
    </div>
  );
}