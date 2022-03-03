import { useEffect, useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import dayjs from 'dayjs'
import DatePicker from 'react-datepicker'

import { startOfDay } from '../../../modules/admin/analytic/services/startOfDay'

import { Store } from '../../../core/@types/firebase/Store'
import { endOfDay } from '../../../modules/admin/analytic/services/endOfDay'
import { StoreSelector } from '../../../modules/admin/analytic/components/storeSelector'
import { TransactionAnalytic } from '../../../modules/admin/analytic/@types/TransactionAnalytic'
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import { createFirebaseInstance } from '../../../core/services/createFirebaseInstance'
import { Transaction } from '../../../core/@types/firebase/Transaction'
import { BarRenderer } from '../../../modules/admin/analytic/components/barRenderer'
import { useCoinAnalytics } from '../../../modules/admin/analytic/services/useCoinAnalytics'

interface Props {
  stores: {
    id: string
    name: string
  }[]
}

const Page: NextPage = props => {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(
    // 'Vy6YQ3mP4SSdwmECWJfw'
    null
  )

  const [selectedStartRange, setSelectedStartRange] = useState<Date>(
    // dayjs('2022-01-01').toDate()
    startOfDay(dayjs().subtract(7, 'day')).toDate()
  )
  const [selectedEndRange, setSelectedEndRange] = useState<Date>(
    // dayjs('2022-01-31').toDate()
    endOfDay(dayjs()).toDate()
  )

  const analyticItems = useCoinAnalytics(
    selectedStoreId,
    selectedStartRange,
    selectedEndRange
  )

  return (
    <div className="px-4 mt-6 sm:px-6 lg:px-8">
      <div className="mb-6 mt-8">
        <h1 className="text-4xl font-bold">Analytics</h1>
      </div>
      <div className="block sm:flex space-y-4 sm:space-y-0 sm:space-x-4">
        <StoreSelector onSelect={storeId => setSelectedStoreId(storeId)} />
        <div className="relative w-full sm:w-40">
          <label
            htmlFor="startRange"
            className="block text-sm font-medium text-gray-700"
          >
            Start date
          </label>
          <div className="mt-1">
            <DatePicker
              selected={selectedStartRange}
              onChange={date => {
                // if select start date after end date, set end date to 7 days ahead
                if (startOfDay(date).isAfter(selectedEndRange)) {
                  setSelectedEndRange(
                    endOfDay(dayjs(date).add(7, 'day')).toDate()
                  )
                }
                setSelectedStartRange(startOfDay(date).toDate())
              }}
              selectsStart
              startDate={selectedStartRange}
              endDate={selectedEndRange}
              nextMonthButtonLabel=">"
              previousMonthButtonLabel="<"
              popperClassName="react-datepicker-left"
            />
          </div>
        </div>
        <div className="relative w-full sm:w-40">
          <label
            htmlFor="endRange"
            className="block text-sm font-medium text-gray-700"
          >
            End date
          </label>
          <div className="mt-1">
            <DatePicker
              selected={selectedEndRange}
              onChange={date => setSelectedEndRange(endOfDay(date).toDate())}
              selectsEnd
              startDate={selectedStartRange}
              endDate={selectedEndRange}
              nextMonthButtonLabel=">"
              previousMonthButtonLabel="<"
              popperClassName="react-datepicker-right"
              filterDate={date => startOfDay(date).isAfter(selectedStartRange)}
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        {analyticItems === undefined ? (
          <div>Please select store</div>
        ) : analyticItems === null ? (
          <div>Loading...</div>
        ) : analyticItems.length === 0 ? (
          <div>No data</div>
        ) : (
          <div className="space-y-6">
            <BarRenderer
              analyticItems={analyticItems}
              startRange={selectedStartRange}
              endRange={selectedEndRange}
              groupBy="date"
            />
            <BarRenderer
              analyticItems={analyticItems}
              startRange={selectedStartRange}
              endRange={selectedEndRange}
              groupBy="arcade"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { default: firebase } = await import('firebase-admin')
  const { initializeFirebase } = await import(
    '../../../modules/api/services/initializeFirebase'
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
        name: storeData.name,
      }

      return storeWithId
    })

    return {
      props: {
        stores: storesWithId,
      },
    }
  } catch (e) {
    return {
      notFound: true,
    }
  }
}

export default Page
