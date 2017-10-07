<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.animated.fadeInUp
        form(@submit.stop.prevent="accept")
          mu-card-media
            img(src="https://img00.deviantart.net/283d/i/2013/268/6/1/portals_7th_heaven_by_ivany86-d6m22w2.png", :alt="translate('lbl_label_enter')")
            .card-info
              .card-title {{ 'lbl_label_enter' | translate }}

          mu-card-text
            mu-tabs(:value="tab", @change="change")
              mu-tab(value="login", :title="translate('lbl_tab_authentication')")
              mu-tab(value="signin", :title="translate('lbl_tab_registration')")

          mu-card-text
            mu-text-field(v-model="username", name="username", :label="translate('lbl_label_username')", :hintText="translate('lbl_label_username')", :fullWidth="true", v-if="tab === 'signin'", :errorText="error && code === 'taken' ? translate('auth/username-already-exists') : ''", @input="error = false", required)
            mu-select-field(v-model="color", name="color", :label="translate('lbl_label_faction')", :fullWidth="true", v-if="tab === 'signin'", required)
              mu-menu-item(v-for="faction, index in factions", :key="index", :value="faction.color", :title="translate(faction.name)")
            mu-text-field(v-model="email", name="email", :label="translate('lbl_label_email')", :hintText="translate('lbl_label_email')", :fullWidth="true", type="email", :errorText="error && code === 'exists' ? this.translate('auth/email-already-exists') : error && code === 'invalid' ? this.translate('auth/invalid-credentials') : ''", @input="error = false", required)
            mu-text-field(v-model="password", name="password", :label="translate('lbl_label_password')", :hintText="translate('lbl_label_password')", :fullWidth="true", type="password", :errorText="insecure ? this.translate('auth/password-insecure') : error && code === 'invalid' ? this.translate('auth/invalid-credentials') : ''", pattern=".{6,}", minlength="6", @input="error = false", required)
            mu-text-field(v-model="confirm_password", name="confirm_password", :label="translate('lbl_label_password_confirm')", :hintText="translate('lbl_label_password_confirm')", :fullWidth="true", type="password", v-if="tab === 'signin'", :errorText="mismatch ? translate('auth/password-mismatch') : ''", required)

          mu-card-actions
            mu-raised-button(primary, :aria-label="translate('lbl_button_clear')", :label="translate('lbl_button_clear')", type="reset")
            mu-raised-button(primary, :aria-label="translate('lbl_button_login')", :label="translate('lbl_button_login')", type="submit", v-if="tab === 'login'")
            mu-raised-button(primary, :aria-label="translate('lbl_button_signin')", :label="translate('lbl_button_signin')", type="submit", v-if="tab === 'signin'", :disabled="disabled")
</template>

<script>
  import { authenticate, register, database, auth } from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
    data () {
      return {
        error: false,
        code: null,
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
      spells: database.ref('spells'),
      units: database.ref('units'),
      users: database.ref('users'),
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
        authenticate(this.email, this.password)
        .then(response => {
          store.commit('uid', auth.currentUser.uid)
          store.commit('success', 'auth/authentication-ok')
          this.$router.push('/census')
        })
        .catch(error => {
          this.error = true
          this.code = 'invalid'
          store.commit('error', error.code)
        })
      },
      signin () {
        if (this.users.find(u => u.name.toLowerCase() === this.username.toLowerCase()) !== undefined) {
          this.error = true
          this.code = 'taken'
          store.commit('error', 'auth/username-already-exists')
        }
        if (!this.disabled) {
          register(this.email, this.password)
          .then(response => {
            // player
            let player = {...this.user}
            player.name = this.username
            player.email = this.email
            player.color = this.color
            delete player['.key']
            this.$firebaseRefs.users.child(auth.currentUser.uid).set(player)
            // buildings
            this.$firebaseRefs.buildings.once('value', snapshot => {
              snapshot.forEach(building => {
                let construction = {...building.val()}
                construction.quantity = construction.name === 'lbl_building_territory'
                  ? 500
                  : 10
                delete construction['.key']
                this.$firebaseRefs.users.child(auth.currentUser.uid).child('constructions').push(construction)
              })
            })
            // spells
            this.$firebaseRefs.spells.orderByChild('colorLevel').equalTo(player.color + '1').once('value', snapshot => {
              snapshot.forEach(spell => {
                let research = {...spell.val()}
                research.invested = 0
                research.completed = false
                delete research['.key']
                this.$firebaseRefs.users.child(auth.currentUser.uid).child('researches').push(research)
              })
            })
            // units
            this.$firebaseRefs.units.orderByChild('initial').equalTo(player.color).once('value', snapshot => {
              snapshot.forEach(unit => {
                let troop = {...unit.val()}
                troop.quantity = 1000
                delete troop['.key']
                this.$firebaseRefs.users.child(auth.currentUser.uid).child('troops').push(troop)
                this.$firebaseRefs.users.child(auth.currentUser.uid).transaction(user => {
                  if (user) {
                    user.army += troop.quantity
                  }
                  return user
                })
              })
            })
            // relics
            this.$firebaseRefs.artifacts.orderByChild('color').equalTo(player.color).once('value', snapshot => {
              let relics = []
              snapshot.forEach(artifact => {
                let relic = {...artifact.val()}
                relic.quantity = 1
                delete relic['.key']
                relics.push(relic)
              })
              // random
              const index = Math.floor(Math.random() * relics.length)
              this.$firebaseRefs.users.child(auth.currentUser.uid).child('relics').push(relics[index])
            })
            // places
            this.$firebaseRefs.places.orderByChild('color').equalTo(player.color).once('value', snapshot => {
              snapshot.forEach(place => {
                let quest = {...place.val()}
                delete quest['.key']
                this.$firebaseRefs.users.child(auth.currentUser.uid).child('quests').push(quest)
              })
            })
            // messages
            let message = {
              name: 'lbl_name_admin',
              color: 'dark',
              timestamp: Date.now(),
              subject: 'lbl_message_welcome_subject',
              text: 'lbl_message_welcome_text'
            }
            this.$firebaseRefs.users.child(auth.currentUser.uid).child('messages').push(message)
            // uid
            store.commit('uid', auth.currentUser.uid)
            store.commit('success', 'auth/registration-ok')
            // router
            this.$router.push('/census')
          })
          .catch(error => {
            if (error.code === 'auth/email-already-exists' || error.code === 'auth/email-already-in-use') {
              this.error = true
              this.code = 'exists'
            }
            store.commit('error', error.code)
          })
        }
      },
      change (value) {
        this.tab = value
        this.error = false
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
        return this.mismatch || this.insecure || this.error
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
