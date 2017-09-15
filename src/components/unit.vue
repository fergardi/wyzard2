<template lang="pug">
  mu-card.unit.animated.fadeInUp
    mu-card-media
      img(:src="data.image")
      #title(:class="data.faction ? data.faction.color : ''") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}
</template>

<script>
  import firebase from '../services/firebase'

  export default {
    name: 'unit',
    props: ['name'],
    created () {
      this.$bindAsObject('data', firebase.ref('units').child(this.name))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
