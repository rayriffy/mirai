import { initializeApp, getApp, getApps } from 'firebase/app'
import { AppCheck, initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

export const createFirebaseInstance = () => {
  if (!getApps().length) {
    const app = initializeApp({
      apiKey: 'AIzaSyCQPV-Jt5-TnMVy-qaVpqjFAWsK7HyNWR0',
      authDomain: 'mirai-da346.firebaseapp.com',
      projectId: 'mirai-da346',
      storageBucket: 'mirai-da346.appspot.com',
      messagingSenderId: '721530926',
      appId: '1:721530926:web:b6765b7614fb3b4046efbf',
      measurementId: 'G-VK0WGTLSDK',
      databaseURL: 'https://mirai-da346-default-rtdb.asia-southeast1.firebasedatabase.app'
    })

    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider('6LdwJrUeAAAAAG_aFR4xoJMHK-MY_KVkJE_HiVpy'),
      isTokenAutoRefreshEnabled: true
    })

    return appCheck
  } else {
    const app = getApp()

    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider('6LdwJrUeAAAAAG_aFR4xoJMHK-MY_KVkJE_HiVpy'),
      isTokenAutoRefreshEnabled: true
    })
    return appCheck
  }
}
