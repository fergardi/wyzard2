<template lang="pug">
  mu-card.god
    mu-card-media
      img(:src="data.image")
      .card-info
        .card-title(:class="data.color") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="pray")
      mu-card-text
        mu-text-field(type="number", v-model="amount", :min="data.gold + 1", required, :label="translate('lbl_resource_gold')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="offer") {{ 'lbl_button_offer' | translate }}
</template>

<script>
  export default {
    name: 'god',
    props: ['data', 'pray'],
    data () {
      return {
        amount: 0
      }
    },
    created () {
      this.amount = this.data.gold
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
