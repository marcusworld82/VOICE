import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { DataModeProvider, useDataMode } from "./lib/dataMode";
import Setup from "./pages/Setup";
import Integrations from "./pages/Integrations";
import TestActions from "./components/TestActions";

// If you already have a dashboard Home page, keep it. Otherwise, create a minimal one:
function Home() {
  const { mode, setMode } = useDataMode();
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-2 text-sm">
            <span>Data Mode:</span>
            <select
              className="bg-white/10 border border-white/10 rounded-lg px-2 py-1"
              value={mode}
              onChange={(e)=>setMode(e.target.value as "mock"|"live")}
            >
              <option value="mock">Mock</option>
              <option value="live">Live</option>
            </select>
          </div>
        </div>
        <TestActions />
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
          <p className="text-white/70 text-sm">
            Panels go here. In Mock mode, data is local. When we wire Supabase later, switching to Live will read from the database.
          </p>
        </div>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 p-3 flex gap-3 bg-black/40 backdrop-blur-md border-b border-white/10">
      <Link to="/" className="text-white/80 hover:text-white">Dashboard</Link>
      <Link to="/setup" className="text-white/80 hover:text-white">Setup</Link>
      <Link to="/integrations" className="text-white/80 hover:text-white">Integrations</Link>
    </nav>
  );
}

export default function App() {
  return (
    <DataModeProvider>
      <BrowserRouter>
        <Nav />
        <div className="pt-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/integrations" element={<Integrations />} />
          </Routes>
        </div>
      </BrowserRouter>
    </DataModeProvider>
  );
}