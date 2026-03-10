import { create } from 'zustand'

type LoadedTable = {
  name: string
  headers: string[]
  rows: string[][]
  originalRows: string[][]
}

type AppState = {
  activeView: 'report' | 'table'
  loadedTable: LoadedTable | null
  setActiveView: (view: 'report' | 'table') => void
  setLoadedTable: (table: { name: string; headers: string[]; rows: string[][] }) => void
  sortByColumn: (columnIndex: number, direction: 'asc' | 'desc') => void
  clearSort: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  activeView: 'report',
  loadedTable: null,

  setActiveView: (view) => set({ activeView: view }),

  setLoadedTable: (table) =>
    set({
      loadedTable: {
        name: table.name,
        headers: table.headers,
        rows: table.rows,
        originalRows: table.rows,
      },
    }),

  sortByColumn: (columnIndex, direction) =>
    set((state) => {
      if (!state.loadedTable) return state
      const { loadedTable } = state
      const sortedRows = [...loadedTable.rows].sort((a, b) => {
        const av = a[columnIndex] ?? ''
        const bv = b[columnIndex] ?? ''
        if (av === bv) return 0
        if (direction === 'asc') {
          return av > bv ? 1 : -1
        }
        return av < bv ? 1 : -1
      })

      return {
        loadedTable: {
          ...loadedTable,
          rows: sortedRows,
        },
      }
    }),

  clearSort: () => {
    const { loadedTable } = get()
    if (!loadedTable) return
    set({
      loadedTable: {
        ...loadedTable,
        rows: loadedTable.originalRows,
      },
    })
  },
}))

