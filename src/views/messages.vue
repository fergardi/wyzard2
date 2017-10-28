<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.messages.animated.fadeInUp
        mu-card-media
          img(src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/messages.jpg?alt=media", :alt="translate('lbl_label_messages')")
          .card-extra
            .card-number(v-tooltip="translate('ttp_message_quantity')")
              i.ra.ra-quill-ink
              span {{ messages.length | minimize }}
          .card-info
            .card-text {{ 'lbl_label_messages' | translate }}

        mu-table(:showCheckbox="false", :enableSelectAll="false", :multiSelectable="false", @rowClick="select")
          mu-thead
            mu-tr
              mu-th(v-tooltip="translate('ttp_message_time')")
                .ra.ra-lg.ra-stopwatch
              mu-th(v-tooltip="translate('ttp_message_name')")
                .ra.ra-lg.ra-player
              mu-th(v-tooltip="translate('ttp_message_subject')")
                .ra.ra-lg.ra-help
          mu-tbody
            template(v-if="paginated.length")
              mu-tr(v-for="message, index in paginated", :key="index")
                mu-td {{ message.timestamp | timesince }}
                mu-td
                  mu-chip(:class="message.color") {{ message.name | translate }}
                mu-td {{ message.subject | translate }}
            mu-tr(v-else)
              mu-td -
              mu-td -
              mu-td -
          mu-tfoot(slot="footer")
            mu-pagination(:total="total", :current="current", @pageChange="move", :pageSize="size")

      mu-dialog(:open="dialog", @close="close")
        mu-card.dialog
          mu-card-media
            img(src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/message.jpg?alt=media")
            .card-extra
              .card-text
                i.ra.ra-quill-ink
                span {{ selected.subject | translate }}
            .card-info
              .card-text(:class="selected.color")
                i.ra.ra-player
                span {{ selected.name | translate }}
                
          .scroll
            mu-card-text
              p {{ selected.text | translate }}

            mu-card-text(v-if="selected.battle")
              .log(v-for="log, index in selected.battle", :key="index")
                .info {{ 'lbl_battle_round' | translate }}  {{ index + 1 | numeric }}
                .info(:class="log.attacker.left ? 'left' : 'right'")
                  mu-chip(:class="log.attacker.color")
                    i.ra.ra-crossed-axes
                    span {{ log.attacker.quantity | numeric }}
                  mu-chip(:class="log.attacker.color")
                    span {{ log.attacker.name | translate }}
                  mu-chip(:class="log.attacker.color")
                    i.ra.ra-death-skull
                    span {{ log.attacker.casualties | translate }}
                .info(:class="log.defender.left ? 'left' : 'right'")
                  mu-chip(:class="log.defender.color")
                    i.ra.ra-crossed-axes
                    span {{ log.defender.quantity | numeric }}
                  mu-chip(:class="log.defender.color")
                    span {{ log.defender.name | translate }}
                  mu-chip(:class="log.defender.color")
                    i.ra.ra-death-skull
                    span {{ log.defender.casualties | translate }}
              .log
                .info {{ 'lbl_battle_finish' | translate }}
              
            mu-card-text.attachments
              .attachment(v-if="selected.gold")
                mu-chip
                  i.ra.ra-gold-bar
                  span {{ selected.gold | numeric }}
              .attachment(v-if="selected.people")
                mu-chip
                  i.ra.ra-double-team
                  span {{ selected.people | numeric }}
              .attachment(v-if="selected.kills")
                mu-chip
                  i.ra.ra-decapitation
                  span {{ selected.kills | numeric }}
              .attachment(v-if="selected.conquered")
                mu-chip
                  i.ra.ra-tower
                  span {{ selected.conquered | numeric }}
              .attachment(v-if="selected.sieged")
                mu-chip
                  i.ra.ra-fire
                  span {{ selected.sieged | numeric }}
              .attachment(v-if="selected.artifact")
                mu-chip(:class="selected.artifact.color")
                  i.ra.ra-crystals
                  span {{ selected.artifact.name | translate }}

          mu-card-actions
            mu-raised-button(primary, @click="remove") {{ 'lbl_button_remove' | translate }}
            mu-raised-button(primary, @click="close") {{ 'lbl_button_close' | translate }}
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
    data () {
      return {
        size: 10,
        current: 1,
        dialog: false,
        selected: {}
      }
    },
    created () {
      store.commit('title', 'lbl_title_messages')
      this.$bindAsArray('messages', database.ref('users').child(store.state.uid).child('messages').orderByChild('timestamp'))
    },
    methods: {
      move (page) {
        this.current = page
      },
      select (index) {
        if (index && this.messages[index] !== undefined) {
          this.selected = this.messages[index]
          this.dialog = true
        }
      },
      async remove () {
        await database.ref('users').child(store.state.uid).child('messages').child(this.selected['.key']).remove()
        store.commit('success', 'lbl_toast_message_ok')
        this.close()
      },
      close () {
        this.dialog = false
        this.selected = {}
      }
    },
    computed: {
      total () {
        return this.messages.length
      },
      sorted () {
        return this.messages.sort((a, b) => b.timestamp - a.timestamp)
      },
      paginated () {
        return this.sorted.slice((this.current - 1) * this.size, this.current * this.size)
      }
    }
  }
</script>

<style lang="stylus">
  .mu-dialog
    .scroll
      max-height 30vh
      overflow-y auto
      .mu-card-text:first-of-type
        margin-top 10px
      .attachments
        display flex
        justify-content center
        align-items center
      .log
      .attachment
        .mu-chip
          padding 5px 10px
          i
            margin-right 5px
        .info
          margin 5px
          display flex
          align-items center
          justify-content center
          &.left
          &.right
            max-width 90%
            width 90%
            min-width 90%
          &.left
            justify-content flex-start
          &.right
            justify-content flex-end
            margin-left 10%
            .mu-chip
              justify-content flex-end
</style>
