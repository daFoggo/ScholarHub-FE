import type React from "react"
import { createContext, useContext, useState } from "react"

export type View = "list" | "grid"

interface ViewContextProps {
  view: View
  setView: (view: View) => void
}

const ViewContext = createContext<ViewContextProps | undefined>(undefined)

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<View>("grid")

  return <ViewContext.Provider value={{ view, setView }}>{children}</ViewContext.Provider>
}

export function useView() {
  const context = useContext(ViewContext)
  if (!context) {
    throw new Error("useView must be used within a ViewProvider")
  }
  return context
}

