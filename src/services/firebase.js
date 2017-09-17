import Firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyDHUJ22pxTxUjRtM9eQYZqPYNuvH2cWg3Q',
  authDomain: 'wyzard-14537.firebaseapp.com',
  databaseURL: 'https://wyzard-14537.firebaseio.com',
  projectId: 'wyzard-14537',
  storageBucket: '',
  messagingSenderId: '787291880727'
}

const app = Firebase.initializeApp(config)
const firebase = app.database()

export default firebase

export const auto = function (collection, item) {
  return firebase.ref(collection).child(item).on('child_added', snapshot => {
    return snapshot.val()
  })
}
