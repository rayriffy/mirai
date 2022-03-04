import { Fragment, useState, useCallback, useMemo, useEffect } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import { Spinner } from '../../core/components/spinner'
import {
  ExternalLinkIcon,
  LocationMarkerIcon,
  ArrowLeftIcon,
} from '@heroicons/react/outline'

import { classNames } from '../../core/services/classNames'
import getDistance from 'geolib/es/getDistance'

import { Store } from '../../core/@types/firebase/Store'
import { StoreWithId } from '../../core/@types/StoreWithId'
import { useLocale } from '../../core/services/useLocale'
import { useStoreon } from '../../context/storeon'

interface Props {
  storesWithId: StoreWithId[]
}

interface StoreWithDistance extends StoreWithId {
  distance: number
}

const Page: NextPage<Props> = props => {
  const { storesWithId } = props

  const { locale, detectedLocale } = useLocale({
    en: {
      page: 'Stores',
      closest: 'Closest',
      km: 'km',
      maps: 'Maps',
      locationWording: 'Cannot find store? Try to find it by your location',
    },
    th: {
      page: 'สาขา',
      closest: 'ใกล้ที่สุด',
      km: 'กม.',
      maps: 'แผนที่',
      locationWording: 'หาร้านไม่เจอ? ลองหาตามตำแหน่งที่ใกล้ที่สุดดูสิ',
    },
  })

  const {
    dispatch,
    user: {
      metadata: { balance_buck = undefined },
    },
  } = useStoreon('user', 'title')

  useEffect(() => {
    dispatch('title/set', locale('page'))
  }, [detectedLocale])

  const [gpsLocation, setGpsLocation] = useState<GeolocationCoordinates>(null)
  const renderedStores = useMemo<StoreWithDistance[]>(() => {
    if (gpsLocation === null) {
      return storesWithId
        .map(store => ({
          ...store,
          distance: -1,
        }))
        .filter(store => {
          if (
            store.data.currency === 'buck' &&
            balance_buck === undefined
          ) {
            return false
          } else {
            return true
          }
        })
    } else {
      return storesWithId
        .map(store => ({
          ...store,
          distance:
            getDistance(
              {
                lat: store.data.location.latitude,
                lon: store.data.location.longitude,
              },
              { lat: gpsLocation.latitude, lon: gpsLocation.longitude }
            ) / 1000,
        }))
        .sort((a, b) => (a.distance > b.distance ? 1 : -1))
        .filter(store => {
          if (
            store.data.currency === 'buck' &&
            balance_buck === undefined
          ) {
            return false
          } else {
            return true
          }
        })
    }
  }, [balance_buck, gpsLocation])

  const [locationStatus, setLocationStatus] = useState<
    'def' | 'success' | 'fail' | 'progress'
  >('def')

  const getLocation = useCallback(async () => {
    // const getDistance = await import('geolib/es/getDistance').then(o => o.default)

    const getCurrentPosition = () =>
      new Promise<GeolocationCoordinates>((res, rej) => {
        navigator.geolocation.getCurrentPosition(
          r => res(r.coords),
          e => rej(e)
        )
      })

    setLocationStatus('progress')

    try {
      // get gps location
      const position = await getCurrentPosition()

      // caculate distances
      setGpsLocation(position)
      setLocationStatus('success')
    } catch {
      setLocationStatus('fail')
    }
  }, [])

  return (
    <div className="px-4 mt-6 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={getLocation}
          disabled={locationStatus === 'progress'}
          className="transition bg-white inline-flex items-center p-2 h-10 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-wait"
        >
          {locationStatus === 'progress' ? (
            <Spinner />
          ) : (
            <div className="inline-block relative">
              <LocationMarkerIcon className="w-6 h-6" />
              {locationStatus !== 'def' && (
                <span
                  className={classNames(
                    locationStatus === 'success'
                      ? 'bg-green-500'
                      : 'bg-red-500',
                    'absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full text-white shadow-solid'
                  )}
                />
              )}
            </div>
          )}
        </button>
        <p className="text-gray-800 flex items-center">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          {locale('locationWording')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {renderedStores.map((store, i) => (
          <div className="" key={store.id}>
            <div className="border border-gray-200 bg-white rounded-md p-4 w-full">
              {store.distance !== -1 && i === 0 ? (
                <p className="pb-1.5 text-sm uppercase font-medium text-red-600">
                  {locale('closest')}
                </p>
              ) : null}
              <Link href={`/dashboard/arcades/${store.id}`}>
                <a>
                  <h1 className="text-gray-800 font-semibold text-xl">
                    {store.data.name}
                  </h1>
                </a>
              </Link>
              <div className="pt-0.5">
                <p className="text-gray-500 text-sm flex">
                  {store.distance !== -1 && (
                    <Fragment>
                      <span>
                        {store.distance.toFixed(2)} {locale('km')}
                      </span>
                      <span className="mx-1">|</span>
                    </Fragment>
                  )}
                  <a
                    href={`https://www.google.com/maps?q=${store.data.location.latitude},${store.data.location.longitude}`}
                    className="flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLinkIcon className="w-3.5 h-3.5 mr-0.5" />{' '}
                    Google&nbsp;
                    {locale('maps')}
                  </a>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { default: firebase } = await import('firebase-admin')
  const { initializeFirebase } = await import(
    '../../modules/api/services/initializeFirebase'
  )

  try {
    initializeFirebase()

    const storeSnapshot = await firebase
      .firestore()
      .collection('stores')
      .orderBy('name', 'asc')
      .get()

    const storesWithId = storeSnapshot.docs.map(doc => {
      const storeData = doc.data() as Store
      const storeWithId = {
        id: doc.id,
        data: {
          ...storeData,
          location: {
            latitude: storeData.location.latitude,
            longitude: storeData.location.longitude,
          },
        },
      } as StoreWithId

      return storeWithId
    })

    ctx.res.setHeader(
      'Cache-Control',
      'public, maxage=86400, stale-while-revalidate=3600'
    )

    return {
      props: {
        storesWithId,
      },
    }
  } catch (e) {
    console.error(e)
    return {
      notFound: true,
    }
  }
}

export default Page
