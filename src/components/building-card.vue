<template lang="pug">
  mu-card.building
    mu-card-media
      img(:src="data.image", :alt="translate(data.name)")
      .card-data
        template(v-if="construction")
          .card-progress(v-if="data.name === 'lbl_building_node'") {{ user.mana | numeric }} / {{ data.quantity * data.manaCap | numeric }}
          .card-progress(v-if="data.name === 'lbl_building_barrack'") {{ user.army | numeric }} / {{ data.quantity * data.armyCap | numeric }}
          .card-progress(v-if="data.name === 'lbl_building_barrier'") +{{ data.quantity / data.magicalDefenseBonus | percentage }}
          .card-progress(v-if="data.name === 'lbl_building_fortress'") +{{ data.quantity / data.physicalDefenseBonus | percentage }}
          .card-progress(v-if="data.name === 'lbl_building_guild'") -{{ data.quantity / data.researchBonus | percentage }}
          .card-progress(v-if="data.name === 'lbl_building_temple'") +{{ parseInt(data.quantity / data.enchantmentCap) | numeric }}
          .card-progress(v-if="data.name === 'lbl_building_village'") {{ user.people | numeric }} / {{ data.quantity * data.peopleCap | numeric }}
          .card-progress(v-if="data.name === 'lbl_building_workshop'") -{{ data.quantity / data.constructionBonus | percentage }}
          .card-progress(v-if="data.name === 'lbl_building_farm'") {{ user.gold | numeric }}
        .card-progress(v-if="exploration") +{{ parseInt((data.territoryCap - data.quantity) / 100) | numeric }}
        .card-progress(v-if="meditation") +{{ data.quantity * data.manaProduction * 2 | numeric }}
        .card-progress(v-if="taxation") +{{ data.quantity * data.goldProduction * 2 | numeric }}
      .card-info
        .card-title {{ data.name | translate }}
        .card-number(v-if="data.quantity != null") {{ data.quantity | numeric }}
    mu-card-text
      p.card-description(v-if="construction") {{ data.description | translate }}
      p.card-description(v-if="exploration") {{ 'lbl_description_exploration' | translate }}
      p.card-description(v-if="meditation") {{ 'lbl_description_meditation' | translate }}
      p.card-description(v-if="taxation") {{ 'lbl_description_taxation' | translate }}

    template(v-if="construction")
      form(@submit.stop.prevent="confirm('construct')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", :min="-data.quantity", required, :label="translate('lbl_label_quantity')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit") {{ 'lbl_button_demolish_construct' | translate }}

    template(v-if="exploration")
      form(@submit.stop.prevent="confirm('explore')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit") {{ 'lbl_button_explore' | translate }}

    template(v-if="meditation")
      form(@submit.stop.prevent="confirm('meditate')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit") {{ 'lbl_button_meditate' | translate }}

    template(v-if="taxation")
      form(@submit.stop.prevent="confirm('collect')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit") {{ 'lbl_button_collect' | translate }}

    mu-dialog(:open="dialog", @close="close")
      mu-card.dialog
        mu-card-media
          img(src="https://static1.squarespace.com/static/5356aa98e4b0e10db1993391/t/535b376de4b0482b3e27feb8/1398486899036/Sign+in+Blood.jpg", :alt="translate('lbl_label_confirm')")
          .card-info
            .card-title {{ 'lbl_label_confirm' | translate }}
        mu-card-text
          p {{ 'lbl_label_cannot_undo' | translate }}
        mu-card-actions
          mu-raised-button(primary, :label="translate('lbl_button_cancel')", @click="close")
          mu-raised-button(primary, :label="translate('lbl_button_confirm')", @click="accept")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'

  export default {
    name: 'building-card',
    props: {
      data: Object,
      exploration: Boolean,
      construction: Boolean,
      meditation: Boolean,
      taxation: Boolean
    },
    data () {
      return {
        dialog: false,
        type: null,
        amount: 0
      }
    },
    created () {
      if (store.state.uid) this.$bindAsObject('user', database.ref('users').child(store.state.uid))
    },
    methods: {
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
        switch (this.type) {
          case 'explore':
            this.explore()
            break
          case 'construct':
            this.construct()
            break
          case 'meditate':
            this.meditate()
            break
          case 'collect':
            this.collect()
            break
        }
      },
      construct () {
        if (this.amount <= this.user.terrain) { // user has resources
          database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).transaction(building => {
            if (building) {
              database.ref('users').child(store.state.uid).transaction(user => {
                if (user) {
                  if (this.amount > 0) {
                    if (building.goldCost * this.amount <= user.gold && building.manaCost * this.amount <= user.mana && building.peopleCost * this.amount <= user.people && building.turnsCost * this.amount <= user.turns) {
                      building.quantity += Math.min(user.terrain, this.amount)
                      user.terrain -= Math.min(user.terrain, this.amount)
                      user.turns = Math.max(0, user.turns - Math.abs(this.amount))
                    } else {
                      if (building.turnsCost * this.amount <= user.turns) {
                        store.commit('error', 'lbl_toast_resource_turns')
                      }
                      if (building.goldCost * this.amount <= user.gold) {
                        store.commit('error', 'lbl_toast_resource_gold')
                      }
                      if (building.manaCost * this.amount <= user.mana) {
                        store.commit('error', 'lbl_toast_resource_mana')
                      }
                      if (building.peopleCost * this.amount <= user.people) {
                        store.commit('error', 'lbl_toast_resource_people')
                      }
                    }
                  } else {
                    user.terrain += Math.min(building.quantity, Math.abs(this.amount))
                    building.quantity -= Math.min(building.quantity, Math.abs(this.amount))
                  }
                  return user
                }
              })
              return building
            }
          })
          store.commit('success', 'lbl_toast_construction_ok')
        } else {
          store.commit('error', 'lbl_toast_resource_terrain')
        }
        this.close()
      },
      explore () {
        if (this.amount <= this.user.turns) { // user has resources
          database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).transaction(building => {
            if (building) {
              for (let i = 0; i < this.amount; i++) {
                building.quantity += Math.max(0, Math.floor((building.territoryCap - building.quantity) / 100))
              }
              database.ref('users').child(store.state.uid).transaction(user => {
                if (user) {
                  user.terrain = building.quantity
                  user.turns = Math.max(0, user.turns - this.amount)
                  return user
                }
              })
              return building
            }
          })
          store.commit('success', 'lbl_toast_exploration_ok')
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
        }
        this.close()
      },
      meditate () {
        if (this.amount <= this.user.turns) { // user has resources
          database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).transaction(building => {
            if (building) {
              database.ref('users').child(store.state.uid).transaction(user => {
                if (user) {
                  let meditation = building.quantity * building.manaProduction * this.amount * 2
                  if (user.mana + meditation >= building.quantity * building.manaCap) {
                    store.commit('error', 'lbl_toast_meditation_error')
                  }
                  user.mana = Math.min(building.quantity * building.manaCap, user.mana + meditation)
                  user.turns = Math.max(0, user.turns - this.amount)
                  return user
                }
              })
              return building
            }
          })
          store.commit('success', 'lbl_toast_meditation_ok')
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
        }
        this.close()
      },
      collect () {
        if (this.amount <= this.user.turns) { // user has resources
          database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).transaction(building => {
            if (building) {
              database.ref('users').child(store.state.uid).transaction(user => {
                if (user) {
                  user.gold += building.quantity * building.goldProduction * this.amount * 2
                  user.turns = Math.max(0, user.turns - this.amount)
                  return user
                }
              })
              return building
            }
          })
          store.commit('success', 'lbl_toast_tax_ok')
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
        }
        this.close()
      },
      close () {
        this.type = null
        this.dialog = false
        this.amount = 0
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
