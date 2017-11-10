var firebase = require('firebase/app')
require('firebase/auth')
require('firebase/database')
// require('firebase/messaging')

const identifier = 'wyzard-14537'

const config = {
  apiKey: 'AIzaSyDHUJ22pxTxUjRtM9eQYZqPYNuvH2cWg3Q',
  authDomain: `${identifier}.firebaseapp.com`,
  databaseURL: `https://${identifier}.firebaseio.com`,
  projectId: `${identifier}`,
  storageBucket: '',
  messagingSenderId: '787291880727'
}

const app = firebase.initializeApp(config)

export const storage = `https://firebasestorage.googleapis.com/v0/b/${identifier}.appspot.com/o`

export const database = app.database()

export const auth = app.auth()

export const unregister = () => {
  return auth.currentUser.delete()
}

// export const messaging = firebase.messaging()

export const authenticate = (email, password, remember = false) => {
  let persistence = remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION
  return auth.setPersistence(persistence).then(async () => {
    await auth.signInWithEmailAndPassword(email, password)
  })
}

export const register = (email, password, remember = false) => {
  let persistence = remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION
  return auth.setPersistence(persistence).then(async () => {
    await auth.createUserWithEmailAndPassword(email, password)
  })
}

export const disconnect = () => {
  return auth.signOut()
}
