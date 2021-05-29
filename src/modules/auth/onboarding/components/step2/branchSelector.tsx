import { forwardRef, Fragment, useCallback, useState } from 'react'

import { Listbox, Transition } from '@headlessui/react'
import {
  CheckIcon,
  LocationMarkerIcon,
  SelectorIcon,
} from '@heroicons/react/outline'

import getDistance from 'geolib/es/getDistance'

import { classNames } from '../../../../../core/services/classNames'

import { BranchWithId } from '../../../../../core/@types/BranchWithId'
import { Spinner } from '../../../../../core/components/spinner'

interface Props {
  branches: BranchWithId[]
}

export const BranchSelector = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
    const { branches } = props

    const [selected, setSelected] = useState(branches[0])
    const [locationStatus, setLocationStatus] =
      useState<'def' | 'success' | 'fail' | 'progress'>('def')

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
        const closetBranch = branches
          .map(branch => ({
            id: branch.id,
            distance:
              getDistance(
                {
                  lat: branch.data.location.latitude,
                  lon: branch.data.location.longitude,
                },
                { lat: position.latitude, lon: position.longitude }
              ) / 1000,
          }))
          .sort((a, b) => (a.distance > b.distance ? 1 : -1))[0]

        setSelected(branches.find(o => o.id === closetBranch.id))

        setLocationStatus('success')
      } catch {
        setLocationStatus('fail')
      }
    }, [])

    return (
      <div className="flex space-x-2">
        <input type="hidden" ref={ref} value={selected.id} />
        <Listbox value={selected} onChange={setSelected}>
          {({ open }) => (
            <>
              <Listbox.Label className="sr-only">Branch</Listbox.Label>
              <div className="mt-1 relative w-full">
                <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <span className="block truncate">{selected.data.name}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <SelectorIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options
                    static
                    className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                  >
                    {branches.map(branch => (
                      <Listbox.Option
                        key={branch.id}
                        className={({ active }) =>
                          classNames(
                            active ? 'text-white bg-indigo-600' : 'text-gray-900',
                            'cursor-default select-none relative py-2 pl-3 pr-9'
                          )
                        }
                        value={branch}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={classNames(
                                selected ? 'font-semibold' : 'font-normal',
                                'block truncate'
                              )}
                            >
                              {branch.data.name}
                            </span>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? 'text-white' : 'text-indigo-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4'
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
        <div className="mt-1">
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
        </div>
      </div>
    )
  }
)
