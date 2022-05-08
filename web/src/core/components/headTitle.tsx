import { FunctionComponent, useMemo, PropsWithChildren } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useStoreon } from '../../context/storeon'
import { useLocale } from '../services/useLocale'

interface Props {
  title?: string
  description?: string
}

export const HeadTitle: FunctionComponent<PropsWithChildren<Props>> = props => {
  const { description = 'Virtual token payment system', children } = props

  const router = useRouter()
  const { title } = useStoreon('title')

  const { locale, detectedLocale } = useLocale({
    en: {
      app: 'Mirai',
    },
    th: {
      app: 'มิไร',
    },
  })

  const transformedTitle = useMemo(
    () => (title ? `${title} · ${locale('app')}` : locale('app')),
    [title, detectedLocale]
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
        key="favicon-apple"
        rel="apple-touch-icon"
        sizes="180x180"
        href="/static/icons/apple-touch-icon.png"
      />
      <link
        key="favicon-32"
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/static/icons/favicon-32x32.png"
      />
      <link
        key="favicon-16"
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/static/icons/favicon-16x16.png"
      />
      <link
        key="manifest-json"
        rel="manifest"
        href={`/manifest-${detectedLocale}.json`}
      />
      <link
        key="manifest-mask-icon"
        rel="mask-icon"
        href="/safari-pinned-tab.svg"
        color="#4b6fff"
      />
      <meta
        key="manifest-apple-title"
        name="apple-mobile-web-app-title"
        content="Mirai"
      />
      <meta key="manifest-apple-name" name="application-name" content="Mirai" />
      <meta
        key="manifest-ms-tile"
        name="msapplication-TileColor"
        content="#ffffff"
      />
      <meta key="manifest-theme" name="theme-color" content="#ffffff" />

      {children}
    </Head>
  )
}
