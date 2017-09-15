<template lang="pug">
  mu-card.hero.animated.fadeInUp
    mu-card-media
      img(:src="data.image")
      #title(:class="data.faction ? data.faction.color : ''") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="gold !== undefined && gold >= 0 && level !== undefined && level >= 0")
      mu-card-text
        form
          mu-text-field(type="number", v-model="gold", min="0", required, :label="translate('lbl_resource_gold')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="bid") {{ 'lbl_button_bid' | translate }}
</template>

<script>
  import firebase from '../services/firebase'

  export default {
    name: 'hero',
    props: ['name', 'gold', 'level'],
    created () {
      this.$bindAsObject('data', firebase.ref('heroes').child(this.name))
    },
    methods: {
      bid () {
        // TODO
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
