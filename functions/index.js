const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

const calculate = (uid) => {
  // DEV ONLY
  admin.database().ref('users').child(uid).transaction(user => {
    if (user) {
      // base
      let goldPerTurn = 0
      let peoplePerTurn = 0
      let manaPerTurn = 0
      // constructions
      admin.database().ref('users').child(uid).child('constructions').once('value', constructions => {
        if (constructions) {
          constructions.forEach(building => {
            goldPerTurn += building.val().quantity * building.val().goldProduction
            peoplePerTurn += building.val().quantity * building.val().peopleProduction
            manaPerTurn += building.val().quantity * building.val().manaProduction
          })
        }
      })
      .then(response => {
        // enchantments
        admin.database().ref('enchantments').orderByChild('target').equalTo(uid).once('value', enchantments => {
          if (enchantments) {
            enchantments.forEach(enchantment => {
              if (enchantment.val().support) {
                goldPerTurn *= (1 + enchantment.val().magic * enchantment.val().goldProduction / 100)
                peoplePerTurn *= (1 + enchantment.val().magic * enchantment.val().peopleProduction / 100)
                manaPerTurn *= (1 + enchantment.val().magic * enchantment.val().manaProduction / 100)
              }
            })
          }
        })
        .then(response => {
          // contracts
          admin.database().ref('users').child(uid).child('contracts').once('value', contracts => {
            if (contracts) {
              contracts.forEach(contract => {
                goldPerTurn *= 1 + contract.val().level * contract.val().goldProduction / 100
                peoplePerTurn *= 1 + contract.val().level * contract.val().goldProduction / 100
                manaPerTurn *= 1 + contract.val().level * contract.val().goldProduction / 100
              })
            }
          })
          .then(response => {
            // blessings
            admin.database().ref('gods').orderByChild('blessed').equalTo(uid).once('value', blessings => {
              if (blessings) {
                blessings.forEach(god => {
                  goldPerTurn *= 1 + god.val().goldProduction / 100
                  peoplePerTurn *= 1 + god.val().peopleProduction / 100
                  manaPerTurn *= 1 + god.val().manaProduction / 100
                })
              }
            })
            .then(response => {
              // enchantments
              admin.database().ref('enchantments').orderByChild('target').equalTo(uid).once('value', enchantments => {
                if (enchantments) {
                  enchantments.forEach(enchantment => {
                    if (!enchantment.val().support) {
                      goldPerTurn *= (1 + enchantment.val().magic * enchantment.val().goldProduction / 100)
                      peoplePerTurn *= (1 + enchantment.val().magic * enchantment.val().peopleProduction / 100)
                      manaPerTurn *= (1 + enchantment.val().magic * enchantment.val().manaProduction / 100)
                    }
                  })
                }
              })
              .then(response => {
                // constructions
                admin.database().ref('users').child(uid).child('constructions').once('value', constructions => {
                  if (constructions) {
                    constructions.forEach(building => {
                      goldPerTurn -= building.val().quantity * building.val().goldMaintenance
                      peoplePerTurn -= building.val().quantity * building.val().peopleMaintenance
                      manaPerTurn -= building.val().quantity * building.val().manaMaintenance
                    })
                  }
                })
                .then(response => {
                  // troops
                  admin.database().ref('users').child(uid).child('troops').once('value', troops => {
                    if (troops) {
                      troops.forEach(troop => {
                        goldPerTurn -= troop.val().quantity * troop.val().goldMaintenance
                        peoplePerTurn -= troop.val().quantity * troop.val().peopleMaintenance
                        manaPerTurn -= troop.val().quantity * troop.val().manaMaintenance
                      })
                    }
                  })
                  .then(response => {
                    // contracts outcome
                    admin.database().ref('users').child(uid).child('contracts').once('value', contracts => {
                      if (contracts) {
                        contracts.forEach(contract => {
                          goldPerTurn -= contract.val().level * contract.val().goldMaintenance
                          peoplePerTurn -= contract.val().level * contract.val().peopleMaintenance
                          manaPerTurn -= contract.val().level * contract.val().manaMaintenance
                        })
                      }
                    })
                    .then(response => {
                      // enchantments
                      admin.database().ref('enchantments').orderByChild('source').equalTo(uid).once('value', enchantments => {
                        if (enchantments) {
                          enchantments.forEach(enchantment => {
                            goldPerTurn -= enchantment.val().magic * enchantment.val().goldMaintenance
                            peoplePerTurn -= enchantment.val().magic * enchantment.val().peopleMaintenance
                            manaPerTurn -= enchantment.val().magic * enchantment.val().manaMaintenance
                          })
                        }
                      })
                      .then(response => {
                        user.gold += goldPerTurn
                        user.people += peoplePerTurn
                        user.mana += manaPerTurn
                        user.goldPerTurn = goldPerTurn
                        user.peoplePerTurn = peoplePerTurn
                        user.manaPerTurn = manaPerTurn
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    }
    return user
  })
}

exports.avarice = functions.admin.database().ref('/users/{uid}/turns').onUpdate(event => { // when turns are updated
  let from = event.data.previous.val()
  let to = event.data.previous.val()
  if (from > to) {
    console.log('User ' + event.ref.parent.val().name + ' went from ' + event.data.previous.val() + ' turns to ' + event.data.current.val())
    for (let i = from; i <= to; i++) {
      calculate(event.params.uid)
    }
  }
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
