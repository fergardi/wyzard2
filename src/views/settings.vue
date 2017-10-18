<template lang="pug">
  mu-row
    mu-col(width="100", tablet="66", desktop="50")
      mu-card.settings.animated.fadeInUp
        form(@submit.stop.prevent="confirm('restore')")
          mu-card-media
            img(src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/settings.jpg?alt=media", :alt="translate('lbl_label_settings')")
            .card-info
              .card-text {{ 'lbl_label_settings' | translate }}
          mu-card-text
            p {{ 'lbl_description_settings' | translate }}

          mu-card-text
            .mu-text-field-label {{ 'lbl_settings_menu' | translate }}
            mu-checkbox(v-model="settings.navbar", :label="translate('lbl_settings_navbar')", @change="save")

          mu-card-text
            mu-select-field(v-model="settings.lang", :label="translate('lbl_settings_language')", :fullWidth="true", @input="save")
              mu-menu-item(v-for="language, index in languages", :key="index", :value="language.key", :title="translate(language.value)")

          mu-card-actions
            mu-raised-button(primary, type="submit") {{ 'lbl_button_restore' | translate }}

        mu-dialog(:open="dialog")
          mu-card.dialog
            mu-card-media
              img(src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/confirm.jpg?alt=media", :alt="translate('lbl_label_confirm')")
              .card-info
                .card-text {{ 'lbl_label_confirm' | translate }}
            mu-card-text
              p {{ 'lbl_label_cannot_undo' | translate }}
            mu-card-actions
              mu-raised-button(primary, :label="translate('lbl_button_cancel')", @click="close", :disabled="busy")
              mu-raised-button(primary, :label="translate('lbl_button_confirm')", @click="accept", :disabled="busy")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
    created () {
      store.commit('title', 'lbl_title_settings')
    },
    data () {
      return {
        type: null,
        dialog: false,
        languages: [
          { key: 'es', value: 'lbl_language_spanish' },
          { key: 'en', value: 'lbl_language_english' },
          { key: 'fr', value: 'lbl_language_french' }
        ],
        busy: false
      }
    },
    methods: {
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
        this.busy = true
        switch (this.type) {
          case 'restore':
            this.restore()
            break
        }
      },
      save () {
        if (store.state.uid) {
          database.ref('users').child(store.state.uid).child('settings').transaction(settings => {
            if (settings) {
              settings = this.settings
            }
            return settings
          })
          .then(response => {
            store.commit('success', 'lbl_toast_settings_saved')
          })
        }
      },
      restore () {
        database.ref('user').child('settings').transaction(updated => {
          if (updated) {
            if (store.state.uid) {
              let clone = {...updated}
              delete clone['.key']
              database.ref('users').child(store.state.uid).child('settings').set(clone)
            } else {
              store.commit('settings', updated)
            }
          }
          return updated
        })
        .then(response => {
          store.commit('success', 'lbl_toast_settings_restored')
          this.close()
        })
      },
      close () {
        this.type = null
        this.dialog = false
        this.busy = false
      }
    },
    computed: {
      settings () {
        return store.state.user ? store.state.user.settings : store.state.settings
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .settings
    .mu-checkbox
      float left
    .mu-text-field-label
      font-size 16px
      width 100%
      text-align left
    .mu-card-text + .mu-card-text
      margin-top 16px
</style>
