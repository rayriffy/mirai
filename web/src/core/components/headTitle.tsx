import { FunctionComponent, useMemo, useEffect } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useStoreon } from '../../context/storeon'

interface Props {
  title?: string
  description?: string
}

export const HeadTitle: FunctionComponent<Props> = props => {
  const { description = 'Virtual token payment system', children } = props

  const router = useRouter()
  const { title } = useStoreon('title')

  const transformedTitle = useMemo(
    () => (title ? `${title} · Mirai` : 'Mirai'),
    [title]
  )

  return (
    <Head>
      <title key="head-title">{transformedTitle}</title>
      <meta key="title" name="title" content={transformedTitle} />
      <meta key="description" name="description" content={description} />

      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:url" property="og:url" content={router.asPath} />
      <meta key="og:title" property="og:title" content={transformedTitle} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />

      <meta
        key="twitter:card"
        property="twitter:card"
        content="summary_large_image"
      />
      <meta key="twitter:url" property="twitter:url" content={router.asPath} />
      <meta
        key="twitter:title"
        property="twitter:title"
        content={transformedTitle}
      />
      <meta
        key="twitter:description"
        property="twitter:description"
        content={description}
      />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/static/icons/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/static/icons/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/static/icons/favicon-16x16.png"
      />
      <link rel="manifest" href="/manifest.json" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#4b6fff" />
      <meta name="apple-mobile-web-app-title" content="Mirai" />
      <meta name="application-name" content="Mirai" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />

      {children}
    </Head>
  )
}
