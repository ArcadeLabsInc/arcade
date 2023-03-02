import { Nostr } from 'lib/nostr'
import create from 'zustand'

import { createAuthStore } from './auth'
import { createContactsStore } from './contacts'
import { createEventsStore } from './event'
import { createUiStore } from './ui'

export type UseStore = {
  nostr: Nostr | undefined
} & ReturnType<typeof createAuthStore> &
  ReturnType<typeof createContactsStore> &
  ReturnType<typeof createEventsStore> &
  ReturnType<typeof createUiStore>

export const useStore = create<UseStore>((set, get) => ({
  nostr: undefined,
  ...createAuthStore(set, get),
  ...createEventsStore(set, get),
  ...createContactsStore(set, get),
  ...createUiStore(set),
}))
