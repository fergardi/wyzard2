const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

exports.logger = functions.database.ref('users')
.onWrite(event => {
  let log = {
    name: 'cucu',
    timestamp: Date.now()
  }
  return event.data.ref.parent.child('logs').push(log)
})
