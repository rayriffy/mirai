const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

const withPlugins = require('next-compose-plugins')

const withWorkers = require('@zeit/next-workers')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const withPreact = require('next-plugin-preact')

dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = withPlugins(
  [[withWorkers], [withPreact], [withBundleAnalyzer]],
  {
    target: 'serverless',
    env: {
      buildNumber: dayjs.tz(dayjs(), 'Asia/Bangkok').format('YYYYMMDD.HH'),
    },
    future: {
      webpack5: true,
    },
    i18n: {
      locales: ['en', 'th'],
      defaultLocale: 'en',
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
