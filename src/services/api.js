import { database } from './firebase'

const avarice = (uid) => {
  database.ref('users').child(uid).transaction(user => { // opens transaction
    if (user) {
      console.log('Checking user...')
      // base productions
      let goldPerTurn = 0
      let peoplePerTurn = 0
      let manaPerTurn = 0
      // buildings productions
      database.ref('users').child(uid).child('constructions').once('value', constructions => {
        if (constructions) {
          console.log('Checking buildings...')
          constructions.forEach(building => {
            goldPerTurn += building.val().quantity * building.val().goldProduction
            peoplePerTurn += building.val().quantity * building.val().peopleProduction
            manaPerTurn += building.val().quantity * building.val().manaProduction
          })
        }
      })
      .then(response => {
        // enchantments productions
        database.ref('enchantments').orderByChild('target').equalTo(uid).once('value', enchantments => {
          if (enchantments) {
            console.log('Checking enchantments...')
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
          // heroes productions
          database.ref('users').child(uid).child('contracts').once('value', contracts => {
            if (contracts) {
              console.log('Checking heroes...')
              contracts.forEach(contract => {
                goldPerTurn *= 1 + contract.val().level * contract.val().goldProduction / 100
                peoplePerTurn *= 1 + contract.val().level * contract.val().goldProduction / 100
                manaPerTurn *= 1 + contract.val().level * contract.val().goldProduction / 100
              })
            }
          })
          .then(response => {
            // gods productions
            database.ref('gods').orderByChild('blessed').equalTo(uid).once('value', blessings => {
              if (blessings) {
                console.log('Checking blessings...')
                blessings.forEach(god => {
                  goldPerTurn *= 1 + god.val().goldProduction / 100
                  peoplePerTurn *= 1 + god.val().peopleProduction / 100
                  manaPerTurn *= 1 + god.val().manaProduction / 100
                })
              }
            })
            .then(response => {
              // enchantments negative productions
              database.ref('enchantments').orderByChild('target').equalTo(uid).once('value', enchantments => {
                if (enchantments) {
                  console.log('Checking enchantments...')
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
                // buildings maintenances
                database.ref('users').child(uid).child('constructions').once('value', constructions => {
                  if (constructions) {
                    console.log('Checking buildings...')
                    constructions.forEach(building => {
                      goldPerTurn -= building.val().quantity * building.val().goldMaintenance
                      peoplePerTurn -= building.val().quantity * building.val().peopleMaintenance
                      manaPerTurn -= building.val().quantity * building.val().manaMaintenance
                    })
                  }
                })
                .then(response => {
                  // units maintenances
                  database.ref('users').child(uid).child('troops').once('value', troops => {
                    if (troops) {
                      console.log('Checking units...')
                      troops.forEach(troop => {
                        goldPerTurn -= troop.val().quantity * troop.val().goldMaintenance
                        peoplePerTurn -= troop.val().quantity * troop.val().peopleMaintenance
                        manaPerTurn -= troop.val().quantity * troop.val().manaMaintenance
                      })
                    }
                  })
                  .then(response => {
                    // heroes maintenances
                    database.ref('users').child(uid).child('contracts').once('value', contracts => {
                      if (contracts) {
                        console.log('Checking heroes...')
                        contracts.forEach(contract => {
                          goldPerTurn -= contract.val().level * contract.val().goldMaintenance
                          peoplePerTurn -= contract.val().level * contract.val().peopleMaintenance
                          manaPerTurn -= contract.val().level * contract.val().manaMaintenance
                        })
                      }
                    })
                    .then(response => {
                      // enchantments maintenances
                      database.ref('enchantments').orderByChild('source').equalTo(uid).once('value', enchantments => {
                        if (enchantments) {
                          console.log('Checking enchantments...')
                          enchantments.forEach(enchantment => {
                            goldPerTurn -= enchantment.val().magic * enchantment.val().goldMaintenance
                            peoplePerTurn -= enchantment.val().magic * enchantment.val().peopleMaintenance
                            manaPerTurn -= enchantment.val().magic * enchantment.val().manaMaintenance
                          })
                        }
                      })
                      .then(response => {
                        console.log('Checking results...')
                        user.goldPerTurn = goldPerTurn
                        user.peoplePerTurn = peoplePerTurn
                        user.manaPerTurn = manaPerTurn
                        console.log('Gold this turn: ' + user.gold + ' + ' + user.goldPerTurn + ' = ' + parseInt(user.gold + user.goldPerTurn))
                        console.log('Gold this turn: ' + user.people + ' + ' + user.peoplePerTurn + ' = ' + parseInt(user.people + user.peoplePerTurn))
                        console.log('Gold this turn: ' + user.mana + ' + ' + user.manaPerTurn + ' = ' + parseInt(user.mana + user.manaPerTurn))
                        user.gold += goldPerTurn
                        user.people += peoplePerTurn
                        user.mana += manaPerTurn
                        if (user.gold < 0 || user.people < 0 || user.mana < 0) {
                          // TODO
                        }
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

export const calculate = (uid, turns) => {
  for (let i = 0; i <= turns; i++) {
    console.log('Checking turn ' + i + '...')
    avarice(uid)
  }
}
