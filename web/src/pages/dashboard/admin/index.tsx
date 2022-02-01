import { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <div className="px-4 mt-6 sm:px-6 lg:px-8 space-y-6">
      <div className="mb-6 mt-8">
        <h1 className="text-4xl font-bold">Admin dashboard</h1>
        <p className="flex text-sm text-gray-600">
          <span>feature</span>
          <span className="mx-2">·</span>
          <span className="flex items-center">123</span>
        </p>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className=""></div>
      </div>
    </div>
  )
}

export default Page
