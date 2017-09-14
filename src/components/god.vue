<template lang="pug">
  mu-card.god.animated.fadeInUp(v-if="show")
    mu-card-media
      img(:src="data.image")
      #title(:class="data.faction ? data.faction.color : ''") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="gold !== undefined && gold >= 0")
      mu-card-text
        form
          mu-text-field(type="number", v-model="gold", min="0", required, :label="translate('lbl_resource_gold')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="offer") {{ 'lbl_button_offer' | translate }}
</template>

<script>
  import store from '../vuex/store'
  import firebase from '../services/firebase'

  export default {
    name: 'god',
    props: ['name', 'gold', 'delay'],
    data () {
      return {
        show: false
      }
    },
    created () {
      this.$bindAsObject('data', firebase.ref('gods').child(this.name))
      setTimeout(() => { this.show = true }, (this.delay || 1) * store.state.delay)
    },
    methods: {
      offer () {
        // TODO
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
