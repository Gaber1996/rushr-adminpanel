import { createContext, useContext, useState, useCallback } from 'react'
import { DISPUTES as INITIAL_DISPUTES, mergeDefaults } from '../data/disputes'

const DisputesContext = createContext(null)

export function DisputesProvider({ children }) {
  const [disputes, setDisputes] = useState(() => INITIAL_DISPUTES)

  const getDisputeById = useCallback(
    (id) => {
      const base = disputes.find((d) => d.id === id)
      return base ? mergeDefaults(base) : null
    },
    [disputes]
  )

  const updateDispute = useCallback((id, patch) => {
    setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)))
  }, [])

  return (
    <DisputesContext.Provider value={{ disputes, getDisputeById, updateDispute }}>
      {children}
    </DisputesContext.Provider>
  )
}

export function useDisputes() {
  const ctx = useContext(DisputesContext)
  if (!ctx) throw new Error('useDisputes must be used within DisputesProvider')
  return ctx
}
