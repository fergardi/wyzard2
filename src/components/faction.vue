<template lang="pug">
  mu-card.faction.animated.fadeInUp(v-if="show")
    mu-card-media
      img(:src="data.image")
      #title(:class="data.color") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'

  export default {
    name: 'faction',
    props: ['name', 'delay'],
    data () {
      return {
        show: false
      }
    },
    created () {
      this.$bindAsObject('data', firebase.ref('factions').child(this.name))
      setTimeout(() => { this.show = true }, (this.delay || 1) * store.state.delay)
    }
  }
</script>

<style lang="stylus" scoped>
</style>
