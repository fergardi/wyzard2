<template lang="pug">
  mu-row
  
    mu-col(width="100", tablet="66", desktop="50")
      mu-card.login.animated.fadeInUp
        form(@submit.prevent="accept")
          mu-card-media
            .card-image
              img(:src="image", :alt="translate('slogan')")
              mu-circular-progress(v-if="busy", :size="100", color="#ad835a")
            .card-extra
              .card-text
                i.ra.ra-leaf
                span {{ 'lbl_slogan_season' | translate }} {{ general.season | numeric }}
            .card-info
              .card-text {{ slogan | translate }}

          mu-card-text
            mu-tabs(:value="tab", @change="change")
              mu-tab(value="login", :title="translate('lbl_tab_authentication')")
              mu-tab(value="signin", :title="translate('lbl_tab_registration')")

          mu-card-text
            .form-row(v-if="tab === 'signin'")
              mu-text-field(v-model="username", name="username", :label="translate('lbl_label_username')", :hintText="translate('lbl_label_username')", :fullWidth="true", :errorText="long ? translate('auth/username-too-long') : error && code === 'taken' ? translate('auth/username-already-exists') : ''", @input="error = false", :maxLength="20", required)
            .form-row(v-if="tab === 'signin'")
              mu-select-field(v-model="color", name="color", :label="translate('lbl_label_faction')", :fullWidth="true", :errorText="!color ? translate('auth/color-required') : ''", required)
                mu-menu-item(v-for="faction, index in factions", :key="index", :value="faction.color", :title="translate(faction.name)")
            .form-row
              mu-text-field(v-model="email", name="email", :label="translate('lbl_label_email')", :hintText="translate('lbl_label_email')", :fullWidth="true", type="email", :errorText="error && code === 'exists' ? this.translate('auth/email-already-exists') : error && code === 'invalid' ? this.translate('auth/invalid-credentials') : ''", @input="error = false", :maxLength="100", required)
            .form-row
              mu-text-field(v-model="password", name="password", :label="translate('lbl_label_password')", :hintText="translate('lbl_label_password')", :fullWidth="true", type="password", :errorText="insecure ? this.translate('auth/password-insecure') : error && code === 'invalid' ? this.translate('auth/invalid-credentials') : ''", pattern=".{6,}", minlength="6", @input="error = false", :maxLength="20", required)
            .form-row(v-if="tab === 'signin'")
              mu-text-field(v-model="confirm_password", name="confirm_password", :label="translate('lbl_label_password_confirm')", :hintText="translate('lbl_label_password_confirm')", :fullWidth="true", type="password", :errorText="mismatch ? translate('auth/password-mismatch') : ''", required)
            .form-row
              mu-checkbox(v-model="remember", :label="translate('lbl_label_remember')")
            .form-row.recaptcha(v-if="tab === 'signin'")
              vue-recaptcha(:sitekey="key", ref="recaptcha", @verify="verify", @expired="expired", theme="dark", size="normal")

          mu-card-actions
            mu-raised-button(primary, :aria-label="translate('lbl_button_clear')", :label="translate('lbl_button_clear')", :disabled="busy", @click="reset")
            mu-raised-button(primary, :aria-label="translate('lbl_button_login')", :label="translate('lbl_button_login')", v-if="tab === 'login'", :disabled="!canLogIn || busy", @click="accept")
            mu-raised-button(primary, :aria-label="translate('lbl_button_signin')", :label="translate('lbl_button_signin')", v-if="tab === 'signin'", :disabled="!canSignIn || disabled || busy", @click="accept")
</template>

<script>
  import { authenticate, register, database, auth, recaptcha } from '@/services/firebase'
  import store from '@/vuex/store'
  import { createNewUser } from '@/services/api'
  import moment from 'moment'
  import VueRecaptcha from 'vue-recaptcha'
  
  export default {
    components: {
      'vue-recaptcha': VueRecaptcha
    },
    data () {
      return {
        busy: false,
        error: false,
        code: null,
        remember: true,
        tab: 'login',
        username: '',
        color: null,
        email: '',
        password: '',
        confirm_password: '',
        captcha: false,
        key: null
      }
    },
    created () {
      store.commit('title', 'lbl_title_wyzard')
      store.commit('help', 'txt_help_login')
      this.key = recaptcha
    },
    mounted () {
      let recaptcha = document.createElement('script')
      recaptcha.setAttribute('src', `https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit&hl=${this.settings.lang}`)
      recaptcha.setAttribute('defer', '')
      recaptcha.setAttribute('async', '')
      document.head.appendChild(recaptcha)
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
      },
      general: {
        source: database.ref('general'),
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
        if (this.canLogIn) {
          authenticate(this.email, this.password, this.remember)
          .then(() => {
            this.busy = false
            store.commit('success', 'auth/authentication-ok')
            this.$router.push({ path: '/messages' })
          })
          .catch(error => {
            this.error = true
            this.code = 'invalid'
            this.busy = false
            store.commit('error', error.code)
          })
        }
      },
      signin () {
        if (this.canSignIn) {
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
              await createNewUser(auth.currentUser.uid, player)
              this.busy = false
              store.commit('success', 'auth/registration-ok')
              store.commit('info', 'auth/verification-required')
              this.$router.push({ path: '/kingdom' })
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
        }
      },
      change (value) {
        this.tab = value
        this.error = false
      },
      holyday (type) {
        const now = moment()
        if (now.isBetween(moment('15/01/____', 'DD/MM/____'), moment('15/02/____', 'DD/MM/____'), 'days', '[)')) {
          return type === 'image' ? this.picture('login', 'valentines') : 'lbl_slogan_valentines'
        } else if (now.isBetween(moment('15/02/____', 'DD/MM/____'), moment('15/03/____', 'DD/MM/____'), 'days', '[)')) {
          return type === 'image' ? this.picture('login', 'chinese') : 'lbl_slogan_chinese'
        } else if (now.isBetween(moment('15/03/____', 'DD/MM/____'), moment('15/04/____', 'DD/MM/____'), 'days', '[)')) {
          return type === 'image' ? this.picture('login', 'carnival') : 'lbl_slogan_carnivale'
        } else if (now.isBetween(moment('15/09/____', 'DD/MM/____'), moment('15/10/____', 'DD/MM/____'), 'days', '[)')) {
          return type === 'image' ? this.picture('login', 'oktoberfest') : 'lbl_slogan_oktoberfest'
        } else if (now.isBetween(moment('15/10/____', 'DD/MM/____'), moment('15/11/____', 'DD/MM/____'), 'days', '[)')) {
          return type === 'image' ? this.picture('login', 'halloween') : 'lbl_slogan_halloween'
        } else if (now.isBetween(moment('01/12/____', 'DD/MM/____'), moment('31/12/____', 'DD/MM/____'), 'days', '[)')) {
          return type === 'image' ? this.picture('login', 'christmas') : 'lbl_slogan_christmas'
        } else {
          return type === 'image' ? this.picture('login', 'login') : 'lbl_slogan_default'
        }
      },
      verify () {
        this.captcha = true
      },
      expired () {
        this.captcha = false
      },
      reset () {
        this.username = ''
        this.password = ''
        this.confirm_password = ''
        this.color = null
        this.email = ''
        this.error = false
        this.code = null
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
      },
      canLogIn () {
        return this.email !== '' && this.password !== ''
      },
      canSignIn () {
        return this.username !== '' && this.color !== null && this.email !== '' && this.password !== '' && this.confirm_password !== '' && this.captcha
      },
      settings () {
        return store.state.user != null && store.state.user.settings != null ? store.state.user.settings : store.state.settings
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
      &.recaptcha
        display flex
        width 100%
        align-items center
        justify-content center
        margin-top 1em
</style>
