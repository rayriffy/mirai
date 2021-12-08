import { FaApple, FaFacebook, FaGoogle } from 'react-icons/fa'
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
} from 'firebase/auth'

export const ssoProviders = [
  {
    id: 'facebook',
    provider: new FacebookAuthProvider(),
    Icon: FaFacebook,
  },
  {
    id: 'apple',
    provider: new OAuthProvider('apple.com'),
    Icon: FaApple,
  },
  {
    id: 'google',
    provider: new GoogleAuthProvider(),
    Icon: FaGoogle,
  },
]
