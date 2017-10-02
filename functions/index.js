const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
.onWrite(event => {
  // Grab the current value of what was written to the Realtime Database.
  const original = event.data.val()
  console.log('Uppercasing', event.params.pushId, original)
  const uppercase = original.toUpperCase()
  return event.data.ref.parent.child('uppercase').set(uppercase)
})
