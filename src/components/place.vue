<template lang="pug">
  mu-card.place
    mu-card-media
      img(:src="data.image")
      #title(:class="data.color") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="adventure")
      mu-card-actions
        mu-raised-button(primary, @click="start") {{ 'lbl_button_start' | translate }}
</template>

<script>
  export default {
    name: 'place',
    props: ['data', 'adventure', 'troops'],
    methods: {
      start () {
        // TODO
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
