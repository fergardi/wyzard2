import { database } from './firebase'
import store from '../vuex/store'

// globals
let goldPerTurn = 0
let peoplePerTurn = 0
let manaPerTurn = 0
let terrainPerTurn = 0
let gold = 0
let people = 0
let mana = 0

const checkBuildingsProduction = (uid) => {
  return database.ref('users').child(uid).child('constructions').once('value', constructions => {
    if (constructions) {
      constructions.forEach(building => {
        // console.log('Checking building production... ' + building.val().name)
        goldPerTurn += building.val().quantity * building.val().goldProduction
        peoplePerTurn += building.val().quantity * building.val().peopleProduction
        manaPerTurn += building.val().quantity * building.val().manaProduction
      })
    }
  })
}

const checkEnchantmentsProduction = (uid) => {
  return database.ref('enchantments').orderByChild('target').equalTo(uid).once('value', enchantments => {
    if (enchantments) {
      enchantments.forEach(praise => {
        if (praise.val().support) {
          // console.log('Checking enchantment production... ' + praise.val().name)
          goldPerTurn *= (1 + praise.val().magic * praise.val().goldProduction / 100)
          peoplePerTurn *= (1 + praise.val().magic * praise.val().peopleProduction / 100)
          manaPerTurn *= (1 + praise.val().magic * praise.val().manaProduction / 100)
        }
      })
    }
  })
}

const checkHeroesProduction = (uid) => {
  return database.ref('users').child(uid).child('contracts').once('value', contracts => {
    if (contracts) {
      contracts.forEach(contract => {
        // console.log('Checking hero production... ' + contract.val().name)
        goldPerTurn *= 1 + contract.val().level * contract.val().goldProduction / 100
        peoplePerTurn *= 1 + contract.val().level * contract.val().peopleProduction / 100
        manaPerTurn *= 1 + contract.val().level * contract.val().manaProduction / 100
      })
    }
  })
}

const checkGodsProduction = (uid) => {
  return database.ref('gods').orderByChild('blessed').equalTo(uid).once('value', blessings => {
    if (blessings) {
      blessings.forEach(god => {
        // console.log('Checking god production... ' + god.val().name)
        goldPerTurn *= 1 + god.val().goldProduction / 100
        peoplePerTurn *= 1 + god.val().peopleProduction / 100
        manaPerTurn *= 1 + god.val().manaProduction / 100
      })
    }
  })
}

const checkCursesProduction = (uid) => {
  return database.ref('enchantments').orderByChild('target').equalTo(uid).once('value', enchantments => {
    if (enchantments) {
      enchantments.forEach(enchantment => {
        enchantment.ref.transaction(curse => {
          if (curse) {
            if (!curse.support) {
              // console.log('Checking enchantment negative production... ' + curse.name)
              goldPerTurn *= (1 + curse.magic * curse.goldProduction / 100)
              peoplePerTurn *= (1 + curse.magic * curse.peopleProduction / 100)
              manaPerTurn *= (1 + curse.magic * curse.manaProduction / 100)
              if (curse.terrain < 0) {
                terrainPerTurn = curse.magic * curse.terrain
                database.ref('users').child(uid).child('constructions').orderByChild('buildable').equalTo(true).once('value', constructions => {
                  if (constructions) {
                    let random = Math.floor(Math.random() * constructions.numChildren())
                    let index = 0
                    constructions.forEach(construction => {
                      index++
                      if (random === index) {
                        let quantity = Math.max(construction.val().quantity, Math.abs(curse.magic * curse.terrain))
                        if (quantity > 0) {
                          construction.ref.transaction(cons => {
                            if (cons) cons.quantity = Math.max(0, quantity)
                            return cons
                          })
                          database.ref('users').child(uid).child('constructions').orderByChild('buildable').equalTo(false).once('value', terrains => {
                            if (terrains) {
                              terrains.forEach(terrain => {
                                terrain.ref.transaction(terr => {
                                  if (terr) {
                                    terr.quantity += quantity
                                    database.ref('users').child(uid).update({ terrain: terr.quantity })
                                  }
                                  return terr
                                })
                              })
                            }
                            return terrains
                          })
                        }
                        return constructions
                      }
                    })
                  }
                  return constructions
                })
              }
            }
            curse.remaining--
            if (curse.remaining <= 0) {
              // console.log('Enchantment finished... ' + curse.name)
              store.commit('info', 'lbl_toast_enchantment_finished')
              return null // expired
            }
          }
          return curse
        })
      })
    }
  })
}

const checkBuildingsMaintenance = (uid) => {
  return database.ref('users').child(uid).child('constructions').once('value', constructions => {
    if (constructions) {
      constructions.forEach(building => {
        // console.log('Checking building maintenance... ' + building.val().name)
        goldPerTurn -= building.val().quantity * building.val().goldMaintenance
        peoplePerTurn -= building.val().quantity * building.val().peopleMaintenance
        manaPerTurn -= building.val().quantity * building.val().manaMaintenance
      })
    }
  })
}

const checkUnitsMaintenance = (uid) => {
  return database.ref('users').child(uid).child('troops').once('value', troops => {
    if (troops) {
      troops.forEach(troop => {
        // console.log('Checking unit maintenance... ' + troop.val().name)
        goldPerTurn -= troop.val().quantity * troop.val().goldMaintenance
        peoplePerTurn -= troop.val().quantity * troop.val().peopleMaintenance
        manaPerTurn -= troop.val().quantity * troop.val().manaMaintenance
      })
    }
  })
}

const checkHeroesMaintenance = (uid) => {
  return database.ref('users').child(uid).child('contracts').once('value', contracts => {
    if (contracts) {
      contracts.forEach(contract => {
        contract.ref.transaction(hero => {
          if (hero) {
            // console.log('Checking hero maintenance... ' + hero.name)
            goldPerTurn -= hero.level * hero.goldMaintenance
            peoplePerTurn -= hero.level * hero.goldMaintenance
            manaPerTurn -= hero.level * hero.goldMaintenance
            hero.invested++
            if (hero.invested >= hero.level * hero.experience) {
              // console.log('Hero leveled up... ' + hero.name)
              hero.level++
              hero.invested = 0
              store.commit('info', 'lbl_toast_hero_levelup')
            }
          }
          return hero
        })
      })
    }
  })
}

const checkEnchantmentsMaintenance = (uid) => {
  return database.ref('enchantments').orderByChild('source').equalTo(uid).once('value', enchantments => {
    if (enchantments) {
      enchantments.forEach(enchantment => {
        // console.log('Checking enchantment maintenance... ' + enchantment.val().name)
        goldPerTurn -= enchantment.val().magic * enchantment.val().goldMaintenance
        peoplePerTurn -= enchantment.val().magic * enchantment.val().peopleMaintenance
        manaPerTurn -= enchantment.val().magic * enchantment.val().manaMaintenance
      })
    }
  })
}

const checkEnchantmentsAffordance = (uid) => {
  return database.ref('enchantments').orderByChild('source').equalTo(uid).once('value', enchantments => {
    if (enchantments) {
      enchantments.forEach(enchantment => {
        // console.log('Checking enchantment affordance... ' + enchantment.val().name)
        if ((gold < 0 && enchantment.val().goldMaintenance > 0) || (people < 0 && enchantment.val().peopleMaintenance > 0) || (mana < 0 && enchantment.val().manaMaintenance > 0)) {
          // console.log('Cant afford ' + enchantment.val().name + ', breaking it...')
          enchantment.ref.remove()
          store.commit('error', 'lbl_toast_enchantment_broken')
          return true
        }
      })
    }
  })
}

const checkHeroesAffordance = (uid) => {
  return database.ref('users').child(uid).child('contracts').once('value', contracts => {
    if (contracts) {
      contracts.forEach(contract => {
        // console.log('Checking hero affordance... ' + contract.val().name)
        if ((gold < 0 && contract.val().goldMaintenance > 0) || (people < 0 && contract.val().peopleMaintenance > 0) || (mana < 0 && contract.val().manaMaintenance > 0)) {
          // console.log('Cant afford ' + contract.val().name + ', firing it...')
          contract.ref.remove()
          store.commit('error', 'lbl_toast_hero_resigned')
          return true
        }
      })
    }
  })
}

const checkUnitsAffordance = (uid) => {
  return database.ref('users').child(uid).child('troops').once('value', troops => {
    if (troops) {
      troops.forEach(troop => {
        // console.log('Checking unit affordance... ' + troop.val().name)
        if ((gold < 0 && troop.val().goldMaintenance > 0) || (people < 0 && troop.val().peopleMaintenance > 0) || (mana < 0 && troop.val().manaMaintenance > 0)) {
          // console.log('Cant afford ' + troop.val().name + ', disbanding it...')
          troop.ref.remove()
          store.commit('error', 'lbl_toast_unit_disbanded')
          return true
        }
      })
    }
  })
}

const checkMaintenances = async (uid) => {
  // base
  goldPerTurn = 0
  peoplePerTurn = 0
  manaPerTurn = 0
  terrainPerTurn = 0
  gold = 0
  people = 0
  mana = 0
  // checks
  await checkBuildingsProduction(uid)
  await checkHeroesProduction(uid)
  await checkEnchantmentsProduction(uid)
  await checkGodsProduction(uid)
  await checkCursesProduction(uid)
  await checkBuildingsMaintenance(uid)
  await checkHeroesMaintenance(uid)
  await checkEnchantmentsMaintenance(uid)
  await checkUnitsMaintenance(uid)
  // update
  await database.ref('users').child(uid).transaction(user => { // opens transaction
    if (user) {
      user.goldPerTurn = Math.floor(goldPerTurn)
      user.peoplePerTurn = Math.floor(peoplePerTurn)
      user.manaPerTurn = Math.floor(manaPerTurn)
      user.terrainPerTurn = terrainPerTurn
      user.gold += goldPerTurn
      user.people += peoplePerTurn
      user.mana += manaPerTurn
      gold = user.gold
      // console.log('Gold this turn... ' + gold)
      people = user.people
      // console.log('People this turn... ' + people)
      mana = user.mana
      // console.log('Mana this turn... ' + mana)
      user.turns = Math.max(0, user.turns--)
    }
    return user
  })
  await checkUnitsAffordance(uid)
  await checkEnchantmentsAffordance(uid)
  await checkHeroesAffordance(uid)
  await database.ref('users').child(uid).transaction(user => {
    if (user) {
      user.gold = Math.max(0, user.gold)
      user.people = Math.max(0, user.people)
      user.mana = Math.max(0, user.mana)
    }
    return user
  })
}

export const checkTurnMaintenances = async (uid, turns) => {
  let iterations = [...Array(turns).keys()]
  for (let iteration of iterations) { // eslint-disable-line
    // console.log('Checking maintenances in turn ' + iteration + '/' + turns)
    await checkMaintenances(uid)
  }
}
