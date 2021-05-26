import { FunctionComponent, Fragment } from 'react'

import { Footer } from './footer'

export const AppLayout: FunctionComponent = props => {
  const { children } = props

  return (
    <Fragment>
      <main className="bg-gray-50 min-h-screen">{children}</main>
      <Footer />
    </Fragment>
  )
}
