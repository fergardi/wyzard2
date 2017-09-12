<template lang="pug">
  mu-card.building.animated.fadeInUp(v-if="show")
    mu-card-media
      img(:src="data.image")
      #title(:class="data.faction ? data.faction.color : ''") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}
    template(v-if="quantity !== undefined")
      mu-card-text
        form
          mu-text-field(type="number", v-model="quantity", min="0", required, :label="translate('lbl_label_quantity')")
      mu-card-actions
        mu-raised-button(primary, @click="demolish") {{ 'lbl_button_demolish' | translate }}
        mu-raised-button(primary, @click="construct") {{ 'lbl_button_construct' | translate }}
</template>

<script>
  import firebase from '../services/firebase'
  import store from '../vuex/store'

  export default {
    name: 'building',
    props: ['name', 'quantity', 'delay'],
    data () {
      return {
        show: false
      }
    },
    created () {
      this.$bindAsObject('data', firebase.ref('buildings').child(this.name))
      setTimeout(() => { this.show = true }, (this.delay || 1) * store.state.delay)
    },
    methods: {
      demolish () {
        // TODO
      },
      construct () {
        // TODO
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
