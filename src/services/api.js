import { database } from './firebase'
import store from '../vuex/store'

let goldPerTurn = 0
let peoplePerTurn = 0
let manaPerTurn = 0
let terrainPerTurn = 0

const increaseBuildingQuantity = (uid, id, quantity) => { // eslint-disable-line
  return database.ref('users').child(uid).child('constructions').child(id).transaction(construction => {
    if (construction) {
      construction.quantity += parseInt(quantity)
    }
    return construction
  })
}

const checkBuildingsProduction = (uid) => {
  return database.ref('users').child(uid).child('constructions').once('value', constructions => {
    if (constructions) {
      // console.log('Checking buildings production...')
      constructions.forEach(building => {
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
      // console.log('Checking praises production...')
      enchantments.forEach(praise => {
        if (praise.val().support) {
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
      // console.log('Checking heroes production...')
      contracts.forEach(contract => {
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
      // console.log('Checking blessings production...')
      blessings.forEach(god => {
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
      // console.log('Checking curses production...')
      enchantments.forEach(enchantment => {
        enchantment.ref.transaction(curse => {
          if (curse) {
            if (!curse.support) {
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
                        construction.ref.transaction(cons => {
                          if (cons) cons.quantity -= quantity
                          return cons
                        })
                        database.ref('users').child(uid).child('constructions').orderByChild('buildable').equalTo(false).once('value', terrains => {
                          if (terrains) {
                            terrains.forEach(terrain => {
                              terrain.ref.transaction(terr => {
                                if (terr) terr.quantity += quantity
                                return terr
                              })
                            })
                          }
                          return terrains
                        })
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
      // console.log('Checking buildings maintenance...')
      constructions.forEach(building => {
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
      // console.log('Checking units maintenance...')
      troops.forEach(troop => {
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
      // console.log('Checking heroes maintenance...')
      contracts.forEach(contract => {
        contract.ref.transaction(hero => {
          if (hero) {
            goldPerTurn -= hero.level * hero.goldMaintenance
            peoplePerTurn -= hero.level * hero.goldMaintenance
            manaPerTurn -= hero.level * hero.goldMaintenance
            hero.invested++
            if (hero.invested >= hero.level * hero.experience) {
              hero.level++
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
      // console.log('Checking enchantments maintenance...')
      enchantments.forEach(enchantment => {
        goldPerTurn -= enchantment.val().magic * enchantment.val().goldMaintenance
        peoplePerTurn -= enchantment.val().magic * enchantment.val().peopleMaintenance
        manaPerTurn -= enchantment.val().magic * enchantment.val().manaMaintenance
      })
    }
  })
}

const checkMaintenances = async (uid) => {
  // base productions
  goldPerTurn = 0
  peoplePerTurn = 0
  manaPerTurn = 0
  terrainPerTurn = 0
  // individual checks
  await checkBuildingsProduction(uid)
  await checkHeroesProduction(uid)
  await checkEnchantmentsProduction(uid)
  await checkGodsProduction(uid)
  await checkCursesProduction(uid)
  await checkBuildingsMaintenance(uid)
  await checkHeroesMaintenance(uid)
  await checkEnchantmentsMaintenance(uid)
  await checkUnitsMaintenance(uid)
  database.ref('users').child(uid).transaction(user => { // opens transaction
    if (user) {
      // global balance
      user.goldPerTurn = Math.floor(goldPerTurn)
      user.peoplePerTurn = Math.floor(peoplePerTurn)
      user.manaPerTurn = Math.floor(manaPerTurn)
      user.terrainPerTurn = terrainPerTurn
      user.gold += goldPerTurn
      user.people += peoplePerTurn
      user.mana += manaPerTurn
      if (user.gold < 0) {
        // TODO DISBAND
        user.gold = 0
        return user
      }
      if (user.people < 0) {
        // TODO DISBAND
        user.people = 0
        return user
      }
      if (user.mana < 0) {
        // TODO DISBAND
        user.mana = 0
        return user
      }
    }
    return user
  })
}

export const calculate = (uid, turns) => {
  for (let i = 0; i < turns; i++) {
    checkMaintenances(uid)
  }
}
