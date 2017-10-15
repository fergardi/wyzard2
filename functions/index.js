const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

exports.avarice = functions.database.ref('/users/{uid}/turns').onUpdate(event => { // when turns are updated
  let from = event.data.previous.val()
  let to = event.data.current.val()
  admin.database().ref('users').child(event.params.uid).once('value', user => {
    if (user) {
      console.log('User ' + user.val().name + ' went from ' + from + ' turns to ' + to)
    }
  })
  return true
})

// https://cron-job.org
// firebase functions:config:set cron.key="passphrase"
// https://us-central1-wyzard-14537.cloudfunctions.net/generosity?key=passphrase
exports.generosity = functions.https.onRequest((req, res) => {
  if (req.method === 'GET') {
    admin.database().ref('users').once('value', snapshot => {
      snapshot.forEach(user => {
        user.ref.child('turns').set(Math.min(300, user.child('turns').val() + 1))
      })
    })
    res.status(200).send()
  } else {
    res.status(404).send()
  }
})
