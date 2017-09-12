<template lang="pug">
  mu-card.artifact.animated.fadeInUp(v-if="show")
    mu-card-media
      img(:src="data.image")
      #title(:class="data.faction.color") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}
</template>

<script>
  import firebase from '../services/firebase'

  export default {
    name: 'artifact',
    props: ['name', 'quantity', 'delay'],
    data () {
      return {
        show: false
      }
    },
    created () {
      this.$bindAsObject('data', firebase.ref('artifacts').child(this.name))
      setTimeout(() => { this.show = true }, (this.delay || 1) * 50)
    }
  }
</script>

<style lang="stylus" scoped>
</style>
