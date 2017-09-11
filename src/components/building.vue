<template lang="pug">
  mu-card.building
    mu-card-media
      img(:src="data.image")
      #title(:class="data.faction ? data.faction.color : ''") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}
    mu-card-text(v-if="quantity !== undefined")
      form
        mu-text-field(type="number", v-model="quantity", icon="", min="0", :fullWidth="true", required)
    mu-card-actions(v-if="quantity !== undefined")
      mu-raised-button(primary) Hola
</template>

<script>
  import firebase from '../services/firebase'

  export default {
    name: 'building',
    props: ['name', 'quantity'],
    created () {
      this.$bindAsObject('data', firebase.ref('buildings').child(this.name))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
