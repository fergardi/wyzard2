<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.settings.animated.fadeInUp
        form
          mu-card-media
            img(src="http://dovga.net/images/photo/872-drevnie-chasi-1000.jpg")
            #info
              #title {{ 'lbl_label_settings' | translate }}
          mu-card-text
            .mu-text-field-label {{ 'lbl_settings_menu' | translate }}
            mu-checkbox(v-model="settings.navbar", :label="translate('lbl_settings_navbar')", @change="update")
          mu-card-text
            mu-select-field(v-model="settings.lang", :label="translate('lbl_settings_language')",  @change="update", :fullWidth="true")
              mu-menu-item(v-for="language, index in languages", :key="index", :value="language.key", :title="translate(language.value)")
</template>

<script>
  // import { database } from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
    name: 'settings',
    created () {
      store.commit('title', 'lbl_title_settings')
      // this.$bindAsObject('user', database.ref('users').child(store.state.username))
    },
    data () {
      return {
        languages: [
          { key: 'es', value: 'lbl_language_spanish' },
          { key: 'en', value: 'lbl_language_english' }
        ]
      }
    },
    methods: {
      update () {
        // this.$firebaseRefs.user.child('settings').remove()
        // this.$firebaseRefs.user.child('settings').set(this.settings)
      }
    },
    computed: {
      settings () {
        return store.state.settings
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
