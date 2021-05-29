import { StoreonModule } from 'storeon'

export interface StartupStore {
  startup: boolean
}

export interface StartupEvent {
  'startup/init': void
}

export const startup: StoreonModule<StartupStore, StartupEvent> = store => {
  store.on('@init', () => ({
    startup: false,
  }))

  store.on('startup/init', () => ({
    startup: true,
  }))
}
