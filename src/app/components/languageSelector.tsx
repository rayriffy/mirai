import { FunctionComponent, useState, Fragment } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

const languages = [
  {
    id: 'en',
    name: 'English',
    flag: 'US',
  },
  {
    id: 'th',
    name: 'ไทย',
    flag: 'TH',
  }
]

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ')

export const LangaugeSelector: FunctionComponent = props => {
  const { locale, asPath } = useRouter()

  const [selected, setSelected] = useState(languages.find(o => o.id === locale))

  const getFlagResource = (flag: string) => `/static/flags/${flag}.png`

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">
            Language
          </Listbox.Label>
          <div className="mt-1 relative w-36">
            <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <span className="flex items-center">
                <img
                  src={getFlagResource(selected.flag)}
                  alt=""
                  className="h-auto w-6"
                />
                <span className="ml-3 block truncate">{selected.name}</span>
              </span>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
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
                className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              >
                {languages.map(language => (
                  <Listbox.Option
                    key={language.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                        'cursor-default select-none relative py-2 pl-3 pr-9'
                      )
                    }
                    value={language}
                  >
                    {({ selected, active }) => (
                      <Link href={asPath} locale={language.id}>
                        <a className="flex items-center cursor-default">
                          <img
                            src={getFlagResource(language.flag)}
                            alt=""
                            className="flex-shrink-0 h-auto w-6"
                          />
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'ml-3 block truncate'
                            )}
                          >
                            {language.name}
                          </span>
                        </a>
                      </Link>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
