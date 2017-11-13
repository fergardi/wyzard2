import { database } from '@/services/firebase'
import store from '@/vuex/store'

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
let magicalDefense = 0
let physicalDefense = 0
let constructionBonus = 0
let researchBonus = 0
let enchantmentCap = 0
let disbanded = false
let deserted = false
let dispeled = false

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
        } else if (building.name === 'lbl_building_fortress') {
          physicalDefense = Math.floor(building.quantity / (1 + building.physicalDefense))
        } else if (building.name === 'lbl_building_barrier') {
          magicalDefense = Math.floor(building.quantity / (1 + building.magicalDefense))
        } else if (building.name === 'lbl_building_workshop') {
          constructionBonus = Math.floor(building.quantity / (1 + building.construction))
        } else if (building.name === 'lbl_building_guild') {
          researchBonus = Math.floor(building.quantity / (1 + building.research))
        } else if (building.name === 'lbl_building_temple') {
          enchantmentCap = Math.floor(building.quantity / (1 + building.enchantmentCap))
        }
        // console.log(goldPerTurn, peoplePerTurn, manaPerTurn)
      })
    }
  })
}

// check hero production - maintenance
const checkHeroesProductionMaintenance = (uid, experience = false) => {
  return database.ref('users').child(uid).child('contracts').once('value', contracts => {
    if (contracts && contracts.hasChildren()) {
      contracts.forEach(contract => {
        contract.ref.transaction(hero => {
          // console.log('Checking hero production and maintenances... ' + hero.name)
          if (experience && hero.invested + 1 >= hero.level * hero.experience) {
            // console.log('Hero leveled up... ' + hero.name)
            hero.level++
            hero.invested = 0
            store.commit('info', 'lbl_toast_hero_levelup')
          }
          goldPerTurn += hero.level * (hero.goldProduction - hero.goldMaintenance)
          peoplePerTurn += hero.level * (hero.peopleProduction - hero.peopleMaintenance)
          manaPerTurn += hero.level * (hero.manaProduction - hero.manaMaintenance)
          magicalDefense += hero.level * hero.magicalDefense
          physicalDefense += hero.level * hero.physicalDefense
          researchBonus += hero.level * hero.research
          constructionBonus += hero.level * hero.construction
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
        magicalDefense += spell.magic * spell.magicalDefense
        physicalDefense += spell.magic * spell.physicalDefense
        researchBonus += spell.magic * spell.research
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
            magicalDefense -= spell.magic * spell.magicalDefense
            physicalDefense -= spell.magic * spell.physicalDefense
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
          magicalDefense -= hero.level * hero.magicalDefense
          physicalDefense -= hero.level * hero.physicalDefense
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
    if (user && user.turns >= 0) {
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
      user.magicalDefense = magicalDefense
      user.physicalDefense = physicalDefense
      user.researchBonus = researchBonus
      user.constructionBonus = constructionBonus
      user.enchantmentCap = enchantmentCap
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
  await checkHeroesProductionMaintenance(uid, true)
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
  magicalDefense = 0
  physicalDefense = 0
  constructionBonus = 0
  researchBonus = 0
  enchantmentCap = 0
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
      user.magicalDefense = magicalDefense
      user.physicalDefense = physicalDefense
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
      const random = Math.floor(Math.random() * relics.length)
      database.ref('users').child(uid).child('relics').push(relics[random])
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
  await sendMessageToUser(uid, 'lbl_name_admin', 'dark', 'lbl_message_welcome_subject', 'lbl_message_welcome_text')
  // auction
  await database.ref('artifacts').once('value', artifacts => {
    if (artifacts && artifacts.hasChildren()) {
      let auctions = []
      artifacts.forEach(artifact => {
        let auction = {...artifact.val()}
        auction.quantity = 1
        auction.timestamp = Date.now() + 1000 * 60 * 60 * Math.floor(Math.random() * (48 - 24 + 1) + 24)
        delete auction['.key']
        auctions.push(auction)
        // TODO DEVELOPMENT ONLY
        // database.ref('users').child(uid).child('relics').push(auction)
      })
      // random
      const random = Math.floor(Math.random() * auctions.length)
      database.ref('auctions').push(auctions[random])
    }
  })
  // contract
  await database.ref('heroes').once('value', heroes => {
    if (heroes && heroes.hasChildren()) {
      let contracts = []
      heroes.forEach(hero => {
        let contract = {...hero.val()}
        contract.level = Math.floor(Math.random() * 5) + 1
        contract.timestamp = Date.now() + 1000 * 60 * 60 * Math.floor(Math.random() * (48 - 24 + 1) + 24)
        delete contract['.key']
        contracts.push(contract)
        // TODO DEVELOPMENT ONLY
        // database.ref('users').child(uid).child('contracts').push(contract)
      })
      // random
      const random = Math.floor(Math.random() * contracts.length)
      database.ref('tavern').push(contracts[random])
    }
  })
  // TODO DEVELOPMENT ONLY
  /*
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
  +/
  /*
  // TODO DEVELOPMENT ONLY
  await database.ref('spells').orderByChild('enchantment').equalTo(true).once('value', spells => {
    if (spells && spells.hasChildren()) {
      spells.forEach(spell => {
        let enchantment = {...spell.val()}
        if (enchantment.support) {
          enchantment.target = uid
          enchantment.targetColor = player.color
          enchantment.targetName = player.name
          enchantment.source = uid
          enchantment.sourceColor = player.color
          enchantment.sourceName = player.name
          enchantment.magic = player.magic
          enchantment.duration *= enchantment.magic
          enchantment.remaining = enchantment.duration
          delete enchantment['.key']
          database.ref('enchantments').push(enchantment)
        }
      })
    }
  })
  */
  // TODO DEVELOPMENT ONLY
  /*
  await database.ref('gods').once('value', gods => {
    if (gods && gods.hasChildren()) {
      gods.forEach(god => {
        database.ref('gods').child(god.key).child('blessed').set(uid)
      })
    }
  })
  */
  return await updateGeneralStatus(uid)
}

// messages
export const sendMessageToUser = (uid, from, color, subject, text = null, battle = null, artifact = null, gold = null, people = null, kills = null, conquered = null, sieged = null, mana = null, spionage = null) => {
  return database.ref('users').child(uid).child('messages').push({
    name: from,
    color: color,
    subject: subject,
    text: text,
    battle: battle,
    artifact: artifact,
    gold: gold,
    people: people,
    kills: kills,
    conquered: conquered,
    sieged: sieged,
    mana: mana,
    spionage: spionage,
    timestamp: Date.now(),
    read: false
  })
}

export const spyInformationToUser = async (uid) => {
  let report = {
    buildings: [],
    units: [],
    enchantments: [],
    artifacts: [],
    heroes: [],
    gods: [],
    spells: [],
    gold: 0,
    people: 0,
    mana: 0,
    magic: 0
  }
  await database.ref('users').child(uid).child('constructions').once('value', constructions => {
    if (constructions) {
      constructions.forEach(construction => {
        let building = construction.val()
        report.buildings.push({ name: building.name, quantity: building.quantity })
      })
    }
  })
  await database.ref('users').child(uid).child('book').once('value', pages => {
    if (pages) {
      pages.forEach(page => {
        let spell = page.val()
        report.spells.push({ name: spell.name, quantity: spell.level })
      })
    }
  })
  return report
}

// add troops to user
export const addTroopToUser = (uid, name, magic = 1) => {
  name = name.includes('lbl_unit_') ? name : 'lbl_unit_' + name
  return database.ref('units').child(name.replace('lbl_unit_', '')).once('value', async unit => {
    if (unit) {
      await database.ref('users').child(uid).child('troops').orderByChild('name').equalTo(name).once('value', async troops => {
        if (troops && troops.hasChildren()) {
          troops.forEach(troop => {
            database.ref('users').child(uid).child('troops').child(troop.key).update({ quantity: troop.val().quantity + random(unit.val().quantity) * magic })
          })
        } else {
          let summon = {...unit.val()}
          summon.quantity = random(summon.quantity) * magic
          delete summon['.key']
          await database.ref('users').child(uid).child('troops').push(summon)
        }
      })
    }
  })
}

// add random troop to user
export const addRandomTroopToUser = (uid, magic = 1) => {
  return database.ref('units').once('value', async units => {
    if (units && units.hasChildren()) {
      let list = []
      units.forEach(unit => {
        list.push(unit.val().name)
      })
      const random = Math.floor(Math.random() * list.length)
      await addTroopToUser(uid, list[random], magic)
    }
  })
}

// add random troop to user by family
export const addRandomTroopToUserByFamily = (uid, family, magic = 1) => {
  family = family.includes('lbl_family_') ? family : 'lbl_family_' + family
  return database.ref('units').orderByChild('family').equalTo(family).once('value', async units => {
    if (units && units.hasChildren()) {
      let list = []
      units.forEach(unit => {
        list.push(unit.val().name)
      })
      const random = Math.floor(Math.random() * list.length)
      await addTroopToUser(uid, list[random], magic)
    }
  })
}

// add artifact to user
export const addArtifactToUser = (uid, name, quantity = 1) => {
  name = name.includes('lbl_artifact_') ? name : 'lbl_artifact_' + name
  return database.ref('artifacts').child(name.replace('lbl_artifact_', '')).once('value', async artifact => {
    if (artifact) {
      await database.ref('users').child(uid).child('relics').orderByChild('name').equalTo(name).once('value', async relics => {
        if (relics && relics.hasChildren()) {
          relics.forEach(relic => {
            database.ref('users').child(uid).child('relics').child(relic.key).update({ quantity: relic.val().quantity + quantity })
          })
        } else {
          let relic = {...artifact.val()}
          relic.quantity = quantity
          delete relic['.key']
          await database.ref('users').child(uid).child('relics').push(relic)
        }
      })
    }
  })
}

// add new artifact to user
export const addRandomArtifactToUser = (uid, quantity = 1) => {
  return database.ref('artifacts').once('value', async artifacts => {
    if (artifacts) {
      let list = []
      artifacts.forEach(artifact => {
        list.push(artifact.val().name)
      })
      const random = Math.floor(Math.random() * list.length)
      await addArtifactToUser(uid, list[random], quantity)
    }
  })
}

// add hero to user
export const addHeroToUser = (uid, name, level = 3) => {
  name = name.includes('lbl_hero_') ? name : 'lbl_hero_' + name
  return database.ref('heroes').child(name.replace('lbl_hero_', '')).once('value', async hero => {
    if (hero) {
      await database.ref('users').child(uid).child('contracts').orderByChild('name').equalTo(name).once('value', async contracts => {
        if (contracts && contracts.hasChildren()) {
          contracts.forEach(contract => {
            contract.ref.remove()
          })
        }
        let contract = {...hero.val()}
        contract.level = level
        delete contract['.key']
        await database.ref('users').child(uid).child('contracts').push(contract)
      })
    }
  })
}

// add enchantment to user from user
export const addEnchantmentToUser = (uid, name, from, magic = 1) => {
  name = name.includes('lbl_spell_') ? name : 'lbl_spell_' + name
  return database.ref('spells').child(name.replace('lbl_spell_', '')).once('value', async spell => {
    if (spell) {
      await database.ref('enchantments').orderByChild('name').equalTo(name).once('value', async enchantments => {
        if (enchantments) {
          enchantments.forEach(enchantment => {
            if (enchantment) {
              let enchant = enchantment.val()
              if (enchant.name === name && enchant.target === uid) enchantment.ref.remove()
            }
          })
          let enchantment = {...spell.val()}
          enchantment.target = uid
          enchantment.source = from
          enchantment.magic = magic
          enchantment.duration *= enchantment.magic
          enchantment.remaining = enchantment.duration
          delete enchantment['.key']
          await database.ref('enchantments').push(enchantment)
        }
      })
    }
  })
}

// remove random enchantment from user
export const removeRandomEnchantmentFromUser = (uid) => {
  return database.ref('enchantments').orderByChild('target').equalTo(uid).once('value', async enchantments => {
    if (enchantments && enchantments.hasChildren()) {
      let enchant = []
      enchantments.forEach(enchantment => {
        enchant.push(enchantment.key)
      })
      const random = Math.floor(Math.random() * enchant.length)
      await database.ref('enchantments').child(enchant[random]).remove()
    }
  })
}

// add random place to user
export const addRandomPlaceToUser = (uid) => {
  return database.ref('places').once('value', async places => {
    let quests = []
    places.forEach(place => {
      let quest = {...place.val()}
      quest.turns = random(20)
      delete quest['.key']
      quests.push(quest)
    })
    const random = Math.floor(Math.random() * quests.length)
    await database.ref('users').child(uid).child('quests').push(quests[random])
  })
}

// add level to random hero user
export const addLevelToRandomHeroFromUser = (uid, level = 1) => {
  return database.ref('users').child(uid).child('contracts').once('value', async contracts => {
    if (contracts && contracts.hasChildren()) {
      let heroes = []
      contracts.forEach(contract => {
        heroes.push(contract.key)
      })
      const random = Math.floor(Math.random() * heroes.length)
      await database.ref('users').child(store.state.uid).child('contracts').child(heroes[random]).transaction(hero => {
        if (hero) hero.level++
        return hero
      })
    }
  })
}

// add spell to user
export const addSpellToUser = (uid, name) => {
  name = name.includes('lbl_spell_') ? name : 'lbl_spell_' + name
  return database.ref('spells').child(name.replace('lbl_spell_', '')).once('value', async spell => {
    if (spell) {
      let known = []
      await database.ref('users').child(uid).child('researches').once('value', researches => {
        if (researches) {
          researches.forEach(research => {
            known.push(research.val().name)
          })
        }
      })
      // spells already known
      await database.ref('users').child(uid).child('book').once('value', book => {
        if (book) {
          book.forEach(page => {
            known.push(page.val().name)
          })
        }
      })
      // add only if not already known
      if (!known.includes(spell.val().name)) {
        let book = {...spell.val()}
        delete book['.key']
        await database.ref('users').child(uid).child('researches').push(book)
      }
    }
  })
}

// add new spell to user
export const addRandomSpellToUser = async (uid) => {
  let known = []
  // spells researching
  await database.ref('users').child(uid).child('researches').once('value', researches => {
    if (researches) {
      researches.forEach(research => {
        known.push(research.val().name)
      })
    }
  })
  // spells already known
  await database.ref('users').child(uid).child('book').once('value', book => {
    if (book) {
      book.forEach(page => {
        known.push(page.val().name)
      })
    }
  })
  // unknown spells, aka all other ones
  let unknown = []
  await database.ref('spells').once('value', spells => {
    if (spells) {
      spells.forEach(spell => {
        if (!known.includes(spell.val().name)) unknown.push(spell.val().name)
      })
    }
  })
  const random = Math.floor(Math.random() * unknown.length)
  return unknown.length > 0 ? addSpellToUser(uid, unknown[random]) : false
}
