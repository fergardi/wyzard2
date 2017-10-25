<template lang="pug">
  mu-row
    mu-col(width="100", tablet="66", desktop="50")
      mu-card.battle.animated.fadeInUp
        form(@submit.stop.prevent="confirm('attack')")
          mu-card-media
            img(src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/battle.jpg?alt=media", :alt="translate('lbl_label_battle')")
            .card-info
              .card-text {{ 'lbl_label_attack' | translate }}
              .card-number
                i.ra.ra-hourglass
                span {{ turns | minimize }}
          mu-card-text
            p {{ 'lbl_label_battle' | translate }}

          mu-card-text
            .form-row
              mu-auto-complete(v-model="search", :label="translate('lbl_label_target')", :hintText="translate('lbl_label_search')", :fullWidth="true", :dataSource="targets", filter="noFilter", :openOnFocus="true", @select="choose", :maxHeight="300", required)

            .form-row
              mu-select-field(v-model="strategy", :label="translate('lbl_label_strategy')", :fullWidth="true", required)
                mu-menu-item(v-for="strategy, index in strategies", :key="index", :value="strategy.key", :title="translate(strategy.value)")
            
            .form-row
              mu-text-field(type="number", v-model.number="army.first.quantity", :min="army.first.troop ? 1 : 0", :max="army.first.troop ? army.first.troop.quantity : 0", :label="translate('lbl_label_quantity')", :hintText="translate('lbl_label_quantity')", required)
              mu-select-field(v-model="army.first.troop", :label="translate('lbl_label_army_first')", :fullWidth="true")
                mu-menu-item(v-for="troop, index in first", :key="index", :value="troop", :title="translate(troop.name)")
            
            .form-row
              mu-text-field(type="number", v-model.number="army.second.quantity", :min="army.second.troop ? 1 : 0", :max="army.second.troop ? army.second.troop.quantity : 0", :label="translate('lbl_label_quantity')", :hintText="translate('lbl_label_quantity')", :disabled="!canSecond")
              mu-select-field(v-model="army.second.troop", :label="translate('lbl_label_army_second')", :fullWidth="true", :disabled="!canSecond")
                mu-menu-item(v-for="troop, index in second", :key="index", :value="troop", :title="translate(troop.name)")
            
            .form-row
              mu-text-field(type="number", v-model.number="army.third.quantity", :min="army.third.troop ? 1 : 0", :max="army.third.troop ? army.third.troop.quantity : 0", :label="translate('lbl_label_quantity')", :hintText="translate('lbl_label_quantity')", :disabled="!canThird")
              mu-select-field(v-model="army.third.troop", :label="translate('lbl_label_army_third')", :fullWidth="true", :disabled="!canThird")
                mu-menu-item(v-for="troop, index in third", :key="index", :value="troop", :title="translate(troop.name)")
            
            .form-row
              mu-text-field(type="number", v-model.number="army.fourth.quantity", :min="army.fourth.troop ? 1 : 0", :max="army.fourth.troop ? army.fourth.troop.quantity : 0", :label="translate('lbl_label_quantity')", :hintText="translate('lbl_label_quantity')", :disabled="!canFourth")
              mu-select-field(v-model="army.fourth.troop", :label="translate('lbl_label_army_fourth')", :fullWidth="true", :disabled="!canFourth")
                mu-menu-item(v-for="troop, index in fourth", :key="index", :value="troop", :title="translate(troop.name)")
            
            .form-row
              mu-text-field(type="number", v-model.number="army.fifth.quantity", :min="army.fifth.troop ? 1 : 0", :max="army.fifth.troop ? army.fifth.troop.quantity : 0", :label="translate('lbl_label_quantity')", :hintText="translate('lbl_label_quantity')", :disabled="!canFifth")
              mu-select-field(v-model="army.fifth.troop", :label="translate('lbl_label_army_fifth')", :fullWidth="true", :disabled="!canFifth")
                mu-menu-item(v-for="troop, index in fifth", :key="index", :value="troop", :title="translate(troop.name)")
            
            .form-row
              mu-select-field(v-model="spell", :label="translate('lbl_label_spell')", :fullWidth="true", :maxHeight="300")
                mu-menu-item(v-for="spell, index in book", :key="index", :value="spell", :title="translate(spell.name)")
            
            .form-row
              mu-select-field(v-model="artifact", :label="translate('lbl_label_artifact')", :fullWidth="true", :maxHeight="300")
                mu-menu-item(v-for="artifact, index in relics", :key="index", :value="artifact", :title="translate(artifact.name)")
                
          mu-card-actions
            mu-raised-button(primary, type="reset", @click="reset", :disabled="busy") {{ 'lbl_button_clear' | translate }}
            mu-raised-button(primary, type="submit", @click="attack", :disabled="!canAttack || busy") {{ 'lbl_button_attack' | translate }}

    confirm-dialog(:dialog="dialog", :busy="busy", @close="close", @accept="accept")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import confirm from '../components/confirm-dialog'
  import { checkTurnMaintenances, updateGeneralStatus, battlePlayerVersusPlayer, sendUserMessage } from '../services/api' // eslint-disable-line
  
  export default {
    components: {
      'confirm-dialog': confirm
    },
    data () {
      return {
        army: {
          first: {
            troop: null,
            quantity: 0
          },
          second: {
            troop: null,
            quantity: 0
          },
          third: {
            troop: null,
            quantity: 0
          },
          fourth: {
            troop: null,
            quantity: 0
          },
          fifth: {
            troop: null,
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
        if (this.hasTurns) {
          if (this.canAttack) {
            // await checkTurnMaintenances(store.state.uid, this.turns)
            await battlePlayerVersusPlayer(store.state.uid, this.target, this.strategy, this.army, this.spell, this.artifact)
            await updateGeneralStatus(store.state.uid)
            await updateGeneralStatus(this.target)
            store.commit('success', 'lbl_toast_battle_ok')
            this.reset()
            this.close()
          } else {
            store.commit('error', 'lbl_toast_battle_error')
            this.close()
          }
        } else {
          store.commit('error', 'lbl_toast_resource_turns')
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
        this.strategy = 'conquest'
        this.army.first.troop = null
        this.army.first.quantity = 0
        this.army.second.troop = null
        this.army.second.quantity = 0
        this.army.third.troop = null
        this.army.third.quantity = 0
        this.army.fourth.troop = null
        this.army.fourth.quantity = 0
        this.army.fifth.troop = null
        this.army.fifth.quantity = 0
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
        return this.search
          ? this.users.filter(u => u['.key'] !== store.state.uid && u.name.toLowerCase().includes(this.search.toLowerCase())).map(u => { return { text: u.name, value: u['.key'] } })
          : this.users.filter(u => u['.key'] !== store.state.uid).map(u => { return { text: u.name, value: u['.key'] } })
      },
      canAttack () {
        return this.hasTurns && this.target !== null && this.hasFirst
      },
      first () {
        return this.troops
      },
      second () {
        return this.army.first.troop
          ? this.first.filter(t => t['.key'] !== this.army.first.troop['.key'])
          : []
      },
      third () {
        return this.army.second.troop
          ? this.second.filter(t => t['.key'] !== this.army.second.troop['.key'])
          : []
      },
      fourth () {
        return this.army.third.troop
          ? this.third.filter(t => t['.key'] !== this.army.third.troop['.key'])
          : []
      },
      fifth () {
        return this.army.fourth.troop
          ? this.fourth.filter(t => t['.key'] !== this.army.fourth.troop['.key'])
          : []
      },
      canFirst () {
        return this.troops && this.troops.length > 0
      },
      canSecond () {
        return this.canFirst && this.hasFirst
      },
      canThird () {
        return this.canSecond && this.hasSecond
      },
      canFourth () {
        return this.canThird && this.hasThird
      },
      canFifth () {
        return this.canFourth && this.hasFourth
      },
      hasFirst () {
        return this.army.first.troop !== null && this.army.first.quantity > 0
      },
      hasSecond () {
        return this.army.second.troop !== null && this.army.second.quantity > 0
      },
      hasThird () {
        return this.army.third.troop !== null && this.army.third.quantity > 0
      },
      hasFourth () {
        return this.army.fourth.troop !== null && this.army.fourth.quantity > 0
      },
      hasFifth () {
        return this.army.fifth.troop !== null && this.army.fifth.quantity > 0
      },
      hasTurns () {
        return this.turns <= this.user.turns
      },
      user () {
        return store.state.user
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
      .mu-text-field + .mu-select-field
        margin-left 5px
        width 100%
      .mu-select-field
        width 100%
</style>
