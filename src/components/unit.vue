<template lang="pug">
  mu-card.unit
    mu-card-media
      img(:src="data.image")
      .card-info
        .card-title(:class="data.color") {{ data.name | translate }}
        .card-number(:class="data.color", v-if="data.level != null") {{ data.level | numeric }}
        .card-number(:class="data.color", v-if="data.quantity != null") {{ data.quantity | numeric }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="troop")
      form(@submit.stop.prevent="confirm('disband')")
        mu-card-text
          mu-text-field(type="number", v-model.number="amount", min="1", :max="data.quantity", :label="translate('lbl_label_quantity')", :fullWidth="true", required)
        mu-card-actions
          mu-raised-button(primary, type="submit") {{ 'lbl_button_disband' | translate }}

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
    name: 'unit',
    props: ['data', 'troop'],
    data () {
      return {
        dialog: false,
        type: null,
        amount: 0
      }
    },
    methods: {
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
        switch (this.type) {
          case 'disband':
            this.disband()
            break
        }
      },
      disband () {
        // TODO
        store.commit('success', 'lbl_toast_disband_ok')
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
