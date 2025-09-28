
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Product {
  id: string
  category: string
}

interface BrowsingHistoryState {
  products: Product[]
  addItems: (product: Product) => void
  clear: () => void
}

export const useBrowsingHistoryStore = create<BrowsingHistoryState>()(
  persist(
    (set, get) => ({
      products: [],
      addItems: (product: Product) => {
        const currentHistory	 = get().products
        const historyWithoutDuplicate = currentHistory.filter(p => p.id !== product.id)

        const newHistory = [product, ...historyWithoutDuplicate]
        if (newHistory.length > 10) newHistory.pop()

        // ✅ Always create a new array
        set({ products: newHistory })
      },
      clear: () => {
        set({ products: [] })
      }
    }),
    {
      name: 'browsing-history'
    }
  )
)


