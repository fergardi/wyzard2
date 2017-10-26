<template lang="pug">
  mu-card.place
    mu-card-media
      img.lazy(v-lazy-load="data.image", src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/loading.jpg?alt=media", :alt="translate(data.name)")
      .card-info
        .card-text(:class="data.color", v-tooltip="translate('ttp_place_name')") {{ data.name | translate }}
        .card-number(v-if="adventure", :class="data.color", v-tooltip="translate('ttp_turn_cost')")
          i.ra.ra-hourglass
          span {{ data.turns | minimize }}
    mu-card-text
      p.card-description {{ data.description | translate }}

    template(v-if="adventure")
      form(@submit.stop.prevent="confirm('start')")
        mu-card-actions
          mu-raised-button(primary, type="number", :disabled="!hasTurns || busy") {{ 'lbl_button_start' | translate }}

    confirm-dialog(v-if="!info", :dialog="dialog", :busy="busy", @close="close", @accept="accept")
</template>

<script>
  import store from '../vuex/store'
  import confirm from './confirm-dialog'
  import { checkTurnMaintenances, updateGeneralStatus } from '../services/api'

  export default {
    name: 'place-card',
    components: {
      'confirm-dialog': confirm
    },
    props: {
      data: Object,
      info: Boolean,
      adventure: Boolean
    },
    data () {
      return {
        dialog: false,
        type: null,
        busy: false
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
      async start () {
        if (this.hasTurns) {
          await checkTurnMaintenances(store.state.uid, this.data.turns)
          // TODO
          await updateGeneralStatus(store.state.uid)
          store.commit('success', 'lbl_toast_start_ok')
          this.close()
        }
      },
      close () {
        this.type = null
        this.dialog = false
        this.busy = false
      }
    },
    computed: {
      user () {
        return store.state.user
      },
      hasTurns () {
        return this.data.turns <= this.user.turns
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
