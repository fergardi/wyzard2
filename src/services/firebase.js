import firebase from 'firebase'

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

export const authenticate = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password)
}

export const register = (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password)
}

export const disconnect = () => {
  return auth.signOut()
}
