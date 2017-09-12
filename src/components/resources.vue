<template lang="pug">
  .resources
    mu-chip
      i.ra.ra-sword
      span {{ data.gold | format }} {{ 'lbl_resource_gold' | translate }}
    mu-chip
      i.ra.ra-sword
      span {{ data.mana | format }} {{ 'lbl_resource_mana' | translate }}
    mu-chip
      i.ra.ra-sword
      span {{ data.people | format }} {{ 'lbl_resource_people' | translate }}
    mu-chip
      i.ra.ra-sword
      span {{ data.turns | format }} {{ 'lbl_resource_turns' | translate }}
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'

  export default {
    name: 'resources',
    created () {
      this.$bindAsObject('data', firebase.ref('users').child(store.state.username))
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../css/colors.styl'
  .resources
    display flex
    justify-content center
    align-items center
    flex-wrap wrap
    .mu-chip
      cursor initial
      width 90%
      color $gold
      border 1px solid $gold
      background-color $dark
      line-height 22px
      margin 2px
      font-size 0.8em
      display flex
      justify-content space-between
      align-items center
      .ra
        line-height 23px
</style>
