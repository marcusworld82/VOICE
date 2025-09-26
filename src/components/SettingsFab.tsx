export default function SettingsFab(){
  const btn = { position:"fixed" as const, right:16, bottom:16, padding:"10px 14px", borderRadius:12, background:"#ffd166", color:"#000" };
  return (
    <div style={{position:"fixed", right:16, bottom:16, display:"flex", gap:8}}>
      <a href="/setup" style={btn}>Setup</a>
    </div>
  );
}