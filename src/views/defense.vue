<template lang="pug">
  mu-row
    mu-col(width="100", tablet="66", desktop="50")
      mu-card.defense.animated.fadeInUp
        form(@submit.stop.prevent="confirm('save')")
          mu-card-media
            img(src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/defense.jpg?alt=media", :alt="translate('lbl_label_defense')")
            .card-info
              .card-text {{ 'lbl_label_defense' | translate }}
              .card-number
                i.ra.ra-hourglass
                span {{ turns | minimize }}
          mu-card-text
            p {{ 'lbl_label_protection' | translate }}

          mu-card-text
            mu-select-field(v-model="user.counter", :label="translate('lbl_label_spell')", :fullWidth="true", :maxHeight="300")
              mu-menu-item(v-for="spell, index in book", :key="index", :value="spell['.key']", :title="translate(spell.name)")

            mu-select-field(v-model="user.trap", :label="translate('lbl_label_artifact')", :fullWidth="true", :maxHeight="300")
              mu-menu-item(v-for="artifact, index in relics", :key="index", :value="artifact['.key']", :title="translate(artifact.name)")

          mu-card-actions
            mu-raised-button(primary, type="reset", @click="restore") {{ 'lbl_button_restore' | translate }}
            mu-raised-button(primary, type="submit") {{ 'lbl_button_save' | translate }}

    confirm-dialog(:dialog="dialog", :busy="busy", @close="close", @accept="accept") 
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import { checkTurnMaintenances, updateGeneralStatus } from '../services/api'
  import confirm from '../components/confirm-dialog'
  
  export default {
    components: {
      'confirm-dialog': confirm
    },
    data () {
      return {
        busy: false,
        type: null,
        dialog: false,
        turns: 1
      }
    },
    created () {
      store.commit('title', 'lbl_title_defense')
      this.$bindAsArray('book', database.ref('users').child(store.state.uid).child('book').orderByChild('battle').equalTo(true))
      this.$bindAsArray('relics', database.ref('users').child(store.state.uid).child('relics').orderByChild('battle').equalTo(true))
    },
    methods: {
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
        this.busy = true
        switch (this.type) {
          case 'save':
            this.save()
            break
        }
      },
      async save () {
        await checkTurnMaintenances(store.state.uid, this.turns)
        if (this.user.trap) await database.ref('users').child(store.state.uid).update({ trap: this.user.trap })
        if (this.user.counter) await database.ref('users').child(store.state.uid).update({ counter: this.user.counter })
        await updateGeneralStatus(store.state.uid)
        store.commit('success', 'lbl_toast_defense_saved')
        this.close()
      },
      async restore () {
        await database.ref('users').child(store.state.uid).child('trap').remove()
        await database.ref('users').child(store.state.uid).child('counter').remove()
        await updateGeneralStatus(store.state.uid)
        store.commit('success', 'lbl_toast_defense_restored')
      },
      close () {
        this.type = null
        this.dialog = false
        this.busy = false
      }
    },
    computed: {
      user () {
        return store.state.user
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
