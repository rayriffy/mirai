import { useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/th'

import DatePicker from 'react-datepicker'

import { startOfDay } from '../../../../modules/admin/analytic/services/startOfDay'

import { Store } from '../../../../core/@types/firebase/Store'
import { useTopupStatistic } from '../../../../modules/staff/analytics/services/useTopupStatistic'
import { useLocale } from '../../../../core/services/useLocale'

dayjs.extend(localizedFormat)

interface Props {
  storeId: string
  store: Omit<Store, 'location'>
}

const Page: NextPage<Props> = props => {
  const { name, currency } = props.store

  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfDay(dayjs()).toDate()
  )

  const { loading, data } = useTopupStatistic(selectedDate, props.storeId)

  const { locale, detectedLocale } = useLocale({
    en: {
      selectDate: 'Selected date',
      totalCredit: 'The total amount of credit given to the users',
      onDay: 'On',
      coins: 'coins',
    },
    th: {
      selectDate: 'วันที่เลือก',
      totalCredit: 'ยอดรวมเครดิตที่จ่ายให้ลูกค้า',
      onDay: 'ประจำวันที่',
      coins: 'เหรียญ',
    },
  })

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
            {locale('selectDate')}
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
        {loading ? (
          'loading...'
        ) : (
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {locale('totalCredit')}
            </h1>
            <h2 className="text-sm text-gray-700">
              {locale('onDay')}{' '}
              {dayjs(selectedDate).locale(detectedLocale).format('LL')}
            </h2>
            <p className="mt-1 text-gray-900">
              {data.toLocaleString()} {locale('coins')} (
              {(data * 10).toLocaleString()} ฿)
            </p>
          </div>
        )}
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
