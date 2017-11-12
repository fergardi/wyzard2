const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

const TURNS_ADDITION = 1
const MAX_TURNS = 300

/*
exports.avarice = functions.database.ref('/users/{uid}/turns').onUpdate(event => { // when turns are updated
  console.log('User ' + event.data.parent.val().name + ' went from ' + event.data.previous.val() + ' turns to ' + event.data.current.val())
  return true
})
*/

// add artifact to user
const addArtifactToUser = (uid, name, quantity = 1) => {
  name = name.includes('lbl_artifact_') ? name : 'lbl_artifact_' + name
  return admin.database().ref('artifacts').child(name.replace('lbl_artifact_', '')).once('value', async artifact => {
    if (artifact) {
      await admin.database().ref('users').child(uid).child('relics').orderByChild('name').equalTo(name).once('value', async relics => {
        if (relics && relics.hasChildren()) {
          relics.forEach(relic => {
            admin.database().ref('users').child(uid).child('relics').child(relic.key).update({ quantity: relic.val().quantity + quantity })
          })
        } else {
          let relic = {...artifact.val()}
          relic.quantity = quantity
          delete relic['.key']
          await admin.database().ref('users').child(uid).child('relics').push(relic)
        }
      })
    }
  })
}

// add hero to user
const addHeroToUser = (uid, name, level = 3) => {
  name = name.includes('lbl_hero_') ? name : 'lbl_hero_' + name
  return admin.database().ref('heroes').child(name.replace('lbl_hero_', '')).once('value', async hero => {
    if (hero) {
      await admin.database().ref('users').child(uid).child('contracts').orderByChild('name').equalTo(name).once('value', async contracts => {
        if (contracts && contracts.hasChildren()) {
          contracts.forEach(contract => {
            contract.ref.remove()
          })
        }
        let contract = {...hero.val()}
        contract.level = level
        delete contract['.key']
        await admin.database().ref('users').child(uid).child('contracts').push(contract)
      })
    }
  })
}

// https://cron-job.org
// https://us-central1-wyzard-14537.cloudfunctions.net/avarice
// creates new auctions
exports.avarice = functions.https.onRequest((req, res) => {
  if (req.method === 'GET') {
    // artifact
    admin.database().ref('artifacts').once('value', artifacts => {
      if (artifacts && artifacts.hasChildren()) {
        let auctions = []
        artifacts.forEach(artifact => {
          let auction = Object.assign({}, artifact.val()) // {...artifact.val()}
          auction.quantity = 1
          auction.timestamp = Date.now() + 1000 * 60 * 60 * Math.floor(Math.random() * (48 - 24 + 1) + 24)
          delete auction['.key']
          auctions.push(auction)
        })
        // random
        const index = Math.floor(Math.random() * auctions.length)
        admin.database().ref('auctions').push(auctions[index])
      }
    })
    // contract
    admin.database().ref('heroes').once('value', heroes => {
      if (heroes && heroes.hasChildren()) {
        let contracts = []
        heroes.forEach(hero => {
          let contract = Object.assign({}, hero.val()) // {...hero.val()}
          contract.level = Math.floor(Math.random() * 5) + 1
          contract.timestamp = Date.now() + 1000 * 60 * 60 * Math.floor(Math.random() * (48 - 24 + 1) + 24)
          delete contract['.key']
          contracts.push(contract)
        })
        // random
        const index = Math.floor(Math.random() * contracts.length)
        admin.database().ref('tavern').push(contracts[index])
      }
    })
    res.status(200).send()
  } else {
    res.status(404).send()
  }
})

// https://cron-job.org
// https://us-central1-wyzard-14537.cloudfunctions.net/generosity
// update user turns and check auction expirations
exports.generosity = functions.https.onRequest((req, res) => {
  if (req.method === 'GET') {
    // check artifact auctions finished
    admin.database().ref('auctions').once('value', auctions => {
      auctions.forEach(auction => {
        let auc = auction.val()
        if (auc.timestamp <= Date.now()) {
          if (auc.bidder) {
            addArtifactToUser(auc.bidder, auc.name)
          }
          auction.ref.remove()
        }
      })
    })
    // check hero contracts finished
    admin.database().ref('tavern').once('value', contracts => {
      contracts.forEach(contract => {
        let con = contract.val()
        if (con.timestamp <= Date.now()) {
          if (con.bidder) {
            addHeroToUser(con.bidder, con.name)
          }
          contract.ref.remove()
        }
      })
    })
    // check user turns
    admin.database().ref('users').once('value', users => {
      users.forEach(user => {
        user.ref.child('turns').set(Math.min(MAX_TURNS, user.child('turns').val() + TURNS_ADDITION))
      })
    })
    res.status(200).send()
  } else {
    res.status(404).send()
  }
})
