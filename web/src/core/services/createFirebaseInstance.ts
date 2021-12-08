import { initializeApp, getApp, getApps } from 'firebase/app'

export const createFirebaseInstance = () => {
  const appInstance = !getApps().length
    ? initializeApp({
        apiKey: 'AIzaSyCQPV-Jt5-TnMVy-qaVpqjFAWsK7HyNWR0',
        authDomain: 'mirai-da346.firebaseapp.com',
        projectId: 'mirai-da346',
        storageBucket: 'mirai-da346.appspot.com',
        messagingSenderId: '721530926',
        appId: '1:721530926:web:b6765b7614fb3b4046efbf',
        measurementId: 'G-VK0WGTLSDK',
      })
    : getApp()

  return appInstance
}
