<template lang="pug">
  mu-card.building
    mu-card-media
      img(:src="data.image", :alt="translate(data.name)")
      .card-info
        .card-title(:class="data.color") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="data.quantity != null") {{ data.quantity | numeric }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="construction")
      form(@submit.stop.prevent="confirm('construct')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", required, :label="translate('lbl_label_quantity')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit") {{ 'lbl_button_construct_demolish' | translate }}

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

    template(v-if="tax")
      form(@submit.stop.prevent="confirm('collect')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit") {{ 'lbl_button_collect' | translate }}

    mu-dialog(:open="dialog", @close="close")
      mu-card.dialog
        mu-card-header(:title="translate('lbl_label_confirm')", :subTitle="translate('lbl_label_cannot_undo')")
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
      tax: Boolean
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
        database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).transaction(building => {
          database.ref('users').child(store.state.uid).transaction(user => {
            if (this.amount > 0) {
              building.quantity += Math.min(user.territory, this.amount)
              user.territory -= Math.min(user.territory, this.amount)
            } else {
              building.quantity -= Math.min(building.quantity, Math.abs(this.amount))
              user.territory += Math.min(building.quantity, Math.abs(this.amount))
            }
            user.turns = Math.max(0, user.turns - Math.abs(this.amount))
            return user
          })
          return building
        })
        store.commit('success', 'lbl_toast_construction_ok')
        this.close()
      },
      explore () {
        database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).transaction(building => {
          building.quantity += this.amount
          database.ref('users').child(store.state.uid).transaction(user => {
            user.territory += this.amount
            user.turns = Math.max(0, user.turns - this.amount)
            return user
          })
          return building
        })
        store.commit('success', 'lbl_toast_exploration_ok')
        this.close()
      },
      meditate () {
        database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).transaction(building => {
          database.ref('users').child(store.state.uid).transaction(user => {
            user.mana += building.quantity * building.essence * this.amount
            user.turns = Math.max(0, user.turns - this.amount)
            return user
          })
          return building
        })
        store.commit('success', 'lbl_toast_meditation_ok')
        this.close()
      },
      collect () {
        database.ref('users').child(store.state.uid).child('constructions').child(this.data['.key']).transaction(building => {
          database.ref('users').child(store.state.uid).transaction(user => {
            user.gold += building.quantity * building.taxes * this.amount
            user.turns = Math.max(0, user.turns - this.amount)
            return user
          })
          return building
        })
        store.commit('success', 'lbl_toast_tax_ok')
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
