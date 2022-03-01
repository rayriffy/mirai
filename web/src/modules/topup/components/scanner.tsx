import { Fragment, FunctionComponent, useState } from 'react'

import dynamic from 'next/dynamic'
import { useLocale } from '../../../core/services/useLocale'

const QRReader = dynamic(() => import('react-qr-reader'), { ssr: false })

interface Props {
  onScan?(value: string): void
}

export const Scanner: FunctionComponent<Props> = props => {
  const { onScan } = props

  const [isCameraFail, setIsCameraFail] = useState(false)
  const { locale } = useLocale({
    en: {
      title: 'Camera not found',
      desc: 'Make sure to allow permission to camera',
    },
    th: {
      title: 'ไม่สามารถเปิดใช้งานกล้องได้',
      desc: 'กรุณาเช็คว่าคุณได้ให้อนุญาติเว็บใช้งานกล้องได้',
    }
  })

  return (
    <Fragment>
      {isCameraFail ? (
        <div className="w-full aspect-w-1 aspect-h-1 border-4 border-dashed border-gray-200 relative">
          <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center text-gray-500">
            <div className="text-center">
              <h1 className="text-lg font-bold">{locale('title')}</h1>
              <p>{locale('desc')}</p>
            </div>
          </div>
        </div>
      ) : (
        <QRReader
          onScan={o => {
            if (o !== null) {
              onScan(o)
            }
          }}
          onError={o => {
            setIsCameraFail(true)
          }}
          showViewFinder={false}
          className="w-full"
        />
      )}
    </Fragment>
  )
}
