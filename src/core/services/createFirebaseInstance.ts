import { initializeApp, getApp, getApps } from 'firebase/app'

export const createFirebaseInstance = () => {
  const appInstance = !getApps().length
    ? initializeApp({
        apiKey: 'AIzaSyCBJc4r9dsp0o1IP_RtnjbuFKbBPzU5gPs',
        authDomain: 'mirai-ee873.firebaseapp.com',
        projectId: 'mirai-ee873',
        storageBucket: 'mirai-ee873.appspot.com',
        messagingSenderId: '1034441026438',
        appId: '1:1034441026438:web:3fb0574eb413fa7f2a1a07',
        measurementId: 'G-GQ1KHNYT58',
      })
    : getApp()

  return appInstance
}
