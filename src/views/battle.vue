<template lang="pug">
  mu-row
    mu-col(width="100", tablet="66", desktop="50")
      mu-card.battle.animated.fadeInUp
        form(@submit.stop.prevent="confirm('attack')")
          mu-card-media
            img(src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/battle.jpg?alt=media", :alt="translate('lbl_label_battle')")
            .card-info
              .card-text {{ 'lbl_label_attack' | translate }}
          mu-card-text
            p {{ 'lbl_label_battle' | translate }}

          mu-card-text
            mu-auto-complete(v-model="search", :label="translate('lbl_label_target')", :hintText="translate('lbl_label_search')", :fullWidth="true", :dataSource="targets", filter="noFilter", :openOnFocus="true", @select="choose", required)

            //mu-select-field(v-model="target", :label="translate('lbl_label_target')", :fullWidth="true")
              mu-menu-item(v-for="user, index in users", :key="index", :value="user['.key']", :title="translate(user.name)", v-if="!myself(user['.key'])")

            mu-select-field(v-model="strategy", :label="translate('lbl_label_strategy')", :fullWidth="true", required)
              mu-menu-item(v-for="strategy, index in strategies", :key="index", :value="strategy.key", :title="translate(strategy.value)")
            
            .form-row
              mu-text-field(v-model="army.one.quantity", :label="translate('lbl_label_quantity')", :hintText="translate('lbl_label_quantity')", required)
              mu-select-field(v-model="army.one.name", :label="translate('lbl_label_army_one')", :fullWidth="true")
                mu-menu-item(v-for="troop, index in troops", :key="index", :value="troop.name", :title="translate(troop.name)")
            
            .form-row
              mu-text-field(v-model="army.two.quantity", :label="translate('lbl_label_quantity')", :hintText="translate('lbl_label_quantity')")
              mu-select-field(v-model="army.two", :label="translate('lbl_label_army_two')", :fullWidth="true")
                mu-menu-item(v-for="troop, index in troops", :key="index", :value="troop.name", :title="translate(troop.name)")
            
            .form-row
              mu-text-field(v-model="army.three.quantity", :label="translate('lbl_label_quantity')", :hintText="translate('lbl_label_quantity')")
              mu-select-field(v-model="army.three", :label="translate('lbl_label_army_three')", :fullWidth="true")
                mu-menu-item(v-for="troop, index in troops", :key="index", :value="troop.name", :title="translate(troop.name)")
            
            .form-row
              mu-text-field(v-model="army.four.quantity", :label="translate('lbl_label_quantity')", :hintText="translate('lbl_label_quantity')")
              mu-select-field(v-model="army.four", :label="translate('lbl_label_army_four')", :fullWidth="true")
                mu-menu-item(v-for="troop, index in troops", :key="index", :value="troop.name", :title="translate(troop.name)")
            
            .form-row
              mu-text-field(v-model="army.five.quantity", :label="translate('lbl_label_quantity')", :hintText="translate('lbl_label_quantity')")
              mu-select-field(v-model="army.five", :label="translate('lbl_label_army_five')", :fullWidth="true")
                mu-menu-item(v-for="troop, index in troops", :key="index", :value="troop.name", :title="translate(troop.name)")
            
            mu-select-field(v-model="spell", :label="translate('lbl_label_spell')", :fullWidth="true")
              mu-menu-item(v-for="spell, index in book", :key="index", :value="spell.name", :title="translate(spell.name)")
            
            mu-select-field(v-model="artifact", :label="translate('lbl_label_artifact')", :fullWidth="true")
              mu-menu-item(v-for="artifact, index in relics", :key="index", :value="artifact.name", :title="translate(artifact.name)")
                
          mu-card-actions
            mu-raised-button(primary, type="reset", @click="reset", :disabled="busy") {{ 'lbl_button_clear' | translate }}
            mu-raised-button(primary, type="submit", @click="attack", :disabled="!canAttack || busy") {{ 'lbl_button_attack' | translate }}

    confirm-dialog(:dialog="dialog", :busy="busy", @close="close", @accept="accept")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import confirm from '../components/confirm-dialog'
  import { checkTurnMaintenances, updateGeneralStatus, battlePlayerVersusPlayer } from '../services/api'
  
  export default {
    components: {
      'confirm-dialog': confirm
    },
    data () {
      return {
        army: {
          one: {
            name: null,
            quantity: 0
          },
          two: {
            name: null,
            quantity: 0
          },
          three: {
            name: null,
            quantity: 0
          },
          four: {
            name: null,
            quantity: 0
          },
          five: {
            name: null,
            quantity: 0
          }
        },
        strategies: [
          { key: 'conquest', value: 'lbl_strategy_conquest' },
          { key: 'siege', value: 'lbl_strategy_siege' },
          { key: 'pillage', value: 'lbl_strategy_pillage' }
        ],
        strategy: 'conquest',
        spell: null,
        artifact: null,
        search: '',
        target: null,
        busy: false,
        dialog: false,
        type: null,
        turns: 2
      }
    },
    created () {
      store.commit('title', 'lbl_title_battle')
      this.$bindAsArray('troops', database.ref('users').child(store.state.uid).child('troops').orderByChild('name'))
      this.$bindAsArray('book', database.ref('users').child(store.state.uid).child('book').orderByChild('battle').equalTo(true))
      this.$bindAsArray('relics', database.ref('users').child(store.state.uid).child('relics').orderByChild('battle').equalTo(true))
    },
    firebase: {
      users: database.ref('users').orderByChild('name')
    },
    methods: {
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
        this.busy = true
        switch (this.type) {
          case 'attack':
            this.attack()
            break
        }
      },
      async attack () {
        if (this.canAttack && !this.busy) {
          await checkTurnMaintenances(store.state.uid, this.turns)
          await battlePlayerVersusPlayer(store.state.uid, this.target, this.strategy, this.army, this.spell, this.artifact)
          updateGeneralStatus(store.state.uid)
          updateGeneralStatus(this.target)
          store.commit('success', 'lbl_toast_battle_ok')
          this.close()
        } else {
          store.commit('error', 'lbl_toast_battle_error')
          this.close()
        }
      },
      myself (uid) {
        return store.state.uid === uid
      },
      choose (target) {
        this.target = target.value
      },
      reset () {
        this.spell = null
        this.artifact = null
        this.target = null
        this.strategy = null
        this.search = ''
      },
      close () {
        this.type = null
        this.dialog = false
        this.busy = false
      }
    },
    computed: {
      targets () {
        return this.search // TODO remove myself
          ? this.users.filter(u => u['.key'] !== store.state.uid && u.name.toLowerCase().includes(this.search.toLowerCase())).map(u => { return { text: u.name, value: u['.key'] } })
          : this.users.filter(u => u['.key'] !== store.state.uid).map(u => { return { text: u.name, value: u['.key'] } })
      },
      canAttack () {
        return this.target !== null
      }
    }
  }
</script>

<style lang="stylus" scoped>
  form
    .form-row
      display flex
      justify-content space-between
      align-items center
      .mu-text-field
        width 25%
      .mu-select-field
        width 70%
        margin-left 5%
</style>
