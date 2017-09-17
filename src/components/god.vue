<template lang="pug">
  mu-card.god
    mu-card-media
      img(:src="data.image")
      #title(:class="data.color") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="pray")
      mu-card-text
        form
          mu-text-field(type="number", v-model="ammount", :min="data.gold + 1", required, :label="translate('lbl_resource_gold')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="offer") {{ 'lbl_button_offer' | translate }}
</template>

<script>
  export default {
    name: 'god',
    props: ['data', 'pray'],
    data () {
      return {
        ammount: 0
      }
    },
    created () {
      this.ammount = this.gold
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
