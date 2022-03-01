import dayjs, { Dayjs } from 'dayjs'

export const startOfDay = (date: Dayjs | Date): Dayjs =>
  dayjs(date).startOf('day')
