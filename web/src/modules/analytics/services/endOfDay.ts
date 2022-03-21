import dayjs, { Dayjs } from 'dayjs'

export const endOfDay = (date: Dayjs | Date): Dayjs => dayjs(date).endOf('day')
