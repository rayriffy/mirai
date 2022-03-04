import axios from 'axios'

import { AppCheckTokenResult, getToken } from 'firebase/app-check'
import { User } from 'firebase/auth'
import { createFirebaseInstance } from './createFirebaseInstance'

export const createApiInstance = async (user: User) => {
  const token = await user.getIdToken()

  let appCheckTokenResponse: AppCheckTokenResult | { token: string } = { token: '' }
  try {
      appCheckTokenResponse = await getToken(createFirebaseInstance())
  } catch (err) {
  }

  return axios.create({
    headers: {
      'X-Firebase-AppCheck': appCheckTokenResponse.token,
      authorization: `Bearer ${token}`,
    },
  })
}
