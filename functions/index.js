const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

exports.logger = functions.database.ref('users')
.onWrite(event => {
  return false
})
