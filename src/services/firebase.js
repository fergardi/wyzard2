var firebase = require('firebase/app')
require('firebase/auth')
require('firebase/database')
// require('firebase/messaging')

var config = {
  apiKey: 'AIzaSyDHUJ22pxTxUjRtM9eQYZqPYNuvH2cWg3Q',
  authDomain: 'wyzard-14537.firebaseapp.com',
  databaseURL: 'https://wyzard-14537.firebaseio.com',
  projectId: 'wyzard-14537',
  storageBucket: '',
  messagingSenderId: '787291880727'
}

const app = firebase.initializeApp(config)

export const database = app.database()

export const auth = app.auth()

// export const messaging = firebase.messaging()

export const authenticate = (email, password, remember) => {
  let persistence = remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION
  return auth.setPersistence(persistence).then(async () => {
    await auth.signInWithEmailAndPassword(email, password)
  })
}

export const register = (email, password, remember) => {
  let persistence = remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION
  return auth.setPersistence(persistence).then(async () => {
    await auth.createUserWithEmailAndPassword(email, password)
  })
}

export const disconnect = () => {
  return auth.signOut()
}
