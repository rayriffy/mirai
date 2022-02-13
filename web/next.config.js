const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

const withPlugins = require('next-compose-plugins')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = withPlugins(
  [[withBundleAnalyzer]],
  {
    env: {
      buildNumber: dayjs.tz(dayjs(), 'Asia/Bangkok').format('YYYYMMDD.HH'),
    },
    i18n: {
      locales: ['en', 'th'],
      defaultLocale: 'en',
      domains: [
        {
          domain: 'mirai.rayriffy.com',
          defaultLocale: 'en',
        },
        {
          domain: 'มิไร.ริฟฟี่.ไทย',
          defaultLocale: 'th',
        },
        // {
        //   domain: 'ミライ.リッフィー.みんな',
        //   defaultLocale: 'jp',
        // }
      ]
    },
    images: {
      domains: [
        'www.gravatar.com'
      ],
    },
    experimental: {
      polyfillsOptimization: true,
      scrollRestoration: true,
    },
  }
)
