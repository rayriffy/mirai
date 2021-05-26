import { FunctionComponent, memo } from 'react'
import { LangaugeSelector } from './languageSelector'

export const Footer: FunctionComponent = memo(() => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="md:order-2 max-w-md">

          <LangaugeSelector />
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-base text-gray-400">
            &copy; 2020 Phumrapee Limpianchop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
})
