<template lang="pug">
  mu-card.building
    mu-card-media
      img(:src="data.image")
      #title(:class="data.color") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="construction")
      mu-card-text
        form
          mu-text-field(type="number", v-model="ammount", min="0", required, :label="translate('lbl_label_quantity')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="demolish") {{ 'lbl_button_demolish' | translate }}
        mu-raised-button(primary, @click="construct") {{ 'lbl_button_construct' | translate }}

    template(v-if="exploration")
      mu-card-text
        form
          mu-text-field(type="number", v-model="ammount", min="0", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="explore") {{ 'lbl_button_explore' | translate }}

    template(v-if="meditation")
      mu-card-text
        form
          mu-text-field(type="number", v-model="ammount", min="0", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="meditate") {{ 'lbl_button_meditate' | translate }}

    template(v-if="tax")
      mu-card-text
        form
          mu-text-field(type="number", v-model="ammount", min="0", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="collect") {{ 'lbl_button_collect' | translate }}
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'

  export default {
    name: 'building',
    props: ['data', 'exploration', 'construction', 'meditation', 'tax'],
    data () {
      return {
        ammount: 0
      }
    },
    created () {
      this.ammount = this.data.quantity
    },
    firebase: {
      user: firebase.ref('users').child(store.state.username)
    },
    methods: {
      demolish () {
        // TODO
      },
      construct () {
        if (this.user.territory >= this.ammount) {
          if (this) {
            // TODO
            store.commit('success', 'lbl_toast_success_ok')
          } else {
            store.commit('error', 'lbl_toast_error_resources')
          }
        } else {
          store.commit('error', 'lbl_toast_error_territory')
        }
      },
      explore () {
        // TODO
      },
      meditate () {
        // TODO
      },
      collect () {
        // TODO
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
