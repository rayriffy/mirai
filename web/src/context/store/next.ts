import { StoreonModule } from 'storeon'

export interface NextStore {
  next: {
    path: undefined | string
  }
}

export interface NextEvent {
  'next/set': undefined | string
  'next/unset': void
}

export const next: StoreonModule<NextStore, NextEvent> = store => {
  store.on('@init', () => ({
    next: {
      path: undefined,
    },
  }))

  store.on('next/set', (store, event) => ({
    next: {
      ...store.next,
      path: event,
    },
  }))

  store.on('next/unset', (store, event) => ({
    next: {
      ...store.next,
      path: undefined,
    },
  }))
}
