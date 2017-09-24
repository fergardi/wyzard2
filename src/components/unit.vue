<template lang="pug">
  mu-card.unit
    mu-card-media
      img(:src="data.image")
      #info
        #title(:class="data.color") {{ data.name | translate }}
        #number(:class="data.color", v-if="data.quantity != null") {{ data.quantity | numeric }}
        #number(:class="data.color", v-if="data.level != null") {{ data.level | numeric }}
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
