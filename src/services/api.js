import { database } from './firebase'
import store from '../vuex/store'
import i18n from './i18n'

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
          console.log('TERRAIN ', terrain)
        } else if (building.name === 'lbl_building_fortress') {
          physicalDefense = Math.floor(building.quantity / building.physicalDefense)
        } else if (building.name === 'lbl_building_barrier') {
          magicalDefense = Math.floor(building.quantity / building.magicalDefense)
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
      user.magicalDefense = magicalDefense
      user.physicalDefense = physicalDefense
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
  await sendUserMessage(uid, 'lbl_name_admin', 'dark', 'lbl_message_welcome_subject', 'lbl_message_welcome_text')
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
        database.ref('users').child(uid).child('relics').push(auction)
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
        database.ref('users').child(uid).child('contracts').push(contract)
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
  await database.ref('gods').once('value', gods => {
    if (gods && gods.hasChildren()) {
      gods.forEach(god => {
        database.ref('gods').child(god.key).child('blessed').set(uid)
      })
    }
  })
  return await updateGeneralStatus(uid)
}

// messages
export const sendUserMessage = (uid, from, color, subject, text = null, battle = null, artifact = null, gold = null, people = null, kills = null, conquered = null, sieged = null) => {
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
    timestamp: Date.now(),
    read: false
  })
}

const rockScissorsPaper = (attacker, defender) => {
  if (attacker === 'lbl_type_fly' && defender === 'lbl_type_melee') return true
  if (attacker === 'lbl_type_range' && defender === 'lbl_type_fly') return true
  if (attacker === 'lbl_type_melee' && defender === 'lbl_type_range') return true
  return false
}

const translate = (label) => { // eslint-disable-line
  return i18n[store.state.user ? store.state.user.settings.lang : store.state.settings.lang][label] || label
}

// battle pve
export const battlePlayerVersusEnvironment = (uid, country) => {
  // TODO
}

// battle pvp
export const battlePlayerVersusPlayer = async (uid, target, strategy, army, spell, artifact) => {
  return database.ref('users').child(uid).once('value', async attacker => {
    if (attacker) {
      let attackerArtifact = artifact
      let attackerSpell = spell
      await database.ref('users').child(target).once('value', async defender => {
        if (defender) {
          let report = {
            gods: [],
            heroes: [],
            spells: [],
            artifacts: [],
            logs: []
          }
          let atk = attacker.val()
          let def = defender.val()
          let attackerArmy = []
          if (army.first.troop) attackerArmy.push(army.first)
          if (army.second.troop) attackerArmy.push(army.second)
          if (army.third.troop) attackerArmy.push(army.third)
          if (army.fourth.troop) attackerArmy.push(army.fourth)
          if (army.fifth.troop) attackerArmy.push(army.fifth)
          // defense
          let defenderArmy = []
          if (def.defense) {
            if (def.defense.first.troop) defenderArmy.push({ troop: def.defense.first.troop, quantity: def.defense.first.troop.quantity })
            if (def.defense.second.troop) defenderArmy.push({ troop: def.defense.second.troop, quantity: def.defense.second.troop.quantity })
            if (def.defense.third.troop) defenderArmy.push({ troop: def.defense.third.troop, quantity: def.defense.third.troop.quantity })
            if (def.defense.fourth.troop) defenderArmy.push({ troop: def.defense.fourth.troop, quantity: def.defense.fourth.troop.quantity })
            if (def.defense.fifth.troop) defenderArmy.push({ troop: def.defense.fifth.troop, quantity: def.defense.fifth.troop.quantity })
          } else {
            await defender.ref.child('troops').limitToFirst(5).once('value', troops => {
              if (troops) {
                troops.forEach(unit => {
                  let troop = unit.val()
                  defenderArmy.push({
                    troop: troop,
                    quantity: troop.quantity
                  })
                })
              }
            })
          }
          let discovered = false
          if (strategy === 'lbl_strategy_pillage') {
            let defenderTerrain = 0
            let defenderUnits = 0
            let attackerUnits = 0
            defenderArmy.forEach(troop => {
              defenderUnits += troop.quantity
            })
            attackerArmy.forEach(troop => {
              attackerUnits += troop.quantity
            })
            await defender.ref.child('constructions').once('value', constructions => {
              if (constructions) {
                constructions.forEach(construction => {
                  defenderTerrain += construction.val().quantity
                })
              }
            })
            let discoveryChance1 = Math.min(100, defenderUnits / (defenderTerrain + 1))
            let discoveryChance2 = Math.min(100, attackerUnits / (defenderTerrain + 1))
            let discoveryChance = Math.max(discoveryChance1, discoveryChance2)
            discovered = Math.random() * 100 <= discoveryChance
          }
          let victory = false
          if (defenderArmy.length <= 0 || (strategy === 'lbl_strategy_pillage' && !discovered)) {
            victory = true
          } else {
            // blessings
            let attackerGodDamageBonus = 0
            let attackerGodHealthBonus = 0
            await database.ref('gods').orderByChild('blessed').equalTo(uid).once('value', attackerBlessings => {
              if (attackerBlessings) {
                attackerBlessings.forEach(attackerBlessing => {
                  let blessing = attackerBlessing.val()
                  report.gods.push({ left: true, name: blessing.name, color: blessing.color })
                  attackerGodDamageBonus += blessing.damage
                  attackerGodHealthBonus += blessing.health
                })
              }
            })
            let defenderGodDamageBonus = 0
            let defenderGodHealthBonus = 0
            await database.ref('gods').orderByChild('blessed').equalTo(target).once('value', defenderBlessings => {
              if (defenderBlessings) {
                defenderBlessings.forEach(defenderBlessing => {
                  let blessing = defenderBlessing.val()
                  report.gods.push({ left: false, name: blessing.name, color: blessing.color })
                  defenderGodDamageBonus += blessing.damage
                  defenderGodHealthBonus += blessing.health
                })
              }
            })
            // heroes
            let attackerDragonDamageBonus = 0
            let attackerDragonHealthBonus = 0
            let attackerElementalDamageBonus = 0
            let attackerElementalHealthBonus = 0
            let attackerBeastDamageBonus = 0
            let attackerBeastHealthBonus = 0
            let attackerHumanDamageBonus = 0
            let attackerHumanHealthBonus = 0
            let attackerCelestialDamageBonus = 0
            let attackerCelestialHealthBonus = 0
            let attackerDemonDamageBonus = 0
            let attackerDemonHealthBonus = 0
            let attackerUndeadDamageBonus = 0
            let attackerUndeadHealthBonus = 0
            if (atk.contracts) {
              await attacker.ref.child('contracts').once('value', contracts => {
                if (contracts) {
                  contracts.forEach(contract => {
                    let attackerContract = contract.val()
                    if (attackerContract.battle) {
                      report.heroes.push({ left: true, name: attackerContract.name, color: attackerContract.color, level: attackerContract.level })
                      switch (attackerContract.family) {
                        case 'lbl_family_dragon':
                          attackerDragonDamageBonus += attackerContract.damage * attackerContract.level
                          attackerDragonHealthBonus += attackerContract.health * attackerContract.level
                          break
                        case 'lbl_family_elemental':
                          attackerElementalDamageBonus += attackerContract.damage * attackerContract.level
                          attackerElementalHealthBonus += attackerContract.health * attackerContract.level
                          break
                        case 'lbl_family_beast':
                          attackerBeastDamageBonus += attackerContract.damage * attackerContract.level
                          attackerBeastHealthBonus += attackerContract.health * attackerContract.level
                          break
                        case 'lbl_family_human':
                          attackerHumanDamageBonus += attackerContract.damage * attackerContract.level
                          attackerHumanHealthBonus += attackerContract.health * attackerContract.level
                          break
                        case 'lbl_family_celestial':
                          attackerCelestialDamageBonus += attackerContract.damage * attackerContract.level
                          attackerCelestialHealthBonus += attackerContract.health * attackerContract.level
                          break
                        case 'lbl_family_demon':
                          attackerDemonDamageBonus += attackerContract.damage * attackerContract.level
                          attackerDemonHealthBonus += attackerContract.health * attackerContract.level
                          break
                        case 'lbl_family_undead':
                          attackerUndeadDamageBonus += attackerContract.damage * attackerContract.level
                          attackerUndeadHealthBonus += attackerContract.health * attackerContract.level
                          break
                      }
                    }
                  })
                }
              })
            }
            let defenderDragonDamageBonus = 0
            let defenderDragonHealthBonus = 0
            let defenderElementalDamageBonus = 0
            let defenderElementalHealthBonus = 0
            let defenderBeastDamageBonus = 0
            let defenderBeastHealthBonus = 0
            let defenderHumanDamageBonus = 0
            let defenderHumanHealthBonus = 0
            let defenderCelestialDamageBonus = 0
            let defenderCelestialHealthBonus = 0
            let defenderDemonDamageBonus = 0
            let defenderDemonHealthBonus = 0
            let defenderUndeadDamageBonus = 0
            let defenderUndeadHealthBonus = 0
            if (def.contracts) {
              await defender.ref.child('contracts').once('value', contracts => {
                if (contracts) {
                  contracts.forEach(contract => {
                    let defenderContract = contract.val()
                    if (defenderContract.battle) {
                      report.heroes.push({ left: false, name: defenderContract.name, color: defenderContract.color, level: defenderContract.level })
                      switch (defenderContract.family) {
                        case 'lbl_family_dragon':
                          defenderDragonDamageBonus += defenderContract.damage * defenderContract.level
                          defenderDragonHealthBonus += defenderContract.health * defenderContract.level
                          break
                        case 'lbl_family_elemental':
                          defenderElementalDamageBonus += defenderContract.damage * defenderContract.level
                          defenderElementalHealthBonus += defenderContract.health * defenderContract.level
                          break
                        case 'lbl_family_beast':
                          defenderBeastDamageBonus += defenderContract.damage * defenderContract.level
                          defenderBeastHealthBonus += defenderContract.health * defenderContract.level
                          break
                        case 'lbl_family_human':
                          defenderHumanDamageBonus += defenderContract.damage * defenderContract.level
                          defenderHumanHealthBonus += defenderContract.health * defenderContract.level
                          break
                        case 'lbl_family_celestial':
                          defenderCelestialDamageBonus += defenderContract.damage * defenderContract.level
                          defenderCelestialHealthBonus += defenderContract.health * defenderContract.level
                          break
                        case 'lbl_family_demon':
                          defenderDemonDamageBonus += defenderContract.damage * defenderContract.level
                          defenderDemonHealthBonus += defenderContract.health * defenderContract.level
                          break
                        case 'lbl_family_undead':
                          defenderUndeadDamageBonus += defenderContract.damage * defenderContract.level
                          defenderUndeadHealthBonus += defenderContract.health * defenderContract.level
                          break
                      }
                    }
                  })
                }
              })
            }
            // counters
            let defenderSpell = def.defense && def.defense.counter
            if (defenderSpell && defenderSpell.battle) {
              if (defenderSpell.counter > 0 && defenderSpell.manaCost <= def.mana) {
                let counterChance = defenderSpell.counter * def.magic
                if (Math.random() * 100 <= counterChance) {
                  report.spells.push({ left: false, level: def.magic, name: defenderSpell.name, color: defenderSpell.color })
                  attackerSpell = null
                }
              }
            }
            if (attackerSpell && attackerSpell.battle) {
              if (attackerSpell.counter > 0) {
                let spellChance = Math.random() * 100
                if (spellChance > def.magicalDefense) {
                  let counterChance = attackerSpell.counter * atk.magic
                  if (Math.random() * 100 <= counterChance) {
                    report.spells.push({ left: true, level: atk.magic, name: attackerSpell.name, color: attackerSpell.color })
                    defenderSpell = null
                  }
                }
              }
            }
            let defenderSpellDamageBonus = 0
            let defenderSpellHealthBonus = 0
            let attackerSpellKills = 0
            // let defenderResurrection = 0
            // spells
            if (defenderSpell && defenderSpell.battle) {
              await database.ref('users').child(target).update({ mana: def.mana - defenderSpell.manaCost })
              report.spells.push({ left: false, level: def.magic, name: defenderSpell.name, color: defenderSpell.color })
              if (defenderSpell.support) {
                if (defenderSpell.damage > 0) defenderSpellDamageBonus += defenderSpell.damage * def.magic
                if (defenderSpell.health > 0) defenderSpellHealthBonus += defenderSpell.health * def.magic
                // if (defenderSpell.resurrection > 0) defenderResurrection += defenderSpell.resurrection * def.magic
              } else {
                if (defenderSpell.health < 0) attackerSpellHealthBonus += defenderSpell.health * def.magic
                if (defenderSpell.health < 0) attackerSpellHealthBonus += defenderSpell.health * def.magic
                if (defenderSpell.troop > 0) attackerSpellKills += defenderSpell.troop * def.magic
              }
            }
            let attackerSpellDamageBonus = 0
            let attackerSpellHealthBonus = 0
            let defenderSpellKills = 0
            // let attackerResurrection = 0
            if (attackerSpell && attackerSpell.battle) {
              let spellChance = Math.random() * 100
              if (spellChance > def.magicalDefense) {
                await database.ref('users').child(uid).update({ mana: atk.mana - attackerSpell.manaCost })
                report.spells.push({ left: true, level: atk.magic, name: attackerSpell.name, color: attackerSpell.color })
                if (attackerSpell.enchantment && !attackerSpell.support) {
                  let enchantment = attackerSpell
                  enchantment.target = target
                  enchantment.targetColor = def.color
                  enchantment.targetName = def.name
                  enchantment.source = uid
                  enchantment.sourceColor = atk.color
                  enchantment.sourceName = atk.name
                  enchantment.magic = atk.magic
                  enchantment.duration *= enchantment.magic
                  enchantment.remaining = enchantment.duration
                  delete enchantment['.key']
                  await database.ref('enchantments').push(enchantment)
                } else {
                  if (attackerSpell.support) {
                    if (attackerSpell.damage > 0) attackerSpellDamageBonus += attackerSpell.damage * def.magic
                    if (attackerSpell.health > 0) attackerSpellHealthBonus += attackerSpell.health * def.magic
                    // if (attackerSpell.resurrection > 0) defenderResurrection += attackerSpell.resurrection * def.magic
                  } else {
                    if (attackerSpell.health < 0) attackerSpellHealthBonus += attackerSpell.health * def.magic
                    if (attackerSpell.health < 0) attackerSpellHealthBonus += attackerSpell.health * def.magic
                    if (attackerSpell.troop > 0) attackerSpellKills += attackerSpell.troop * def.magic
                  }
                }
              }
            }
            // rounds
            let rounds = Math.min(Math.max(attackerArmy.length, defenderArmy.length), 5)
            // artifacts
            // defender artifact
            let defenderArtifactDamageBonus = 0
            let defenderArtifactHealthBonus = 0
            let attackerArtifactKills = 0
            let defenderArtifact = def.defense && def.defense.trap
            if (defenderArtifact) {
              defenderArtifactDamageBonus = defenderArtifact.damage
              defenderArtifactHealthBonus = defenderArtifact.health
              attackerArtifactKills = defenderArtifact.troop
              rounds += defenderArtifact.round
              report.artifacts.push({ left: false, name: defenderArtifact.name, color: defenderArtifact.color })
            }
            // attacker artifact
            let attackerArtifactDamageBonus = 0
            let attackerArtifactHealthBonus = 0
            let defenderArtifactKills = 0
            if (attackerArtifact) {
              let artifactChance = Math.random() * 100
              if (artifactChance > def.magicalDefense) {
                attackerArtifactDamageBonus += attackerArtifact.damage
                attackerArtifactHealthBonus += attackerArtifact.health
                defenderArtifactKills += attackerArtifact.troop
                rounds += attackerArtifact.round
                report.artifacts.push({ left: true, name: attackerArtifact.name, color: attackerArtifact.color })
              }
            }
            // waves
            // random indexes
            let attackerArtifactIndex = Math.floor(Math.random() * defenderArmy.length)
            let attackerSpellIndex = Math.floor(Math.random() * defenderArmy.length)
            let defenderArtifactIndex = Math.floor(Math.random() * defenderArmy.length)
            let defenderSpellIndex = Math.floor(Math.random() * defenderArmy.length)
            let defenderArmyIndex = 0
            defenderArmy.forEach(wave => {
              // defender blessings
              wave.damage = defenderGodDamageBonus
              wave.health = defenderGodHealthBonus
              // defender artifact
              if (defenderArtifact && defenderArtifact.support && (defenderArtifact.multiple || defenderArmyIndex === defenderArtifactIndex)) {
                wave.damage += defenderArtifactDamageBonus
                wave.health += defenderArtifactHealthBonus
              }
              // defender spell
              if (defenderSpell && defenderSpell.support && (defenderSpell.multiple || defenderArmyIndex === defenderSpellIndex)) {
                wave.damage += defenderSpellDamageBonus
                wave.health += defenderSpellHealthBonus
              }
              // attacker artifact
              if (attackerArtifact && !attackerArtifact.support && (attackerArtifact.multiple || defenderArmyIndex === attackerArtifactIndex)) {
                wave.damage += attackerArtifactDamageBonus
                wave.health += attackerArtifactHealthBonus
                wave.quantity = Math.floor(wave.quantity * (1 - (attackerArtifactKills / 100)))
              }
              // attacker spell
              if (attackerSpell && !attackerSpell.support && (attackerSpell.multiple || defenderArmyIndex === attackerSpellIndex)) {
                wave.damage += attackerSpellDamageBonus
                wave.health += attackerSpellHealthBonus
                wave.quantity = Math.floor(wave.quantity * (1 - (attackerSpellKills / 100)))
              }
              // defender heroes
              switch (wave.troop.family) {
                case 'lbl_family_dragon':
                  wave.damage += defenderDragonDamageBonus
                  wave.health += defenderDragonHealthBonus
                  break
                case 'lbl_family_elemental':
                  wave.damage += defenderElementalDamageBonus
                  wave.health += defenderElementalHealthBonus
                  break
                case 'lbl_family_beast':
                  wave.damage += defenderBeastDamageBonus
                  wave.health += defenderBeastHealthBonus
                  break
                case 'lbl_family_human':
                  wave.damage += defenderHumanDamageBonus
                  wave.health += defenderHumanHealthBonus
                  break
                case 'lbl_family_celestial':
                  wave.damage += defenderCelestialDamageBonus
                  wave.health += defenderCelestialHealthBonus
                  break
                case 'lbl_family_demon':
                  wave.damage += defenderDemonDamageBonus
                  wave.health += defenderDemonHealthBonus
                  break
                case 'lbl_family_undead':
                  wave.damage += defenderUndeadDamageBonus
                  wave.health += defenderUndeadHealthBonus
                  break
              }
              defenderArmyIndex++
            })
            // random targets
            attackerArtifactIndex = Math.floor(Math.random() * attackerArmy.length)
            attackerSpellIndex = Math.floor(Math.random() * attackerArmy.length)
            defenderArtifactIndex = Math.floor(Math.random() * attackerArmy.length)
            defenderSpellIndex = Math.floor(Math.random() * attackerArmy.length)
            let attackerArmyIndex = 0
            attackerArmy.forEach(wave => {
              // attacker blessings
              wave.damage = attackerGodDamageBonus
              wave.health = attackerGodHealthBonus
              // attacker artifact
              if (attackerArtifact && attackerArtifact.support && (attackerArtifact.multiple || attackerArmyIndex === attackerArtifactIndex)) {
                wave.damage += attackerArtifactDamageBonus
                wave.health += attackerArtifactHealthBonus
              }
              // attacker spell
              if (attackerSpell && attackerSpell.support && (attackerSpell.multiple || attackerArmyIndex === attackerSpellIndex)) {
                wave.damage += attackerSpellDamageBonus
                wave.health += attackerSpellHealthBonus
              }
              // defender artifact
              if (defenderArtifact && !defenderArtifact.support && (defenderArtifact.multiple || attackerArmyIndex === defenderArtifactIndex)) {
                wave.damage += defenderArtifactDamageBonus
                wave.health += defenderArtifactHealthBonus
                wave.quantity = Math.floor(wave.quantity * (1 - (defenderArtifactKills / 100)))
              }
              // defender spell
              if (defenderSpell && !defenderSpell.support && (defenderSpell.multiple || attackerArmyIndex === defenderSpellIndex)) {
                wave.damage += defenderSpellDamageBonus
                wave.health += defenderSpellHealthBonus
                wave.quantity = Math.floor(wave.quantity * (1 - (defenderSpellKills / 100)))
              }
              // attacker heroes
              switch (wave.troop.family) {
                case 'lbl_family_dragon':
                  wave.damage += attackerDragonDamageBonus
                  wave.health += attackerDragonHealthBonus
                  break
                case 'lbl_family_elemental':
                  wave.damage += attackerElementalDamageBonus
                  wave.health += attackerElementalHealthBonus
                  break
                case 'lbl_family_beast':
                  wave.damage += attackerBeastDamageBonus
                  wave.health += attackerBeastHealthBonus
                  break
                case 'lbl_family_human':
                  wave.damage += attackerHumanDamageBonus
                  wave.health += attackerHumanHealthBonus
                  break
                case 'lbl_family_celestial':
                  wave.damage += attackerCelestialDamageBonus
                  wave.health += attackerCelestialHealthBonus
                  break
                case 'lbl_family_demon':
                  wave.damage += attackerDemonDamageBonus
                  wave.health += attackerDemonHealthBonus
                  break
                case 'lbl_family_undead':
                  wave.damage += attackerUndeadDamageBonus
                  wave.health += attackerUndeadHealthBonus
                  break
              }
              attackerArmyIndex++
            })
            // power
            let attackerPowerLost = 0
            let defenderPowerLost = 0
            // rounds
            let attackerIndex = 0
            let defenderIndex = 0
            console.log(attackerArmy, defenderArmy, rounds)
            for (let i = 0; i < rounds; i++) {
              let log = {}
              let attackerTroop = attackerArmy[attackerIndex]
              let defenderTroop = defenderArmy[attackerIndex]
              console.log('ROUND ' + parseInt(i + 1) + '/' + rounds)
              console.log(attackerTroop.quantity, translate(attackerTroop.troop.name), translate(attackerTroop.troop.family), translate(attackerTroop.troop.type), '+' + attackerTroop.damage + '% Dmg', '+' + attackerTroop.health + '% Hth', '<== VS ==>', defenderTroop.quantity, translate(defenderTroop.troop.name), translate(defenderTroop.troop.family), translate(defenderTroop.troop.type), '+' + defenderTroop.damage + '% Dmg', '+' + defenderTroop.health + '% Hth')
              if (rockScissorsPaper(attackerTroop.troop.type, defenderTroop.troop.type)) {
                console.log('ATTACKER => DEFENDER')
                let defenderCasualties = Math.min(defenderTroop.quantity, Math.floor((attackerTroop.troop.damage * attackerTroop.quantity * (1 + attackerTroop.damage / 100)) / (defenderTroop.troop.health * (1 + defenderTroop.health / 100))))
                log.attacker = { left: true, name: attackerTroop.troop.name, color: attackerTroop.troop.color, quantity: attackerTroop.quantity, casualties: defenderCasualties }
                defenderTroop.quantity -= defenderCasualties
                defenderPowerLost += defenderCasualties * defenderTroop.troop.power
                console.log('Defender casualties', defenderCasualties)
                console.log('ATTACKER <= DEFENDER')
                let attackerCasualties = Math.min(attackerTroop.quantity, Math.floor((defenderTroop.troop.damage * defenderTroop.quantity * (1 + defenderTroop.damage / 100)) / (attackerTroop.troop.health * (1 + attackerTroop.health / 100))))
                log.defender = { left: false, name: defenderTroop.troop.name, color: defenderTroop.troop.color, quantity: defenderTroop.quantity, casualties: attackerCasualties }
                attackerTroop.quantity -= attackerCasualties
                attackerPowerLost += attackerCasualties * attackerTroop.troop.power
                console.log('Attacker casualties', attackerCasualties)
              } else {
                console.log('ATTACKER <= DEFENDER')
                let attackerCasualties = Math.min(attackerTroop.quantity, Math.floor((defenderTroop.troop.damage * defenderTroop.quantity * (1 + defenderTroop.damage / 100)) / (attackerTroop.troop.health * (1 + attackerTroop.health / 100))))
                log.attacker = { left: false, name: defenderTroop.troop.name, color: defenderTroop.troop.color, quantity: defenderTroop.quantity, casualties: attackerCasualties }
                attackerTroop.quantity -= attackerCasualties
                attackerPowerLost += attackerCasualties * attackerTroop.troop.power
                console.log('Attacker casualties', attackerCasualties)
                console.log('ATTACKER => DEFENDER')
                let defenderCasualties = Math.min(defenderTroop.quantity, Math.floor((attackerTroop.troop.damage * attackerTroop.quantity * (1 + attackerTroop.damage / 100)) / (defenderTroop.troop.health * (1 + defenderTroop.health / 100))))
                log.defender = { left: true, name: attackerTroop.troop.name, color: attackerTroop.troop.color, quantity: attackerTroop.quantity, casualties: defenderCasualties }
                defenderTroop.quantity -= defenderCasualties
                defenderPowerLost += defenderCasualties * defenderTroop.troop.power
                console.log('Defender casualties', defenderCasualties)
              }
              report.logs.push(log)
              if (attackerTroop.quantity <= 0) attackerArmy.splice(attackerIndex, 1)
              if (defenderTroop.quantity <= 0) defenderArmy.splice(defenderIndex, 1)
              attackerIndex = attackerArmy[attackerIndex + 1] !== undefined ? attackerIndex + 1 : Math.floor(Math.random() * attackerArmy.length)
              defenderIndex = defenderArmy[defenderIndex + 1] !== undefined ? defenderIndex + 1 : Math.floor(Math.random() * defenderArmy.length)
              if (attackerArmy[attackerIndex] === undefined || defenderArmy[defenderIndex] === undefined) break
            }
            console.log('POWER', attackerPowerLost, defenderPowerLost)
            victory = attackerArmy.length > 0 // if i still have army
              ? defenderArmy.length > 0 // if he still has army
                ? defenderPowerLost > attackerPowerLost * 1.20 // if he loses more than me by > 20%
                : true
              : false
          }
          let conquered = null
          let sieged = null
          let gold = null
          let people = null
          let kills = null
          let artifact = null
          // result
          if (victory) {
            if (strategy === 'lbl_strategy_pillage') {
              let attackerUnits = 0
              attackerArmy.forEach(troop => {
                attackerUnits += troop.quantity
              })
              gold = Math.min(def.gold, attackerUnits * 150)
              people = Math.min(def.people, attackerUnits * 50)
              await defender.ref.update({ people: def.people - people, gold: def.gold - gold })
              await defender.ref.update({ people: atk.people + people, gold: atk.gold + gold })
            } else {
              let percent = strategy === 'lbl_strategy_conquest' ? 0.03 : 0.06
              sieged = 0
              let siege = []
              kills = Math.floor(def.people * percent)
              await defender.ref.update({ people: def.people - kills })
              await defender.ref.child('constructions').once('value', constructions => {
                constructions.forEach(construction => {
                  let checkTerrainProductionDestruction = construction.val()
                  let quantity = Math.floor(checkTerrainProductionDestruction.quantity * percent)
                  construction.ref.update({ quantity: checkTerrainProductionDestruction.quantity - quantity })
                  sieged += quantity
                  siege.push(quantity)
                })
              })
              if (strategy === 'lbl_strategy_conquest') {
                let index = 0
                conquered = sieged
                sieged = null
                await attacker.ref.child('constructions').once('value', constructions => {
                  constructions.forEach(construction => {
                    let cons = construction.val()
                    construction.ref.update({ quantity: cons.quantity + siege[index] })
                  })
                })
              }
            }
            await sendUserMessage(attacker.key, def.name, def.color, 'lbl_message_battle_win', strategy + '_description', report, artifact, gold, people, kills, conquered, sieged)
            await sendUserMessage(defender.key, atk.name, atk.color, 'lbl_message_battle_lose', strategy + '_description', report, artifact, gold, people, kills, conquered, sieged)
          } else {
            await sendUserMessage(attacker.key, def.name, def.color, 'lbl_message_battle_lose', strategy + '_description', report, artifact, gold, people, kills, conquered, sieged)
            await sendUserMessage(defender.key, atk.name, atk.color, 'lbl_message_battle_win', strategy + '_description', report, artifact, gold, people, kills, conquered, sieged)
          }
        }
      })
    }
  })
}
