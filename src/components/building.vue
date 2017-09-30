<template lang="pug">
  mu-card.building
    mu-card-media
      img(:src="data.image")
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
    name: 'building',
    props: ['data', 'exploration', 'construction', 'meditation', 'tax'],
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
        // TODO
        store.commit('success', 'lbl_toast_construction_ok')
        this.close()
      },
      explore () {
        // TODO
        store.commit('success', 'lbl_toast_exploration_ok')
        this.close()
      },
      meditate () {
        // TODO
        store.commit('success', 'lbl_toast_meditation_ok')
        this.close()
      },
      collect () {
        // TODO
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
