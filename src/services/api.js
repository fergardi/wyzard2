import { database } from './firebase'
import store from '../vuex/store'

// globals
let goldPerTurn = 0
let peoplePerTurn = 0
let manaPerTurn = 0
let terrainPerTurn = 0
let peopleCap = 0
let manaCap = 0
let armyCap = 0
let army = 0
let gold = 0
let people = 0
let mana = 0
let power = 0
let terrain = 0
let disbanded = false
let deserted = false
let dispeled = false

// check maintenances
  // check terrain production - destruction
  // check building production - maintenance
  // check hero production - maintenance
  // check enchantment on myself production
  // check enchantment owned by me maintenance
  // check unit maintenance
  // check god production
  // check unit affordance
  // check enchantment affordance
  // check hero affordance

// check terrain production - destruction
const checkTerrainProductionDestruction = (uid) => {
  return database.ref('enchantments').orderByChild('target').equalTo(uid).once('value', enchantments => {
    if (enchantments && enchantments.hasChildren()) {
      enchantments.forEach(enchantment => {
        enchantment.ref.transaction(curse => {
          // console.log('Checking terrain production and destruction... ' + curse.name)
          terrainPerTurn += curse.magic * curse.terrainProduction
          if (curse.terrainProduction > 0) {
            database.ref('users').child(uid).child('constructions').orderByChild('buildable').equalTo(false).once('value', terrains => {
              if (terrains && terrains.hasChildren()) {
                terrains.forEach(terrain => {
                  let lands = terrain.val()
                  // console.log('Winning terrain... ', curse.magic * curse.terrainProduction)
                  terrain.ref.update({ quantity: lands.quantity + curse.magic * curse.terrainProduction })
                  database.ref('users').child(uid).update({ terrain: lands.quantity + curse.magic * curse.terrainProduction })
                })
              }
            })
          } else if (curse.terrainProduction < 0) {
            database.ref('users').child(uid).child('constructions').orderByChild('buildable').equalTo(true).once('value', constructions => {
              if (constructions && constructions.hasChildren()) {
                let random = Math.floor(Math.random() * constructions.numChildren())
                let index = 0
                constructions.forEach(construction => {
                  let building = construction.val()
                  if (random === index) {
                    let quantity = Math.min(building.quantity, Math.abs(curse.magic * curse.terrainProduction))
                    if (quantity !== 0) {
                      // console.log('Losing terrain... ', curse.magic * curse.terrainProduction)
                      construction.ref.update({ quantity: Math.max(0, building.quantity - quantity) })
                      database.ref('users').child(uid).child('constructions').orderByChild('name').equalTo('lbl_building_terrain').once('value', terrains => {
                        if (terrains && terrains.hasChildren()) {
                          terrains.forEach(terrain => {
                            let lands = terrain.val()
                            terrain.ref.update({ quantity: lands.quantity + quantity })
                            database.ref('users').child(uid).update({ terrain: lands.quantity + quantity })
                          })
                        }
                      })
                    }
                  }
                  index++
                })
              }
            })
          }
          curse.remaining--
          if (curse.remaining <= 0) {
            // console.log('Enchantment finished... ' + curse.name)
            store.commit('info', 'lbl_toast_enchantment_finished')
            return null
          }
          return curse
        })
      })
    }
  })
}

// check building production - maintenance
const checkBuildingsProductionMaintenance = (uid) => {
  return database.ref('users').child(uid).child('constructions').once('value', constructions => {
    if (constructions && constructions.hasChildren()) {
      constructions.forEach(construction => {
        let building = construction.val()
        // console.log('Checking building production and maintenances... ' + building.name)
        goldPerTurn += building.quantity * (building.goldProduction - building.goldMaintenance)
        peoplePerTurn += building.quantity * (building.peopleProduction - building.peopleMaintenance)
        manaPerTurn += building.quantity * (building.manaProduction - building.manaMaintenance)
        peopleCap += building.quantity * building.peopleCap
        manaCap += building.quantity * building.manaCap
        armyCap += building.quantity * building.armyCap
        power += building.quantity * building.power
        if (building.name === 'lbl_building_terrain') {
          terrain = building.quantity
        }
        // console.log(goldPerTurn, peoplePerTurn, manaPerTurn)
      })
    }
  })
}

// check hero production - maintenance
const checkHeroesProductionMaintenance = (uid) => {
  return database.ref('users').child(uid).child('contracts').once('value', contracts => {
    if (contracts && contracts.hasChildren()) {
      contracts.forEach(contract => {
        contract.ref.transaction(hero => {
          // console.log('Checking hero production and maintenances... ' + hero.name)
          if (hero.invested++ >= hero.level * hero.experience) {
            // console.log('Hero leveled up... ' + hero.name)
            hero.level++
            hero.invested = 0
            store.commit('info', 'lbl_toast_hero_levelup')
          }
          goldPerTurn += hero.level * (hero.goldProduction - hero.goldMaintenance)
          peoplePerTurn += hero.level * (hero.peopleProduction - hero.peopleMaintenance)
          manaPerTurn += hero.level * (hero.manaProduction - hero.manaMaintenance)
          power += hero.level * hero.power
          // console.log(goldPerTurn, peoplePerTurn, manaPerTurn)
          return hero
        })
      })
    }
  })
}

// check enchantment on myself production
const checkEnchantmentsProduction = (uid) => {
  return database.ref('enchantments').orderByChild('target').equalTo(uid).once('value', enchantments => {
    if (enchantments && enchantments.hasChildren()) {
      enchantments.forEach(enchantment => {
        let spell = enchantment.val()
        // console.log('Checking enchantment production... ' + spell.name)
        goldPerTurn += spell.magic * spell.goldProduction
        peoplePerTurn += spell.magic * spell.peopleProduction
        manaPerTurn += spell.magic * spell.manaProduction
        if (spell.source === spell.target === uid) {
          power += spell.magic * spell.power
        }
        // console.log(goldPerTurn, peoplePerTurn, manaPerTurn)
      })
    }
  })
}

// check enchantment owned by me maintenance
const checkEnchantmentsMaintenance = (uid) => {
  return database.ref('enchantments').orderByChild('source').equalTo(uid).once('value', enchantments => {
    if (enchantments && enchantments.hasChildren()) {
      enchantments.forEach(enchantment => {
        let enchant = enchantment.val()
        // console.log('Checking enchantment maintenance... ' + enchant.name, enchant.goldMaintenance, enchant.peopleMaintenance, enchant.manaMaintenance)
        goldPerTurn -= enchant.magic * enchant.goldMaintenance
        peoplePerTurn -= enchant.magic * enchant.peopleMaintenance
        manaPerTurn -= enchant.magic * enchant.manaMaintenance
        // console.log(goldPerTurn, peoplePerTurn, manaPerTurn)
      })
    }
  })
}

// check unit maintenance
const checkUnitsMaintenance = (uid) => {
  return database.ref('users').child(uid).child('troops').once('value', troops => {
    if (troops && troops.hasChildren()) {
      troops.forEach(troop => {
        let unit = troop.val()
        // console.log('Checking unit maintenance... ' + unit.name)
        goldPerTurn -= unit.quantity * unit.goldMaintenance
        peoplePerTurn -= unit.quantity * unit.peopleMaintenance
        manaPerTurn -= unit.quantity * unit.manaMaintenance
        army += unit.quantity
        power += unit.quantity * unit.power
        // console.log(goldPerTurn, peoplePerTurn, manaPerTurn)
      })
    }
  })
}

// check god production
const checkGodsProduction = (uid) => {
  return database.ref('gods').orderByChild('blessed').equalTo(uid).once('value', blessings => {
    if (blessings && blessings.hasChildren()) {
      blessings.forEach(blessing => {
        let god = blessing.val()
        // console.log('Checking god production... ' + god.name)
        goldPerTurn += god.goldProduction
        peoplePerTurn += god.peopleProduction
        manaPerTurn += god.manaProduction
        power += god.power
        // console.log(goldPerTurn, peoplePerTurn, manaPerTurn)
      })
    }
  })
}

// check artifact production
const checkArtifactProduction = (uid) => {
  return database.ref('users').child(uid).child('relics').once('value', relics => {
    if (relics && relics.hasChildren()) {
      relics.forEach(relic => {
        let artifact = relic.val()
        // console.log('Checking artifact production... ' + artifact.name)
        power += artifact.power * artifact.quantity
        // console.log(goldPerTurn, peoplePerTurn, manaPerTurn)
      })
    }
  })
}

// check unit affordance
const checkUnitsAffordance = (uid) => {
  return database.ref('users').child(uid).child('troops').once('value', troops => {
    if (troops && troops.hasChildren()) {
      troops.forEach(troop => {
        let unit = troop.val()
        // console.log('Checking unit affordance... ' + unit.name)
        if (!disbanded && ((gold < 0 && unit.goldMaintenance > 0) || (people < 0 && unit.peopleMaintenance > 0) || (mana < 0 && unit.manaMaintenance > 0))) {
          // console.log('Cant afford ' + unit.name + ', disbanding it...')
          goldPerTurn += unit.quantity * unit.goldMaintenance
          peoplePerTurn += unit.quantity * unit.peopleMaintenance
          manaPerTurn += unit.quantity * unit.manaMaintenance
          army -= unit.quantity
          power -= unit.quantity * unit.power
          disbanded = true
          troop.ref.remove()
          store.commit('error', 'lbl_toast_unit_disbanded')
          // console.log(goldPerTurn, peoplePerTurn, manaPerTurn)
        }
      })
    }
  })
}

// check enchantment affordance
const checkEnchantmentsAffordance = (uid) => {
  return database.ref('enchantments').orderByChild('source').equalTo(uid).once('value', enchantments => {
    if (enchantments && enchantments.hasChildren()) {
      enchantments.forEach(enchantment => {
        let spell = enchantment.val()
        // console.log('Checking enchantment affordance... ' + spell.name)
        if (!dispeled && ((gold < 0 && spell.goldMaintenance > 0) || (people < 0 && spell.peopleMaintenance > 0) || (mana < 0 && spell.manaMaintenance > 0))) {
          // console.log('Cant afford ' + spell.name + ', breaking it...')
          if (spell.source === spell.target === uid) {
            goldPerTurn -= spell.magic * (spell.goldProduction - spell.goldMaintenance)
            peoplePerTurn -= spell.magic * (spell.peopleProduction - spell.peopleMaintenance)
            manaPerTurn -= spell.magic * (spell.manaProduction - spell.manaMaintenance)
            terrainPerTurn -= spell.magic * Math.abs(terrainPerTurn)
            power -= spell.magic * spell.power
          }
          dispeled = true
          enchantment.ref.remove()
          store.commit('error', 'lbl_toast_enchantment_broken')
          // console.log(goldPerTurn, peoplePerTurn, manaPerTurn)
        }
      })
    }
  })
}

// check hero affordance
const checkHeroesAffordance = (uid) => {
  return database.ref('users').child(uid).child('contracts').once('value', contracts => {
    if (contracts && contracts.hasChildren()) {
      contracts.forEach(contract => {
        let hero = contract.val()
        // console.log('Checking hero affordance... ' + hero.name)
        if (!deserted && ((gold < 0 && hero.goldMaintenance > 0) || (people < 0 && hero.peopleMaintenance > 0) || (mana < 0 && hero.manaMaintenance > 0))) {
          // console.log('Cant afford ' + hero.name + ', firing it...')
          goldPerTurn -= hero.level * (hero.goldProduction - hero.goldMaintenance)
          peoplePerTurn -= hero.level * (hero.peopleProduction - hero.peopleMaintenance)
          manaPerTurn -= hero.level * (hero.manaProduction - hero.manaMaintenance)
          power -= hero.level * hero.power
          deserted = true
          contract.ref.remove()
          store.commit('error', 'lbl_toast_hero_resigned')
          // console.log(goldPerTurn, peoplePerTurn, manaPerTurn)
        }
      })
    }
  })
}

// check turns maintenance
const checkGeneralStatus = (uid) => {
  return database.ref('users').child(uid).transaction(user => { // opens transaction
    if (user) {
      user.goldPerTurn = Math.floor(goldPerTurn)
      user.peoplePerTurn = Math.floor(peoplePerTurn)
      user.manaPerTurn = Math.floor(manaPerTurn)
      user.terrainPerTurn = terrainPerTurn
      user.army = army
      user.power = power
      user.gold += goldPerTurn
      user.people += peoplePerTurn
      user.mana += manaPerTurn
      user.peopleCap = peopleCap
      user.manaCap = manaCap
      user.armyCap = armyCap
      user.terrain = terrain
      user.turns--
      gold = user.gold
      people = user.people
      mana = user.mana
      // console.log('Gold this turn... ' + gold)
      // console.log('People this turn... ' + people)
      // console.log('Mana this turn... ' + mana)
    }
    return user
  })
}

// check maintenances
const checkMaintenances = async (uid) => {
  resetAuxVariables()
  await checkTerrainProductionDestruction(uid)
  await checkBuildingsProductionMaintenance(uid)
  await checkHeroesProductionMaintenance(uid)
  await checkEnchantmentsProduction(uid)
  await checkEnchantmentsMaintenance(uid)
  await checkGodsProduction(uid)
  await checkArtifactProduction(uid)
  await checkUnitsMaintenance(uid)
  await checkGeneralStatus(uid)
  await checkAffordances(uid)
}

// check affordances
export const checkAffordances = async (uid) => {
  await checkUnitsAffordance(uid)
  if (!disbanded) await checkEnchantmentsAffordance(uid)
  if (!disbanded && !dispeled) await checkHeroesAffordance(uid)
}

// check maintenances every turn
export const checkTurnMaintenances = async (uid, turns) => {
  if (turns && turns > 0) {
    let iterations = [...Array(turns).keys()]
    for (let iteration of iterations) { // eslint-disable-line
      await checkMaintenances(uid)
    }
  }
  return database.ref('users').child(uid).transaction(user => {
    if (user) {
      user.gold = Math.max(0, user.gold)
      user.people = Math.max(0, Math.min(peopleCap, user.people))
      user.mana = Math.max(0, Math.min(manaCap, user.mana))
    }
    return user
  })
}

// check terrain production - maintenance
const checkTerrainProductionMaintenance = (uid) => {
  return database.ref('enchantments').orderByChild('target').equalTo(uid).once('value', enchantments => {
    if (enchantments && enchantments.hasChildren()) {
      enchantments.forEach(enchantment => {
        let enchant = enchantment.val()
        // console.log('Checking terrain production and destruction... ' + enchant.name)
        terrainPerTurn += enchant.magic * enchant.terrainProduction
        // console.log(terrainPerTurn)
      })
    }
  })
}

export const resetAuxVariables = () => {
  goldPerTurn = 0
  peoplePerTurn = 0
  manaPerTurn = 0
  terrainPerTurn = 0
  peopleCap = 0
  manaCap = 0
  armyCap = 0
  gold = 0
  people = 0
  mana = 0
  power = 0
  army = 0
  terrain = 0
  dispeled = false
  deserted = false
  disbanded = false
}

// check general status
export const updateGeneralStatus = async (uid) => {
  resetAuxVariables()
  await checkTerrainProductionMaintenance(uid)
  await checkBuildingsProductionMaintenance(uid)
  await checkHeroesProductionMaintenance(uid)
  await checkEnchantmentsProduction(uid)
  await checkEnchantmentsMaintenance(uid)
  await checkGodsProduction(uid)
  await checkArtifactProduction(uid)
  await checkUnitsMaintenance(uid)
  return database.ref('users').child(uid).transaction(user => {
    if (user) {
      user.goldPerTurn = Math.floor(goldPerTurn)
      user.peoplePerTurn = Math.floor(peoplePerTurn)
      user.manaPerTurn = Math.floor(manaPerTurn)
      user.terrainPerTurn = terrainPerTurn
      user.army = army
      user.power = power
      user.peopleCap = peopleCap
      user.manaCap = manaCap
      user.armyCap = armyCap
      user.people = Math.min(user.peopleCap, user.people)
      user.mana = Math.min(user.manaCap, user.mana)
      user.terrain = terrain
    }
    return user
  })
}

const random = (number) => {
  let max = number
  let min = max * 0.90 // +- 10%
  return Math.ceil(Math.random() * (max - min + 1) + min)
}

// create new user
export const createNewUser = async (uid, player) => {
  // buildings
  await database.ref('buildings').once('value', buildings => {
    if (buildings && buildings.hasChildren()) {
      buildings.forEach(building => {
        let construction = {...building.val()}
        delete construction['.key']
        database.ref('users').child(uid).child('constructions').push(construction)
      })
    }
  })
  // spells
  await database.ref('spells').orderByChild('color').equalTo(player.color).once('value', spells => {
    if (spells && spells.hasChildren()) {
      spells.forEach(spell => {
        let research = {...spell.val()}
        delete research['.key']
        database.ref('users').child(uid).child('researches').push(research)
      })
    }
  })
  // units
  await database.ref('units').orderByChild('initial').equalTo(player.color).once('value', units => {
    if (units && units.hasChildren()) {
      units.forEach(unit => {
        let troop = {...unit.val()}
        troop.quantity = random(troop.quantity * player.magic)
        delete troop['.key']
        database.ref('users').child(uid).child('troops').push(troop)
      })
    }
  })
  // relics
  await database.ref('artifacts').orderByChild('color').equalTo(player.color).once('value', artifacts => {
    if (artifacts && artifacts.hasChildren()) {
      let relics = []
      artifacts.forEach(artifact => {
        let relic = {...artifact.val()}
        relic.quantity = 1
        delete relic['.key']
        relics.push(relic)
      })
      // random
      const index = Math.floor(Math.random() * relics.length)
      database.ref('users').child(uid).child('relics').push(relics[index])
    }
  })
  // places
  await database.ref('places').orderByChild('color').equalTo(player.color).once('value', places => {
    if (places && places.hasChildren()) {
      places.forEach(place => {
        let quest = {...place.val()}
        delete quest['.key']
        database.ref('users').child(uid).child('quests').push(quest)
      })
    }
  })
  // messages
  await database.ref('users').child(uid).child('messages').push({
    name: 'lbl_name_admin',
    color: 'dark',
    timestamp: Date.now(),
    subject: 'lbl_message_welcome_subject',
    text: 'lbl_message_welcome_text'
  })
  // auction
  await database.ref('artifacts').once('value', artifacts => {
    if (artifacts && artifacts.hasChildren()) {
      let auctions = []
      artifacts.forEach(artifact => {
        let auction = {...artifact.val()}
        auction.quantity = 1
        delete auction['.key']
        auctions.push(auction)
        // TODO DEVELOPMENT ONLY
        // database.ref('users').child(uid).child('relics').push(auction)
      })
      // random
      const index = Math.floor(Math.random() * auctions.length)
      database.ref('auctions').push(auctions[index])
    }
  })
  // contract
  await database.ref('heroes').once('value', heroes => {
    if (heroes && heroes.hasChildren()) {
      let contracts = []
      heroes.forEach(hero => {
        let contract = {...hero.val()}
        contract.level = Math.floor(Math.random() * 5) + 1
        delete contract['.key']
        contracts.push(contract)
        // TODO DEVELOPMENT ONLY
        // database.ref('users').child(uid).child('contracts').push(contract)
      })
      // random
      const index = Math.floor(Math.random() * contracts.length)
      database.ref('tavern').push(contracts[index])
    }
  })
  // TODO DEVELOPMENT ONLY
  await database.ref('spells').once('value', spells => {
    if (spells && spells.hasChildren()) {
      spells.forEach(spell => {
        let research = {...spell.val()}
        research.completed = true
        delete research['.key']
        database.ref('users').child(uid).child('book').push(research)
      })
    }
  })
  /*
  // TODO DEVELOPMENT ONLY
  await database.ref('spells').orderByChild('enchantment').equalTo(true).once('value', spells => {
    if (spells && spells.hasChildren()) {
      spells.forEach(spell => {
        let enchantment = {...spell.val()}
        enchantment.target = uid
        enchantment.targetColor = player.color
        enchantment.targetName = player.username
        if (enchantment.support) {
          enchantment.source = uid
          enchantment.sourceColor = player.color
          enchantment.sourceName = player.username
          enchantment.magic = 1
        } else {
          enchantment.source = 'Pb0lhTW38SUlhiLRwMi4URt2BLV2'
          enchantment.sourceColor = 'red'
          enchantment.sourceName = 'prueba'
          enchantment.magic = 10
        }
        enchantment.duration *= enchantment.magic
        enchantment.remaining = enchantment.duration
        delete enchantment['.key']
        database.ref('enchantments').push(enchantment)
      })
    }
  })
  */
  /*
  // TODO DEVELOPMENT ONLY
  await database.ref('gods').once('value', gods => {
    if (gods && gods.hasChildren()) {
      gods.forEach(god => {
        database.ref('gods').child(god.key).child('blessed').set(uid)
      })
    }
  })
  */
}

// battle pve
export const battlePlayerVersusEnvironment = (uid, country) => {
}

// battle pvp
export const battlePlayerVersusPlayer = (uid, country) => {
}
