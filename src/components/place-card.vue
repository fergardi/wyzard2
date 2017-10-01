<template lang="pug">
  mu-card.place
    mu-card-media
      img(:src="data.image")
      .card-info
        .card-title(:class="data.color") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="adventure")
      form(@submit.stop.prevent="confirm('start')")
        mu-card-actions
          mu-raised-button(primary, type="number") {{ 'lbl_button_start' | translate }}

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
    name: 'place-card',
    props: {
      data: Object,
      adventure: Boolean
    },
    data () {
      return {
        dialog: false,
        type: null
      }
    },
    methods: {
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
        switch (this.type) {
          case 'start':
            this.start()
            break
        }
      },
      start () {
        // TODO
        store.commit('success', 'lbl_toast_start_ok')
        this.close()
      },
      close () {
        this.type = null
        this.dialog = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
