<template lang="pug">
  mu-card.unit
    mu-card-media
      img(:src="data.image")
      #title(:class="data.color") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="troop")
      mu-card-actions
        mu-raised-button(primary, @click="disband") {{ 'lbl_button_disband' | translate }}
</template>

<script>
  export default {
    name: 'unit',
    props: ['data', 'troop'],
    methods: {
      disband () {
        // TODO
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
