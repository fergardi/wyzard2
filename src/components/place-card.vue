<template lang="pug">
  mu-card.place
    mu-card-media
      img.lazy(v-lazy-load="data.image", src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/loading.jpg?alt=media", :alt="translate(data.name)")
      .card-info
        .card-text(:class="data.color") {{ data.name | translate }}
        .card-number(:class="data.color")
          i.ra.ra-hourglass
          span {{ turns | minimize }}
    mu-card-text
      p.card-description {{ data.description | translate }}

    template(v-if="adventure")
      form(@submit.stop.prevent="confirm('start')")
        mu-card-actions
          mu-raised-button(primary, type="number") {{ 'lbl_button_start' | translate }}

    confirm-dialog(:dialog="dialog", :busy="busy", @close="close", @accept="accept")
</template>

<script>
  import store from '../vuex/store'
  import confirm from './confirm-dialog'

  export default {
    name: 'place-card',
    components: {
      'confirm-dialog': confirm
    },
    props: {
      data: Object,
      adventure: Boolean
    },
    data () {
      return {
        dialog: false,
        type: null,
        busy: false,
        turns: 5
      }
    },
    methods: {
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
        this.busy = true
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
        this.busy = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
