import { createContext, useContext, useState, ReactNode } from "react";

type Mode = "mock" | "live";
type Ctx = { mode: Mode; setMode: (m: Mode) => void; };

const DataModeContext = createContext<Ctx | null>(null);

export function DataModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("mock");
  return <DataModeContext.Provider value={{ mode, setMode }}>{children}</DataModeContext.Provider>;
}

export function useDataMode() {
  const ctx = useContext(DataModeContext);
  if (!ctx) throw new Error("useDataMode must be used within DataModeProvider");
  return ctx;
}