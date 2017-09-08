<template lang="pug">
  mu-card.item
    mu-card-header(:title="translate(data.faction.name)", :subTitle="translate(data.type)")
      mu-avatar(:src="data.faction.image", slot="avatar")
    mu-card-media(:title="translate(data.name)", :subTitle="translate(data.category)")
      img(:src="data.image")
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
  .item
    margin 5px
</style>
