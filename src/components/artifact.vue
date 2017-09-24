<template lang="pug">
  mu-card.artifact
    mu-card-media
      img(:src="data.image")
      #info
        #title(:class="data.color") {{ data.name | translate }}
        #number(:class="data.color", v-if="data.quantity != null") {{ data.quantity | numeric }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="auction")
      mu-card-text
        form
          mu-text-field(type="number", v-model="ammount", min="0", required, :label="translate('lbl_resource_gold')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="bid") {{ 'lbl_button_bid' | translate }}
</template>

<script>
  export default {
    name: 'artifact',
    props: ['data', 'quantity', 'auction'],
    data () {
      return {
        ammount: 0
      }
    },
    created () {
      this.ammount = this.data.gold
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
