import { NextApiHandler } from 'next'

import { toBuffer } from 'qrcode'

const api: NextApiHandler = async (req, res) => {
  const { input } = req.query

  const result = await toBuffer(input as string, {
    errorCorrectionLevel: 'L',
    margin: 1,
    width: 768,
  })

  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Cache-Control', 'public, max-age=15552000')
  return res.end(result)
}

export default api
