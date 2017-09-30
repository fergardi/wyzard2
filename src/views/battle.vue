<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.battle.animated.fadeInUp
        mu-card-media
          img(src="http://coolvibe.com/wp-content/uploads/2011/08/orc-battle.jpg")
          .card-info
            .card-title {{ 'lbl_label_battle' | translate }}
        mu-card-text
          p {{ 'lbl_label_battle_description' | lorem }}
        mu-card-text
          form
          
            mu-select-field(v-model="target", :label="translate('lbl_label_target')", :fullWidth="true")
              mu-menu-item(v-for="user, index in users", :key="index", :value="user.name", :title="translate(user.name)")
            
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
              mu-menu-item(v-for="spell, index in spells", :key="index", :value="spell.name", :title="translate(spell.name)")
            
            mu-select-field(v-model="artifact", :label="translate('lbl_label_artifact')", :fullWidth="true")
              mu-menu-item(v-for="artifact, index in artifacts", :key="index", :value="artifact.name", :title="translate(artifact.name)")
              
        mu-card-actions
          mu-raised-button(primary, @click="attack") {{ 'lbl_button_attack' | translate }}
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
    name: 'battle',
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
        spell: null,
        artifact: null,
        target: null
      }
    },
    created () {
      store.commit('title', 'lbl_title_battle')
      this.$bindAsArray('troops', database.ref('users').child(store.state.uid).child('troops').orderByChild('name'))
      this.$bindAsArray('spells', database.ref('users').child(store.state.uid).child('researches').orderByChild('completed').equalTo(true))
      this.$bindAsArray('artifacts', database.ref('users').child(store.state.uid).child('artifacts').orderByChild('name'))
    },
    firebase: {
      users: database.ref('users').orderByChild('name')
    },
    methods: {
      attack () {
        // TODO
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
