import { NextPage } from 'next'

import { QuestionMarkCircleIcon } from '@heroicons/react/outline'

const Page: NextPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center">
      <QuestionMarkCircleIcon className="w-8 h-8 text-gray-500" />
    </div>
  )
}

export default Page
