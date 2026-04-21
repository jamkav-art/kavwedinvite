import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { EventFormData, MediaFiles, OrderFormState } from '@/types/order.types'

type CoupleFields = Pick<OrderFormState, 'couple_name_1' | 'couple_name_2' | 'wedding_date'>
type ContactFields = Pick<OrderFormState, 'phone_number' | 'email' | 'custom_message'>

export interface OrderStore extends OrderFormState {
  currentStep: number
  hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  updateCouple: (data: Partial<CoupleFields>) => void
  selectTemplate: (slug: string) => void
  addEvent: (event: EventFormData) => void
  updateEvent: (index: number, event: EventFormData) => void
  removeEvent: (index: number) => void
  updateMedia: (media: Partial<MediaFiles>) => void
  updateContact: (data: Partial<ContactFields>) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  reset: () => void
}

const EMPTY_MEDIA: MediaFiles = {
  photos: [],
  videos: [],
  voice: null,
  song: null,
}

const initial: OrderFormState & { currentStep: number } = {
  currentStep: 1,
  couple_name_1: '',
  couple_name_2: '',
  wedding_date: '',
  template_slug: '',
  events: [],
  media: EMPTY_MEDIA,
  phone_number: '',
  email: '',
  custom_message: '',
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      ...initial,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      updateCouple: (data) => set(data),
      selectTemplate: (slug) => set({ template_slug: slug }),
      addEvent: (event) => set((s) => ({ events: [...s.events, event] })),
      updateEvent: (index, event) =>
        set((s) => ({ events: s.events.map((e, i) => (i === index ? event : e)) })),
      removeEvent: (index) =>
        set((s) => ({ events: s.events.filter((_, i) => i !== index) })),
      updateMedia: (media) => set((s) => ({ media: { ...s.media, ...media } })),
      updateContact: (data) => set(data),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 4) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
      goToStep: (step) => set({ currentStep: step }),
      reset: () => set(initial),
    }),
    {
      name: 'wedinviter-order',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          }
        }
        return localStorage
      }),
      partialize: (state) => ({
        hasHydrated: state.hasHydrated,
        currentStep: state.currentStep,
        couple_name_1: state.couple_name_1,
        couple_name_2: state.couple_name_2,
        wedding_date: state.wedding_date,
        template_slug: state.template_slug,
        events: state.events,
        media: state.media,
        phone_number: state.phone_number,
        email: state.email,
        custom_message: state.custom_message,
      }),
      skipHydration: true,
      onRehydrateStorage: () => (state, error) => {
        if (error) return
        state?.setHasHydrated(true)
      },
    }
  )
)
