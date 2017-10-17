<template lang="pug">
  mu-dialog(:open="dialog")
    mu-card.dialog
      mu-card-media
        transition(name="fade", mode="out-in", enter-active-class="animated fadeIn")
          img(src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/confirm.jpg?alt=media", :alt="translate('lbl_label_confirm')")
        mu-circular-progress(v-if="busy", :size="100", color="#ad835a")
        .card-info
          .card-text {{ 'lbl_label_confirm' | translate }}
      mu-card-text
        p {{ busy ? 'lbl_label_processing' : 'lbl_label_cannot_undo' | translate }}
      mu-card-actions
        mu-raised-button(primary, :label="translate('lbl_button_cancel')", @click="close", :disabled="busy")
        mu-raised-button(primary, :label="translate('lbl_button_confirm')", @click="accept", :disabled="busy")
</template>

<script>
  export default {
    name: 'confirm-dialog',
    props: {
      dialog: Boolean,
      busy: Boolean
    },
    methods: {
      close () {
        this.$emit('close')
      },
      accept () {
        this.$emit('accept')
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
