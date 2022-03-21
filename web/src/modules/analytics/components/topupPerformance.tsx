import { memo, useState, Fragment } from 'react'

import dayjs from 'dayjs'
import DatePicker from 'react-datepicker'

import { BarRenderer } from './barRenderer'

import { startOfDay } from '../services/startOfDay'
import { endOfDay } from '../services/endOfDay'

import { useTopupAnalytics } from '../services/useTopupAnalytics'
import { TopupRenderer } from './topupRenderer'

interface Props {
  storeId: string
}

export const TopupPerformance = memo<Props>(props => {
  const { storeId } = props

  const [selectedStartRange, setSelectedStartRange] = useState<Date>(
    startOfDay(dayjs().subtract(7, 'day')).toDate()
  )
  const [selectedEndRange, setSelectedEndRange] = useState<Date>(
    endOfDay(dayjs()).toDate()
  )

  const analyticItems = useTopupAnalytics(
    storeId,
    selectedStartRange,
    selectedEndRange
  )

  return (
    <Fragment>
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
      <div className="">
        {analyticItems === undefined ? (
          <div>Please select store</div>
        ) : analyticItems === null ? (
          <div>Loading...</div>
        ) : analyticItems.length === 0 ? (
          <div>No data</div>
        ) : (
          <TopupRenderer
            storeId={storeId}
            topups={analyticItems}
            startRange={selectedStartRange}
            endRange={selectedEndRange}
          />
        )}
      </div>
    </Fragment>
  )
})
