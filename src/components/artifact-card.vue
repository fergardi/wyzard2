<template lang="pug">
  mu-card.artifact
    mu-card-media
      img(:src="data.image")
      .card-info
        .card-title(:class="data.color") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="data.quantity != null") {{ data.quantity | numeric }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="enable")
      form(@submit.stop.prevent="confirm('activate')")
        mu-card-actions
          mu-raised-button(primary, type="primary") {{ 'lbl_button_activate' | translate }}

    template(v-if="auction")
      form(@submit.stop.prevent="confirm('bid')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", required, :label="translate('lbl_resource_gold')", :fullWidth="true")
        mu-card-actions
          mu-raised-button(primary, type="primary") {{ 'lbl_button_bid' | translate }}

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
    name: 'artifact-card',
    props: {
      data: Object,
      quantity: Number,
      auction: Boolean,
      enable: Boolean
    },
    data () {
      return {
        dialog: false,
        type: null,
        amount: 0
      }
    },
    created () {
      if (this.auction) this.amount = this.data.gold
    },
    methods: {
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
        switch (this.type) {
          case 'activate':
            this.activate()
            break
          case 'bid':
            this.bid()
            break
        }
      },
      activate () {
        // TODO
        store.commit('success', 'lbl_toast_activate_ok')
        this.close()
      },
      bid () {
        // TODO
        store.commit('success', 'lbl_toast_bid_ok')
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
