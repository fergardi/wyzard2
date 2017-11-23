<template lang="pug">
  mu-dialog(:open="dialog", @close="close", @keyup.esc="close", @keyup.enter="accept")
    mu-card.dialog
      mu-card-media
        .card-image(v-once)
          img.lazy(v-lazy-load="picture('miscellaneous', 'confirm')", :src="picture('miscellaneous', 'loading')", :alt="translate('lbl_label_confirm')")
        .card-spinner
          mu-circular-progress(v-if="busy", :size="100", color="#ad835a")
          .progress(v-if="user && busy")
            i.ra.ra-lg.ra-hourglass
            span {{ user.turns }}
        .card-info
          .card-text {{ 'lbl_label_confirm' | translate }}
      mu-card-text.card-description
        p {{ busy ? 'lbl_label_processing_maintenances' : 'lbl_label_cannot_undo' | translate }}
      mu-card-actions
        mu-raised-button(primary, :label="translate('lbl_button_cancel')", @click="close", :disabled="busy")
        mu-raised-button(primary, :label="translate('lbl_button_confirm')", @click="accept", :disabled="busy")
</template>

<script>
  import store from '@/vuex/store'

  export default {
    name: 'confirm-dialog',
    props: {
      dialog: Boolean,
      busy: Boolean
    },
    methods: {
      close () {
        if (!this.busy) this.$emit('close')
      },
      accept () {
        if (!this.busy) this.$emit('accept')
      }
    },
    computed: {
      user () {
        return store.state.user
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
