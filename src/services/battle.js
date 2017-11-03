import { database } from './firebase'
import store from '../vuex/store'
import i18n from './i18n'
import { sendUserMessage } from './api'

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
