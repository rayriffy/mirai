import admin from 'firebase-admin'

import { NextApiHandler } from 'next'

const api: NextApiHandler = async (req, res) => {
  console.log(process.env.PROJECT_ID)
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.PROJECT_ID,
      clientEmail: process.env.CLIENT_EMAIL,
      privateKey: process.env.PRIVATE_KEY,
    })
  })

  return res.send({
    message: 'ok'
  })
}

export default api
