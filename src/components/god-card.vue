<template lang="pug">
  mu-card.god
    mu-card-media
      img(:src="data.image")
      .card-info
        .card-title(:class="data.color") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="pray")
      form(@submit.stop.prevent="confirm('offer')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", :min="data.gold + 1", required, :label="translate('lbl_resource_gold')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="submit") {{ 'lbl_button_offer' | translate }}

    mu-dialog(:open="dialog", @close="close")
      mu-card.dialog
        mu-card-header(:title="translate('lbl_label_confirm')", :subTitle="translate('lbl_label_cannot_undo')")
        mu-card-actions
          mu-raised-button(primary, :label="translate('lbl_button_cancel')", @click="close")
          mu-raised-button(primary, :label="translate('lbl_button_confirm')", @click="accept")
</template>

<script>
  import store from '../vuex/store'

  export default {
    name: 'god-card',
    props: {
      data: Object,
      pray: Boolean
    },
    data () {
      return {
        dialog: false,
        type: null,
        amount: 0
      }
    },
    created () {
      if (this.pray) this.amount = this.data.gold
    },
    methods: {
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
        switch (this.type) {
          case 'offer':
            this.offer()
            break
        }
      },
      offer () {
        // TODO
        store.commit('success', 'lbl_toast_offer_ok')
        this.close()
      },
      close () {
        this.type = null
        this.dialog = false
        this.amount = 0
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
