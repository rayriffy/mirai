import { useEffect, useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'

import dayjs from 'dayjs'
import DatePicker from 'react-datepicker'

import { endOfDay } from '../../../../modules/admin/analytic/services/endOfDay'
import { startOfDay } from '../../../../modules/admin/analytic/services/startOfDay'

import { Store } from '../../../../core/@types/firebase/Store'
import { useTopupStatistic } from '../../../../modules/staff/analytics/services/useTopupStatistic'

interface Props {
  storeId: string
  store: Omit<Store, 'location'>
}

const Page: NextPage<Props> = props => {
  const { name, currency } = props.store

  const [selectedDate, setSelectedDate] = useState<Date>(
    // dayjs('2022-01-01').toDate()
    startOfDay(dayjs().subtract(7, 'day')).toDate()
  )

  const { loading, data } = useTopupStatistic(selectedDate, props.storeId)

  useEffect(() => {
    console.log(props)
  }, [])

  return (
    <div className="px-4 mt-6 sm:px-6 lg:px-8 space-y-6">
      <div className="mb-6 mt-8">
        <h1 className="text-4xl font-bold">{name}</h1>
        <p className="flex text-sm text-gray-600">
          <span>{props.storeId}</span>
        </p>
      </div>
      <div className="block sm:flex space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-40">
          <label
            htmlFor="startRange"
            className="block text-sm font-medium text-gray-700"
          >
            Start date
          </label>
          <div className="mt-1">
            <DatePicker
              selected={selectedDate}
              onChange={date => {
                setSelectedDate(startOfDay(date).toDate())
              }}
              selectsStart
              nextMonthButtonLabel=">"
              previousMonthButtonLabel="<"
              popperClassName="react-datepicker-left"
            />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <p className='font-bold text-lg'>{loading ? 'loading...' : data}</p>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { default: firebase } = await import('firebase-admin')
  const { initializeFirebase } = await import(
    '../../../../modules/api/services/initializeFirebase'
  )

  const targetStoreId = ctx.params.storeId as string

  initializeFirebase()

  // fetch for store
  const storeDoc = await firebase
    .firestore()
    .collection('stores')
    .doc(targetStoreId)
    .get()

  if (!storeDoc.exists) {
    return {
      notFound: true,
    }
  } else {
    const storeData = storeDoc.data()
    return {
      props: {
        storeId: storeDoc.id,
        store: {
          name: storeData.name,
          currency: storeData.currency,
        } as Store,
      },
    }
  }
}

export default Page
