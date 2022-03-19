const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

const withPWA = require('next-pwa')
const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const { runtimeCaching } = require('./runtimeCaching')

dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = withPlugins(
  [
    [
      withPWA,
      {
        pwa: {
          disable: process.env.NODE_ENV === 'development',
          dest: 'public',
          register: true,
          skipWaiting: true,
          runtimeCaching,
        },
      },
    ],
    [withBundleAnalyzer],
  ],
  {
    env: {
      buildNumber: dayjs.tz(dayjs(), 'Asia/Bangkok').format('YYYYMMDD.HH'),
    },
    i18n: {
      locales: ['en', 'th'],
      defaultLocale: 'en',
      // domains: [
      //   {
      //     domain: 'mirai.rayriffy.com',
      //     defaultLocale: 'en',
      //   },
      //   {
      //     domain: 'มิไร.ริฟฟี่.ไทย',
      //     defaultLocale: 'th',
      //   },
      //   {
      //     domain: 'ミライ.リッフィー.みんな',
      //     defaultLocale: 'jp',
      //   }
      // ]
    },
    images: {
      domains: ['localhost', 'www.gravatar.com', 'firebasestorage.googleapis.com'],
    },
    experimental: {
      polyfillsOptimization: true,
      scrollRestoration: true,
    },
  }
)
