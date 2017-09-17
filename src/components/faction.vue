<template lang="pug">
  mu-card.faction
    mu-card-media
      img(:src="data.image")
      #title(:class="data.color") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}
</template>

<script>
  import firebase from '../services/firebase'

  export default {
    name: 'faction',
    props: ['name'],
    created () {
      this.$bindAsObject('data', firebase.ref('factions').child(this.name))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
