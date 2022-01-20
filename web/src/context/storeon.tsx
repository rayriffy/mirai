import { FunctionComponent, createContext } from 'react'

import { createStoreon } from 'storeon'
import { customContext } from 'storeon/react'
import { persistState } from '@storeon/localstorage'
import { crossTab } from '@storeon/crosstab'

import { title, TitleStore, TitleEvent } from './store/title'
import { user, UserStore, UserEvent } from './store/user'
import { next, NextStore, NextEvent } from './store/next'

export const store = createStoreon<
  TitleStore & UserStore & NextStore,
  TitleEvent & UserEvent & NextEvent
>([
  title,
  user,
  next,
  ...(typeof window !== 'undefined'
    ? [
        persistState(['startup', 'next'], {
          storage: sessionStorage,
        }),
        crossTab({
          filter: (event, data) => event.toString().startsWith('title/'),
        }),
      ]
    : []),
])

const StoreonContext = createContext(store)

export const useStoreon = customContext(StoreonContext)

export const Context: FunctionComponent = props => {
  const { children } = props

  return (
    <StoreonContext.Provider value={store}>{children}</StoreonContext.Provider>
  )
}
