<template lang="pug">
  mu-card.unit
    mu-card-media
      img(:src="data.image")
      .card-info
        .card-title(:class="data.color") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="data.quantity != null") {{ data.quantity | numeric }}
        .card-number(:class="data.color", v-if="data.level != null") {{ data.level | numeric }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="troop")
      mu-card-text
        form
          mu-text-field(v-model="amount", :label="translate('lbl_label_quantity')", :fullWidth="true", required)
      mu-card-actions
        mu-raised-button(primary, @click="disband") {{ 'lbl_button_disband' | translate }}
</template>

<script>
  export default {
    name: 'unit',
    props: ['data', 'troop'],
    data () {
      return {
        amount: 0
      }
    },
    methods: {
      disband () {
        // TODO
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
