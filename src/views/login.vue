<template lang="pug">
  mu-row
    mu-col(width="100", tablet="66", desktop="50")
      mu-card.login.animated.fadeInUp
        form(@submit.stop.prevent="accept")
          mu-card-media
            img(:src="image", :alt="translate('slogan')")
            mu-circular-progress(v-if="busy", :size="100", color="#ad835a")
            .card-info
              .card-text {{ slogan | translate }}

          mu-card-text
            mu-tabs(:value="tab", @change="change")
              mu-tab(value="login", :title="translate('lbl_tab_authentication')")
              mu-tab(value="signin", :title="translate('lbl_tab_registration')")

          mu-card-text
            .form-row
              mu-text-field(v-model="username", name="username", :label="translate('lbl_label_username')", :hintText="translate('lbl_label_username')", :fullWidth="true", v-if="tab === 'signin'", :errorText="long ? translate('auth/username-too-long') : error && code === 'taken' ? translate('auth/username-already-exists') : ''", @input="error = false", :maxLength="20", required)
            .form-row
              mu-select-field(v-model="color", name="color", :label="translate('lbl_label_faction')", :fullWidth="true", v-if="tab === 'signin'", required)
                mu-menu-item(v-for="faction, index in factions", :key="index", :value="faction.color", :title="translate(faction.name)")
            .form-row
              mu-text-field(v-model="email", name="email", :label="translate('lbl_label_email')", :hintText="translate('lbl_label_email')", :fullWidth="true", type="email", :errorText="error && code === 'exists' ? this.translate('auth/email-already-exists') : error && code === 'invalid' ? this.translate('auth/invalid-credentials') : ''", @input="error = false", required)
            .form-row
              mu-text-field(v-model="password", name="password", :label="translate('lbl_label_password')", :hintText="translate('lbl_label_password')", :fullWidth="true", type="password", :errorText="insecure ? this.translate('auth/password-insecure') : error && code === 'invalid' ? this.translate('auth/invalid-credentials') : ''", pattern=".{6,}", minlength="6", @input="error = false", required)
            .form-row
              mu-text-field(v-model="confirm_password", name="confirm_password", :label="translate('lbl_label_password_confirm')", :hintText="translate('lbl_label_password_confirm')", :fullWidth="true", type="password", v-if="tab === 'signin'", :errorText="mismatch ? translate('auth/password-mismatch') : ''", required)
            .form-row
              mu-checkbox(v-model="remember", :label="translate('lbl_label_remember')")

          mu-card-actions
            mu-raised-button(primary, :aria-label="translate('lbl_button_clear')", :label="translate('lbl_button_clear')", type="reset", :disabled="busy")
            mu-raised-button(primary, :aria-label="translate('lbl_button_login')", :label="translate('lbl_button_login')", type="submit", v-if="tab === 'login'", :disabled="busy")
            mu-raised-button(primary, :aria-label="translate('lbl_button_signin')", :label="translate('lbl_button_signin')", type="submit", v-if="tab === 'signin'", :disabled="disabled || busy")
</template>

<script>
  import { authenticate, register, database, auth } from '../services/firebase'
  import store from '../vuex/store'
  import { createNewUser, updateGeneralStatus } from '../services/api'
  import moment from 'moment'
  
  export default {
    data () {
      return {
        busy: false,
        error: false,
        code: null,
        remember: true,
        tab: 'login',
        username: 'prueba',
        color: 'red',
        email: 'prueba@prueba.com',
        password: 'prueba',
        confirm_password: 'prueba'
      }
    },
    created () {
      store.commit('title', 'lbl_title_wyzard')
      store.commit('help', 'txt_help_login')
    },
    firebase: {
      factions: database.ref('factions'),
      spells: database.ref('spells'),
      units: database.ref('units'),
      gods: database.ref('gods'),
      users: database.ref('users'),
      auctions: database.ref('auctions'),
      tavern: database.ref('tavern'),
      heroes: database.ref('heroes'),
      artifacts: database.ref('artifacts'),
      places: database.ref('places'),
      buildings: database.ref('buildings'),
      user: {
        source: database.ref('user'),
        asObject: true
      }
    },
    methods: {
      accept () {
        this.busy = true
        switch (this.tab) {
          case 'login':
            this.login()
            break
          case 'signin':
            this.signin()
            break
        }
      },
      login () {
        authenticate(this.email, this.password, this.remember)
        .then(async () => {
          await updateGeneralStatus(store.state.uid)
          this.busy = false
          this.$router.push('/messages')
        })
        .catch(error => {
          this.error = true
          this.code = 'invalid'
          this.busy = false
          store.commit('error', error.code)
        })
      },
      signin () {
        if (this.users.find(u => u.name.toLowerCase() === this.username.toLowerCase()) !== undefined) {
          this.error = true
          this.code = 'taken'
          this.busy = false
          store.commit('error', 'auth/username-already-exists')
        }
        if (!this.disabled) {
          register(this.email, this.password, this.remember)
          .then(async () => {
            // player
            let player = {...this.user}
            player.name = this.username
            player.email = this.email
            player.color = this.color
            delete player['.key']
            await this.$firebaseRefs.users.child(auth.currentUser.uid).set(player)
            createNewUser(auth.currentUser.uid, player)
            store.commit('uid', auth.currentUser.uid)
            store.commit('success', 'auth/registration-ok')
            this.busy = false
            this.$router.push('/kingdom')
          })
          .catch(error => {
            if (error.code === 'auth/email-already-exists' || error.code === 'auth/email-already-in-use') {
              this.error = true
              this.code = 'exists'
            }
            this.busy = false
            store.commit('error', error.code)
          })
        }
      },
      change (value) {
        this.tab = value
        this.error = false
      },
      holyday (type) {
        const now = moment()
        if (now.isBetween(moment('15/01/____', 'DD/MM/____'), moment('15/02/____', 'DD/MM/____'), 'days', '[)')) {
          return type === 'image' ? 'https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/valentines.jpg?alt=media' : 'lbl_slogan_valentines'
        } else if (now.isBetween(moment('15/02/____', 'DD/MM/____'), moment('15/03/____', 'DD/MM/____'), 'days', '[)')) {
          return type === 'image' ? 'https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/chinese.jpg?alt=media' : 'lbl_slogan_chinese'
        } else if (now.isBetween(moment('15/03/____', 'DD/MM/____'), moment('15/04/____', 'DD/MM/____'), 'days', '[)')) {
          return type === 'image' ? 'https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/carnival.jpg?alt=media' : 'lbl_slogan_carnivale'
        } else if (now.isBetween(moment('15/09/____', 'DD/MM/____'), moment('15/10/____', 'DD/MM/____'), 'days', '[)')) {
          return type === 'image' ? 'https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/oktoberfest.jpg?alt=media' : 'lbl_slogan_oktoberfest'
        } else if (now.isBetween(moment('15/10/____', 'DD/MM/____'), moment('15/11/____', 'DD/MM/____'), 'days', '[)')) {
          return type === 'image' ? 'https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/halloween.jpg?alt=media' : 'lbl_slogan_halloween'
        } else if (now.isBetween(moment('01/12/____', 'DD/MM/____'), moment('31/12/____', 'DD/MM/____'), 'days', '[)')) {
          return type === 'image' ? 'https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/christmas.jpg?alt=media' : 'lbl_slogan_christmas'
        } else {
          return type === 'image' ? 'https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/login.jpg?alt=media' : 'lbl_slogan_default'
        }
      }
    },
    computed: {
      mismatch () {
        return this.password !== this.confirm_password
      },
      insecure () {
        return this.tab === 'signin' && this.password.length <= 5
      },
      disabled () {
        return this.mismatch || this.insecure || this.error || this.long
      },
      long () {
        return this.username.length >= 20
      },
      image () {
        return this.holyday('image')
      },
      slogan () {
        return this.holyday('slogan')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .login
    .form-row
      display flex
      justify-content flex-start
      align-items center
      .mu-text-field
        width 100%
      .mu-select-field
        width 100%
</style>
