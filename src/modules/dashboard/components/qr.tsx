import { memo, useEffect, useRef } from 'react'

import { toDataURL } from 'qrcode/'
import { useSize } from 'web-api-hooks'
import debounce from 'lodash/debounce'

import { useStoreon } from '../../../context/storeon'

export const QRProfile = memo(() => {
  const { user: { auth: { uid } } } = useStoreon('user')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  const [width] = useSize(boxRef)

  const renderQR = debounce(() => {
    toDataURL(document.querySelector('#qr-profile'), uid, {
      errorCorrectionLevel: 'L',
      margin: 1,
      width,
    })
  }, 50)

  useEffect(() => {
    if (canvasRef !== null) {
      renderQR()
    }
  }, [canvasRef, width])

  return (
    <div className="flex justify-center" ref={boxRef}>
      <canvas id="qr-profile" ref={canvasRef} className="w-full" />
    </div>
  )
})