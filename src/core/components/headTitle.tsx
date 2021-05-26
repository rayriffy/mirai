import { FunctionComponent, useMemo, useEffect } from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'

import { useStoreon } from '../../context/storeon'

interface Props {
  title?: string
  description?: string
}

export const HeadTitle: FunctionComponent<Props> = props => {
  const { title, description = 'Next Tailwind template', children } = props

  const router = useRouter()
  const { dispatch } = useStoreon('title')

  const transformedTitle = useMemo(
    () => (title ? `${title} · Mirai` : 'Mirai'),
    [title]
  )

  useEffect(() => {
    dispatch('title/set', title)
  }, [title])

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
        key="google-font-preconnect"
        rel="preconnect"
        href="https://fonts.gstatic.com"
      />
      <link
        key="google-font-stylesheet"
        href="https://fonts.googleapis.com/css2?family=Niramit:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Prompt:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {children}
    </Head>
  )
}
