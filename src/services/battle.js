import { database } from '@/services/firebase'
import store from '@/vuex/store'
import i18n from '@/services/i18n'
import { sendMessageToUser, addEnchantmentToUser, spyInformationToUser } from '@/services/api'

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
            logs: [],
            resurrections: []
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
          if (def.defense && (def.defense.first || def.defense.second || def.defense.third || def.defense.fourth || def.defense.fifth)) {
            if (def.defense.first) {
              await defender.ref.child('troops').child(def.defense.first).once('value', troop => {
                let wave = { troop: troop.val(), quantity: troop.val().quantity }
                wave.troop['.key'] = troop.key
                defenderArmy.push(wave)
              })
            }
            if (def.defense.second) {
              await defender.ref.child('troops').child(def.defense.second).once('value', troop => {
                let wave = { troop: troop.val(), quantity: troop.val().quantity }
                wave.troop['.key'] = troop.key
                defenderArmy.push(wave)
              })
            }
            if (def.defense.third) {
              await defender.ref.child('troops').child(def.defense.third).once('value', troop => {
                let wave = { troop: troop.val(), quantity: troop.val().quantity }
                wave.troop['.key'] = troop.key
                defenderArmy.push(wave)
              })
            }
            if (def.defense.fourth) {
              await defender.ref.child('troops').child(def.defense.fourth).once('value', troop => {
                let wave = { troop: troop.val(), quantity: troop.val().quantity }
                wave.troop['.key'] = troop.key
                defenderArmy.push(wave)
              })
            }
            if (def.defense.fifth) {
              await defender.ref.child('troops').child(def.defense.fifth).once('value', troop => {
                let wave = { troop: troop.val(), quantity: troop.val().quantity }
                wave.troop['.key'] = troop.key
                defenderArmy.push(wave)
              })
            }
          } else {
            await defender.ref.child('troops').limitToFirst(5).once('value', troops => {
              if (troops) {
                troops.forEach(unit => {
                  let troop = unit.val()
                  troop['.key'] = unit.key
                  defenderArmy.push({
                    troop: troop,
                    quantity: troop.quantity
                  })
                })
              }
            })
          }
          let discovered = false
          let survivors = 0
          if (strategy === 'lbl_strategy_pillage') {
            console.log('PILLAGE')
            let defenderTerrain = 0
            let defenderUnits = 0
            let attackerUnits = 0
            survivors = 0
            defenderArmy.forEach(troop => {
              defenderUnits += troop.quantity
            })
            attackerArmy.forEach(troop => {
              attackerUnits += troop.quantity
              survivors += troop.quantity
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
            console.log('DIRECT VICTORY')
            victory = true
          } else {
            console.log('NOT DIRECT VICTORY, STARTING BATTLE')
            // blessings
            let attackerGodDamageBonus = 0
            let attackerGodHealthBonus = 0
            await database.ref('gods').orderByChild('blessed').equalTo(uid).once('value', attackerBlessings => {
              if (attackerBlessings) {
                attackerBlessings.forEach(attackerBlessing => {
                  let blessing = attackerBlessing.val()
                  report.gods.push({ left: true, name: blessing.name, color: blessing.color })
                  console.log('ATTACKER BLESSING: ' + blessing.name)
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
                  console.log('DEFENSE BLESSING: ' + blessing.name)
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
            let attackerContractTroops = 0
            if (atk.contracts) {
              await attacker.ref.child('contracts').once('value', contracts => {
                if (contracts) {
                  contracts.forEach(contract => {
                    let attackerContract = contract.val()
                    if (attackerContract.battle) {
                      report.heroes.push({ left: true, name: attackerContract.name, color: attackerContract.color, level: attackerContract.level })
                      console.log('ATTACKER CONTRACT: ' + attackerContract.name)
                      attackerContractTroops += attackerContract.troop * attackerContract.level
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
            let defenderContractTroops = 0
            if (def.contracts) {
              await defender.ref.child('contracts').once('value', contracts => {
                if (contracts) {
                  contracts.forEach(contract => {
                    let defenderContract = contract.val()
                    if (defenderContract.battle) {
                      report.heroes.push({ left: false, name: defenderContract.name, color: defenderContract.color, level: defenderContract.level })
                      console.log('DEFENDER CONTRACT: ' + defenderContract.name)
                      defenderContractTroops += defenderContract.troop * defenderContract.level
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
            let defenderSpell = null
            if (def.defense && def.defense.spell) {
              await database.ref('users').child(target).child('book').child(def.defense.spell).once('value', spell => {
                if (spell) {
                  defenderSpell = spell.val()
                }
              })
            }
            if (defenderSpell && defenderSpell.battle) {
              if (defenderSpell.counter > 0 && defenderSpell.manaCost <= def.mana) {
                let counterChance = defenderSpell.counter * def.magic
                if (Math.random() * 100 <= counterChance) {
                  report.spells.push({ left: false, level: def.magic, name: defenderSpell.name, color: defenderSpell.color })
                  console.log('DEFENDER COUNTER SPELL')
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
                    console.log('ATTACKER COUNTER SPELL')
                    defenderSpell = null
                  }
                }
              }
            }
            let defenderSpellDamageBonus = 0
            let defenderSpellHealthBonus = 0
            let attackerSpellTroops = 0
            let defenderSpellTroops = 0
            let attackerSpellDamageBonus = 0
            let attackerSpellHealthBonus = 0
            // spells
            if (defenderSpell && defenderSpell.battle) {
              await database.ref('users').child(target).update({ mana: def.mana - defenderSpell.manaCost })
              report.spells.push({ left: false, level: def.magic, name: defenderSpell.name, color: defenderSpell.color })
              console.log('DEFENDER SPELL: ' + defenderSpell.name)
              if (defenderSpell.support) {
                if (defenderSpell.damage > 0) defenderSpellDamageBonus += defenderSpell.damage * def.magic
                if (defenderSpell.health > 0) defenderSpellHealthBonus += defenderSpell.health * def.magic
                if (defenderSpell.troop > 0) defenderSpellTroops += defenderSpell.troop * def.magic
              } else {
                if (defenderSpell.damage < 0) attackerSpellDamageBonus += defenderSpell.damage * def.magic
                if (defenderSpell.health < 0) attackerSpellHealthBonus += defenderSpell.health * def.magic
                if (defenderSpell.troop < 0) attackerSpellTroops += defenderSpell.troop * def.magic
              }
            }
            if (attackerSpell && attackerSpell.battle) {
              let spellChance = Math.random() * 100
              if (spellChance > def.magicalDefense) {
                await database.ref('users').child(uid).update({ mana: atk.mana - attackerSpell.manaCost })
                report.spells.push({ left: true, level: atk.magic, name: attackerSpell.name, color: attackerSpell.color })
                console.log('ATTACKER SPELL: ' + attackerSpell.name)
                if (attackerSpell.enchantment && !attackerSpell.support) {
                  await addEnchantmentToUser(target, attackerSpell.name, uid, atk.magic)
                } else if (attackerSpell.spionage > 0) {
                  let spyChance = Math.random() * 100
                  if (spyChance <= attackerSpell.spionage * atk.magic) {
                    let spionage = await spyInformationToUser(target)
                    await sendMessageToUser(uid, def.name, def.color, 'lbl_message_spionage', 'lbl_message_spionage_description', null, null, null, null, null, null, null, null, spionage)
                  }
                } else {
                  if (attackerSpell.support) {
                    if (attackerSpell.damage > 0) attackerSpellDamageBonus += attackerSpell.damage * def.magic
                    if (attackerSpell.health > 0) attackerSpellHealthBonus += attackerSpell.health * def.magic
                    if (attackerSpell.troop > 0) attackerSpellTroops += attackerSpell.troop * def.magic
                  } else {
                    if (attackerSpell.damage < 0) defenderSpellDamageBonus += attackerSpell.damage * def.magic
                    if (attackerSpell.health < 0) defenderSpellHealthBonus += attackerSpell.health * def.magic
                    if (attackerSpell.troop < 0) defenderSpellTroops += attackerSpell.troop * def.magic
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
            let attackerArtifactTroops = 0
            let defenderArtifactTroops = 0
            let defenderArtifact = null
            let attackerArtifactDamageBonus = 0
            let attackerArtifactHealthBonus = 0
            if (def.defense && def.defense.artifact) {
              await database.ref('users').child(target).child('relics').child(def.defense.artifact).once('value', artifact => {
                if (artifact && artifact.val().quantity > 0) {
                  defenderArtifact = artifact.val()
                }
              })
            }
            if (defenderArtifact && defenderArtifact.battle) {
              report.artifacts.push({ left: false, name: defenderArtifact.name, color: defenderArtifact.color })
              console.log('DEFENDER ARTIFACT: ' + defenderArtifact.name)
              if (defenderArtifact.support) {
                if (defenderArtifact.damage > 0) defenderArtifactDamageBonus += defenderArtifact.damage
                if (defenderArtifact.health > 0) defenderArtifactHealthBonus += defenderArtifact.health
                if (defenderArtifact.troop > 0) defenderArtifactTroops += defenderArtifact.troop
                if (defenderArtifact.round > 0) rounds += defenderArtifact.round
              } else {
                if (defenderArtifact.damage < 0) attackerArtifactDamageBonus += defenderArtifact.damage
                if (defenderArtifact.health < 0) attackerArtifactHealthBonus += defenderArtifact.health
                if (defenderArtifact.troop < 0) attackerArtifactTroops += defenderArtifact.troop
                if (defenderArtifact.round < 0) rounds += defenderArtifact.round
              }
              if (defenderArtifact.spionage) {
                let spionage = await spyInformationToUser(uid)
                await sendMessageToUser(target, atk.name, atk.color, 'lbl_message_spionage', 'lbl_message_spionage_description', null, null, null, null, null, null, null, null, spionage)
              }
              if (defenderArtifact.quantity - 1 <= 0) {
                await database.ref('users').child(target).child('defense').child('artifact').remove()
                if (def.defense && def.defense.artifact === defenderArtifact['.key']) await database.ref('users').child(target).child('relics').child(def.defense.artifact).remove()
              } else {
                await database.ref('users').child(target).child('relics').child(def.defense.artifact).update({ quantity: defenderArtifact.quantity-- })
              }
            }
            // attacker artifact
            if (attackerArtifact && attackerArtifact.battle) {
              report.artifacts.push({ left: true, name: attackerArtifact.name, color: attackerArtifact.color })
              console.log('ATTACKER ARTIFACT: ' + attackerArtifact.name)
              if (attackerArtifact.support) {
                if (attackerArtifact.damage > 0) attackerArtifactDamageBonus += attackerArtifact.damage
                if (attackerArtifact.health > 0) attackerArtifactHealthBonus += attackerArtifact.health
                if (attackerArtifact.troop > 0) attackerArtifactTroops += attackerArtifact.troop
                if (attackerArtifact.round > 0) rounds += attackerArtifact.round
              } else {
                if (attackerArtifact.damage < 0) defenderArtifactDamageBonus += attackerArtifact.damage
                if (attackerArtifact.health < 0) defenderArtifactHealthBonus += attackerArtifact.health
                if (attackerArtifact.troop < 0) defenderArtifactTroops += attackerArtifact.troop
                if (attackerArtifact.round < 0) rounds += attackerArtifact.round
              }
              if (attackerArtifact.spionage) {
                let spionage = await spyInformationToUser(target)
                await sendMessageToUser(uid, def.name, def.color, 'lbl_message_spionage', 'lbl_message_spionage_description', null, null, null, null, null, null, null, null, spionage)
              }
              if (attackerArtifact.quantity - 1 <= 0) {
                await database.ref('users').child(uid).child('relics').child(attackerArtifact['.key']).remove()
                if (atk.defense && atk.defense.artifact === attackerArtifact['.key']) await database.ref('users').child(uid).child('relics').child(atk.defense.artifact).remove()
              } else {
                await database.ref('users').child(uid).child('relics').child(attackerArtifact['.key']).update({ quantity: attackerArtifact.quantity-- })
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
                wave.quantity = Math.floor(wave.quantity * (1 + (defenderArtifactTroops / 100)))
              }
              // defender spell
              if (defenderSpell && defenderSpell.support && (defenderSpell.multiple || defenderArmyIndex === defenderSpellIndex)) {
                wave.damage += defenderSpellDamageBonus
                wave.health += defenderSpellHealthBonus
                wave.quantity = Math.floor(wave.quantity * (1 + (defenderSpellTroops / 100)))
              }
              // attacker artifact
              if (attackerArtifact && !attackerArtifact.support && (attackerArtifact.multiple || defenderArmyIndex === attackerArtifactIndex)) {
                wave.damage += attackerArtifactDamageBonus
                wave.health += attackerArtifactHealthBonus
                wave.quantity = Math.floor(wave.quantity * (1 + (attackerArtifactTroops / 100)))
              }
              // attacker spell
              if (attackerSpell && !attackerSpell.support && (attackerSpell.multiple || defenderArmyIndex === attackerSpellIndex)) {
                wave.damage += attackerSpellDamageBonus
                wave.health += attackerSpellHealthBonus
                wave.quantity = Math.floor(wave.quantity * (1 + (attackerSpellTroops / 100)))
              }
              // defender heroes
              wave.quantity = Math.floor(wave.quantity * (1 + (defenderContractTroops / 100)))
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
              console.log('DEFENDER WAVE', wave)
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
                wave.quantity = Math.floor(wave.quantity * (1 + (attackerArtifactTroops / 100)))
              }
              // attacker spell
              if (attackerSpell && attackerSpell.support && (attackerSpell.multiple || attackerArmyIndex === attackerSpellIndex)) {
                wave.damage += attackerSpellDamageBonus
                wave.health += attackerSpellHealthBonus
                wave.quantity = Math.floor(wave.quantity * (1 + (attackerSpellTroops / 100)))
              }
              // defender artifact
              if (defenderArtifact && !defenderArtifact.support && (defenderArtifact.multiple || attackerArmyIndex === defenderArtifactIndex)) {
                wave.damage += defenderArtifactDamageBonus
                wave.health += defenderArtifactHealthBonus
                wave.quantity = Math.floor(wave.quantity * (1 + (defenderArtifactTroops / 100)))
              }
              // defender spell
              if (defenderSpell && !defenderSpell.support && (defenderSpell.multiple || attackerArmyIndex === defenderSpellIndex)) {
                wave.damage += defenderSpellDamageBonus
                wave.health += defenderSpellHealthBonus
                wave.quantity = Math.floor(wave.quantity * (1 + (defenderSpellTroops / 100)))
              }
              // attacker heroes
              wave.quantity = Math.floor(wave.quantity * (1 + (attackerContractTroops / 100)))
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
              console.log('ATTACKER WAVE', wave)
              attackerArmyIndex++
            })
            // deaths
            let attackerDeathTroops = []
            let defenderDeathTroops = []
            survivors = 0
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
              let defenderTroop = defenderArmy[defenderIndex]
              console.log('ROUND ' + parseInt(i + 1) + '/' + rounds)
              console.log(attackerTroop.quantity, translate(attackerTroop.troop.name), translate(attackerTroop.troop.family), translate(attackerTroop.troop.type), '+' + attackerTroop.damage + '% Dmg', '+' + attackerTroop.health + '% Hth', '<== VS ==>', defenderTroop.quantity, translate(defenderTroop.troop.name), translate(defenderTroop.troop.family), translate(defenderTroop.troop.type), '+' + defenderTroop.damage + '% Dmg', '+' + defenderTroop.health + '% Hth')
              if (rockScissorsPaper(attackerTroop.troop.type, defenderTroop.troop.type)) {
                let defenderCasualties = Math.min(defenderTroop.quantity, Math.floor((attackerTroop.troop.damage * attackerTroop.quantity * (1 + attackerTroop.damage / 100)) / (defenderTroop.troop.health * (1 + defenderTroop.health / 100))))
                log.attacker = { left: true, name: attackerTroop.troop.name, color: attackerTroop.troop.color, quantity: attackerTroop.quantity, casualties: defenderCasualties }
                defenderTroop.quantity -= defenderCasualties
                defenderPowerLost += defenderCasualties * defenderTroop.troop.power
                console.log('ATTACKER => DEFENDER: ' + defenderCasualties)
                let attackerCasualties = Math.min(attackerTroop.quantity, Math.floor((defenderTroop.troop.damage * defenderTroop.quantity * (1 + defenderTroop.damage / 100)) / (attackerTroop.troop.health * (1 + attackerTroop.health / 100))))
                log.defender = { left: false, name: defenderTroop.troop.name, color: defenderTroop.troop.color, quantity: defenderTroop.quantity, casualties: attackerCasualties }
                attackerTroop.quantity -= attackerCasualties
                attackerPowerLost += attackerCasualties * attackerTroop.troop.power
                console.log('ATTACKER <= DEFENDER: ' + attackerCasualties)
              } else {
                let attackerCasualties = Math.min(attackerTroop.quantity, Math.floor((defenderTroop.troop.damage * defenderTroop.quantity * (1 + defenderTroop.damage / 100)) / (attackerTroop.troop.health * (1 + attackerTroop.health / 100))))
                log.attacker = { left: false, name: defenderTroop.troop.name, color: defenderTroop.troop.color, quantity: defenderTroop.quantity, casualties: attackerCasualties }
                attackerTroop.quantity -= attackerCasualties
                attackerPowerLost += attackerCasualties * attackerTroop.troop.power
                console.log('ATTACKER <= DEFENDER: ' + attackerCasualties)
                let defenderCasualties = Math.min(defenderTroop.quantity, Math.floor((attackerTroop.troop.damage * attackerTroop.quantity * (1 + attackerTroop.damage / 100)) / (defenderTroop.troop.health * (1 + defenderTroop.health / 100))))
                log.defender = { left: true, name: attackerTroop.troop.name, color: attackerTroop.troop.color, quantity: attackerTroop.quantity, casualties: defenderCasualties }
                defenderTroop.quantity -= defenderCasualties
                defenderPowerLost += defenderCasualties * defenderTroop.troop.power
                console.log('ATTACKER => DEFENDER: ' + defenderCasualties)
              }
              report.logs.push(log)
              // deaths
              if (attackerTroop.quantity <= 0) {
                attackerDeathTroops.push(attackerTroop.troop['.key'])
                attackerArmy.splice(attackerIndex, 1)
                console.log('ATTACKER TROOP IS DEAD: ', attackerTroop.troop)
              }
              if (defenderTroop.quantity <= 0) {
                defenderDeathTroops.push(defenderTroop.troop['.key'])
                defenderArmy.splice(defenderIndex, 1)
                console.log('DEFENDER TROOP IS DEAD: ', defenderTroop.troop)
              }
              attackerIndex = attackerArmy[attackerIndex + 1] !== undefined ? attackerIndex + 1 : Math.floor(Math.random() * attackerArmy.length)
              console.log('NEXT ATTACKER WAVE ', attackerArmy[attackerIndex])
              defenderIndex = defenderArmy[defenderIndex + 1] !== undefined ? defenderIndex + 1 : Math.floor(Math.random() * defenderArmy.length)
              console.log('NEXT DEFENDER WAVE ', defenderArmy[defenderIndex])
              if (attackerArmy[attackerIndex] === undefined || defenderArmy[defenderIndex] === undefined) break
            }
            // check victory condition
            console.log('POWER LOST: ', attackerPowerLost, defenderPowerLost)
            victory = attackerArmy.length > 0 // if i still have army
              ? defenderArmy.length > 0 // if he still has army
                ? defenderPowerLost > attackerPowerLost * 1.20 // if he loses more than me by > 20%
                : true
              : false
            // update original troop quantities
            defenderArmy.forEach(async wave => {
              await database.ref('users').child(target).child('troops').child(wave.troop['.key']).update({ quantity: wave.quantity })
            })
            // remove death waves
            if (defenderDeathTroops.length > 0) {
              await database.ref('users').child(target).child('defense').child('first').remove()
              await database.ref('users').child(target).child('defense').child('second').remove()
              await database.ref('users').child(target).child('defense').child('third').remove()
              await database.ref('users').child(target).child('defense').child('fourth').remove()
              await database.ref('users').child(target).child('defense').child('fifth').remove()
              defenderDeathTroops.forEach(async wave => {
                await database.ref('users').child(target).child('troops').child(wave).remove()
              })
            }
            attackerArmy.forEach(async wave => {
              await database.ref('users').child(uid).child('troops').child(wave.troop['.key']).update({ quantity: wave.quantity })
              survivors += wave.quantity
            })
            if (attackerDeathTroops.length > 0) {
              await database.ref('users').child(uid).child('defense').child('first').remove()
              await database.ref('users').child(uid).child('defense').child('second').remove()
              await database.ref('users').child(uid).child('defense').child('third').remove()
              await database.ref('users').child(uid).child('defense').child('fourth').remove()
              await database.ref('users').child(uid).child('defense').child('fifth').remove()
              attackerDeathTroops.forEach(async wave => {
                await database.ref('users').child(uid).child('troops').child(wave).remove()
              })
            }
          }
          // result
          let conquered = null
          let sieged = null
          let gold = null
          let people = null
          let kills = null
          let artifact = null
          if (victory) {
            console.log('VICTORY')
            if (strategy === 'lbl_strategy_pillage') {
              gold = Math.min(def.gold, survivors * 25) // steal gold per unit alive
              people = Math.min(def.people, survivors * 5) // steal people per unit alive
              await defender.ref.update({ people: def.people - people, gold: def.gold - gold })
              await attacker.ref.update({ people: atk.people + people, gold: atk.gold + gold })
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
            await sendMessageToUser(attacker.key, def.name, def.color, 'lbl_message_battle_win', strategy + '_description', report, artifact, gold, people, kills, conquered, sieged)
            await sendMessageToUser(defender.key, atk.name, atk.color, 'lbl_message_battle_lose', strategy + '_description', report, artifact, gold, people, kills, conquered, sieged)
          } else {
            console.log('DEFEAT')
            await sendMessageToUser(attacker.key, def.name, def.color, 'lbl_message_battle_lose', strategy + '_description', report, artifact, gold, people, kills, conquered, sieged)
            await sendMessageToUser(defender.key, atk.name, atk.color, 'lbl_message_battle_win', strategy + '_description', report, artifact, gold, people, kills, conquered, sieged)
          }
        }
      })
    }
  })
}
