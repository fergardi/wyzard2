<template lang="pug">
  mu-card.place
    mu-card-media
      img.lazy(v-lazy-load="data.image", src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/loading.jpg?alt=media", :alt="translate(data.name)")
      .card-info
        .card-text(:class="data.color") {{ data.name | translate }}
    mu-card-text
      p.card-description {{ data.description | translate }}

    template(v-if="adventure")
      form(@submit.stop.prevent="confirm('start')")
        mu-card-actions
          mu-raised-button(primary, type="number") {{ 'lbl_button_start' | translate }}

    mu-dialog(:open="dialog", @close="close")
      mu-card.dialog
        mu-card-media
          img(src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/confirm.jpg?alt=media", :alt="translate('lbl_label_confirm')")
          .card-info
            .card-text {{ 'lbl_label_confirm' | translate }}
        mu-card-text
          p {{ 'lbl_label_cannot_undo' | translate }}
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
