import { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <div className="px-4 mt-6 sm:px-6 lg:px-8 space-y-6 max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-semibold text-gray-900">
            PraditNET Integration
          </h3>
          <div className="mt-2 sm:flex sm:items-start sm:justify-between">
            <div className="max-w-xl text-sm text-gray-500">
              <p>
                Enable <i>Tap and Pay</i> feature for arcades that linked into Pradit Amusement network
              </p>
            </div>
            <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
