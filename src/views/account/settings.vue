<template lang="pug">
  mu-row
    mu-col(width="100", tablet="66", desktop="50")
      mu-card.settings.animated.fadeInUp
        form(@submit.stop.prevent="confirm('restore')")
          mu-card-media
            img(:v-lazy-load="picture('miscellaneous', 'settings')", :src="picture('miscellaneous', 'loading')", :alt="translate('lbl_label_settings')")
            .card-info
              .card-text {{ 'lbl_label_settings' | translate }}
          mu-card-text
            p {{ 'lbl_description_settings' | translate }}

          mu-card-text
            .form-row
              mu-select-field(v-model="settings.lang", :label="translate('lbl_settings_language')", :fullWidth="true", @input="save")
                mu-menu-item(v-for="language, index in languages", :key="index", :value="language.key", :title="translate(language.value)")
            
            .form-row
              mu-checkbox(v-model="settings.navbar", :label="translate('lbl_settings_navbar')", @input="save")

          mu-card-actions
            mu-raised-button(primary, type="submit") {{ 'lbl_button_restore' | translate }}

    confirm-dialog(:dialog="dialog", :busy="busy", @close="close", @accept="accept") 
</template>

<script>
  import { database } from '../../services/firebase'
  import store from '../../vuex/store'
  import confirm from '../../components/confirm-dialog'
  
  export default {
    components: {
      'confirm-dialog': confirm
    },
    created () {
      store.commit('title', 'lbl_title_settings')
      store.commit('help', 'txt_help_settings')
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
      async save (value) {
        if (store.state.uid) {
          await database.ref('users').child(store.state.uid).child('settings').set(this.settings)
          store.commit('success', 'lbl_toast_settings_saved')
        }
      },
      async restore () {
        await database.ref('user').child('settings').transaction(updated => {
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
        store.commit('success', 'lbl_toast_settings_restored')
        this.close()
      },
      close () {
        this.type = null
        this.dialog = false
        this.busy = false
      }
    },
    computed: {
      settings () {
        return store.state.user !== null ? store.state.user.settings : store.state.settings
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .settings
    .form-row
      display flex
      justify-content flex-start
      align-items center
      .mu-text-field
        width 100%
      .mu-select-field
        width 100%
</style>
