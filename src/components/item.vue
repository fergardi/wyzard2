<template lang="pug">
  mu-card.item
    mu-card-media
      img(:src="data.image")
      #title(:class="data.faction.color") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}
</template>

<script>
  import store from '../vuex/store'
  import i18n from '../services/i18n'

  export default {
    name: 'item',
    props: ['data'],
    methods: {
      translate (label) {
        return i18n[store.state.lang][label] || label
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
