<template lang="pug">
  mu-row
    mu-col(width="100", tablet="66", desktop="50")
      mu-card.battle.animated.fadeInUp
        mu-card-media
          img(src="http://coolvibe.com/wp-content/uploads/2011/08/orc-battle.jpg", :alt="translate('lbl_label_battle')")
          .card-info
            .card-text {{ 'lbl_label_attack' | translate }}
        mu-card-text
          p {{ 'lbl_label_battle' | translate }}
        mu-card-text
          form
          
            mu-select-field(v-model="target", :label="translate('lbl_label_target')", :fullWidth="true")
              mu-menu-item(v-for="user, index in users", :key="index", :value="user['.key']", :title="translate(user.name)", v-if="!myself(user['.key'])")

            mu-select-field(v-model="type", :label="translate('lbl_label_strategy')", :fullWidth="true")
              mu-menu-item(v-for="strategy, index in strategies", :key="index", :value="strategy.key", :title="translate(strategy.value)")
            
            .form-row
              mu-text-field(v-model="army.one.quantity", :label="translate('lbl_label_quantity')", :hintText="translate('lbl_label_quantity')")
              mu-select-field(v-model="army.one.name", :label="translate('lbl_label_army_one')", :fullWidth="true")
                mu-menu-item(v-for="troop, index in troops", :key="index", :value="troop.name", :title="translate(troop.name)")
            
            .form-row
              mu-text-field(v-model="army.one.quantity", :label="translate('lbl_label_quantity')", :hintText="translate('lbl_label_quantity')")
              mu-select-field(v-model="army.two", :label="translate('lbl_label_army_two')", :fullWidth="true")
                mu-menu-item(v-for="troop, index in troops", :key="index", :value="troop.name", :title="translate(troop.name)")
            
            .form-row
              mu-text-field(v-model="army.one.quantity", :label="translate('lbl_label_quantity')", :hintText="translate('lbl_label_quantity')")
              mu-select-field(v-model="army.three", :label="translate('lbl_label_army_three')", :fullWidth="true")
                mu-menu-item(v-for="troop, index in troops", :key="index", :value="troop.name", :title="translate(troop.name)")
            
            .form-row
              mu-text-field(v-model="army.one.quantity", :label="translate('lbl_label_quantity')", :hintText="translate('lbl_label_quantity')")
              mu-select-field(v-model="army.four", :label="translate('lbl_label_army_four')", :fullWidth="true")
                mu-menu-item(v-for="troop, index in troops", :key="index", :value="troop.name", :title="translate(troop.name)")
            
            .form-row
              mu-text-field(v-model="army.one.quantity", :label="translate('lbl_label_quantity')", :hintText="translate('lbl_label_quantity')")
              mu-select-field(v-model="army.five", :label="translate('lbl_label_army_five')", :fullWidth="true")
                mu-menu-item(v-for="troop, index in troops", :key="index", :value="troop.name", :title="translate(troop.name)")
            
            mu-select-field(v-model="spell", :label="translate('lbl_label_spell')", :fullWidth="true")
              mu-menu-item(v-for="spell, index in book", :key="index", :value="spell.name", :title="translate(spell.name)")
            
            mu-select-field(v-model="artifact", :label="translate('lbl_label_artifact')", :fullWidth="true")
              mu-menu-item(v-for="artifact, index in relics", :key="index", :value="artifact.name", :title="translate(artifact.name)")
              
        mu-card-actions
          mu-raised-button(primary, @click="attack") {{ 'lbl_button_attack' | translate }}
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
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
        type: 'conquest',
        spell: null,
        artifact: null,
        target: null
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
      attack () {
        // TODO
      },
      myself (uid) {
        return store.state.uid === uid
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
</style>
