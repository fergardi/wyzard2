<template lang="pug">
  mu-row
    mu-col(width="100", tablet="66", desktop="50")
      mu-card.settings.animated.fadeInUp
        form(@submit.stop.prevent="confirm('restore')")
          mu-card-media
            img(src="http://dovga.net/images/photo/872-drevnie-chasi-1000.jpg", :alt="translate('lbl_label_settings')")
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

        mu-dialog(:open="dialog", @close="close")
          mu-card.dialog
            mu-card-media
              img(src="https://static1.squarespace.com/static/5356aa98e4b0e10db1993391/t/535b376de4b0482b3e27feb8/1398486899036/Sign+in+Blood.jpg", :alt="translate('lbl_label_confirm')")
              .card-info
                .card-text {{ 'lbl_label_confirm' | translate }}
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
    created () {
      store.commit('title', 'lbl_title_settings')
    },
    data () {
      return {
        type: null,
        dialog: false,
        languages: [
          { key: 'es', value: 'lbl_language_spanish' },
          { key: 'en', value: 'lbl_language_english' }
        ]
      }
    },
    methods: {
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
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
        this.close()
      },
      close () {
        this.type = null
        this.dialog = false
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
