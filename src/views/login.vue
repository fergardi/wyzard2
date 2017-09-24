<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.animated.fadeInUp
        form
          mu-card-media
            img(src="https://img00.deviantart.net/283d/i/2013/268/6/1/portals_7th_heaven_by_ivany86-d6m22w2.png")
            #info
              #title {{ 'lbl_label_enter' | translate }}
          mu-card-text
            mu-tabs(:value="tab", @change="change")
              mu-tab(value="login", :title="translate('lbl_title_authentication')")
              mu-tab(value="signin", :title="translate('lbl_title_registration')")
          mu-card-text
            mu-text-field(v-model="username", :label="translate('lbl_label_username')", :hintText="translate('lbl_label_username')", :fullWidth="true", v-if="tab === 'signin'", required)
            mu-select-field(v-model="color", :label="translate('lbl_label_faction')", :fullWidth="true", v-if="tab === 'signin'", required)
              mu-menu-item(v-for="faction, index in factions", :key="index", :value="faction.color", :title="translate(faction.name)")
            mu-text-field(v-model="email", :label="translate('lbl_label_email')", :hintText="translate('lbl_label_email')", :fullWidth="true", type="email", required)
            mu-text-field(v-model="password", :label="translate('lbl_label_password')", :hintText="translate('lbl_label_password')", :fullWidth="true", type="password", :errorText="insecure ? this.translate('lbl_label_password_insecure') : ''", required)
            mu-text-field(v-model="confirm_password", :label="translate('lbl_label_password_confirm')", :hintText="translate('lbl_label_password_confirm')", :fullWidth="true", type="password", v-if="tab === 'signin'", :errorText="mismatch ? translate('lbl_label_password_mismatch') : ''", required)
          mu-card-actions
            mu-raised-button(primary, type="reset") {{ 'lbl_button_clear' | translate }}
            mu-raised-button(primary, @click="login", v-if="tab === 'login'") {{ 'lbl_button_login' | translate }}
            mu-raised-button(primary, @click="signin", v-if="tab === 'signin'", :disabled="insecure || mismatch") {{ 'lbl_button_signin' | translate }}
</template>

<script>
  import { authenticate, register, database, auth } from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
    name: 'login',
    data () {
      return {
        tab: 'login',
        username: 'prueba',
        color: 'red',
        email: 'prueba@prueba.com',
        password: 'prueba',
        confirm_password: 'prueba'
      }
    },
    created () {
      store.commit('title', 'lbl_wyzard')
    },
    firebase: {
      factions: database.ref('factions'),
      users: database.ref('users'),
      user: {
        source: database.ref('user'),
        asObject: true
      }
    },
    methods: {
      login () {
        authenticate(this.email, this.password)
        .then(response => {
          store.commit('username', auth.currentUser.uid)
          this.$router.push('/census')
        })
        .catch(error => {
          console.error(error)
        })
      },
      signin () {
        if (!this.insecure && !this.mismatch) {
          register(this.email, this.password)
          .then(response => {
            let mage = {...this.user}
            mage.name = this.username
            mage.email = this.email
            mage.color = this.color
            delete mage['.key']
            this.$firebaseRefs.users.child(auth.currentUser.uid).set(mage)
            store.commit('username', auth.currentUser.uid)
            this.$router.push('/census')
          })
          .catch(error => {
            console.error(error)
          })
        }
      },
      change (value) {
        this.tab = value
      }
    },
    computed: {
      mismatch () {
        return this.password !== this.confirm_password
      },
      insecure () {
        return this.tab === 'signin' && this.password.length <= 5
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
