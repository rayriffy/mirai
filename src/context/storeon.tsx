import { FunctionComponent, createContext } from 'react'

import { createStoreon } from 'storeon'
import { customContext } from 'storeon/react'

import { title, TitleStore, TitleEvent } from './store/title'
import { user, UserStore, UserEvent } from './store/user'

export const store = createStoreon<
  TitleStore & UserStore,
  TitleEvent & UserEvent
>([title, user])

const StoreonContext = createContext(store)

export const useStoreon = customContext(StoreonContext)

export const Context: FunctionComponent = props => {
  const { children } = props

  return (
    <StoreonContext.Provider value={store}>{children}</StoreonContext.Provider>
  )
}
