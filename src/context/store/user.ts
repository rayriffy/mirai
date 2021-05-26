import { User } from 'firebase/auth'
import { StoreonModule } from 'storeon'

import { User as UserMetadata } from '../../core/@types/firebase/User'

export interface UserStore {
  user: {
    auth: User
    metadata: UserMetadata
  }
}

export interface UserEvent {
  'user/auth': User | null | undefined
  'user/metadata': UserMetadata | null
}

export const user: StoreonModule<UserStore, UserEvent> = store => {
  store.on('@init', () => ({
    user: {
      auth: undefined,
      metadata: undefined,
    },
  }))

  store.on('user/auth', (store, event) => ({
    user: {
      ...store.user,
      auth: event,
    },
  }))

  store.on('user/metadata', (store, event) => ({
    user: {
      ...store.user,
      metadata: event,
    },
  }))
}
