<template lang="pug">
  mu-card.hero
    mu-card-media
      img(:src="data.image")
      .card-info
        .card-title(:class="data.color") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="data.level != null") {{ data.level | numeric }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="contract")
      mu-card-text
        form
          mu-text-field(type="number", v-model="amount", :min="data.gold + 1", required, :label="translate('lbl_resource_gold')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="bid") {{ 'lbl_button_bid' | translate }}
</template>

<script>
  export default {
    name: 'hero',
    props: ['data', 'contract'],
    data () {
      return {
        amount: 0
      }
    },
    created () {
      this.amount = this.data.gold || 0
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
