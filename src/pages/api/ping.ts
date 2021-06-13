import { NextApiHandler } from 'next'

const api: NextApiHandler = async (req, res) => {
  return res.send("pong")
}

export default api
