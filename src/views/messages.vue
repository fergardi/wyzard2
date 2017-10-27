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
                .ra.ra-stopwatch
              mu-th(v-tooltip="translate('ttp_message_name')")
                .ra.ra-player
              mu-th(v-tooltip="translate('ttp_message_subject')")
                .ra.ra-help
          mu-tbody
            mu-tr(v-for="message, index in paginated", :key="index")
              mu-td {{ message.timestamp | timesince }}
              mu-td
                mu-chip(:class="message.color") {{ message.name | translate }}
              mu-td {{ message.subject | translate }}
          mu-tfoot(slot="footer")
            mu-pagination(:total="total", :current="current", @pageChange="move", :pageSize="size")

      mu-dialog(:open="dialog", @close="close")
        mu-card.dialog
          mu-card-media
            img(src="http://i.jeuxactus.com/datas/jeux/e/m/empire-total-war/xl/empire-total-war-4e2610bfb95fd.jpg")
            .card-extra
              .card-text(:class="selected.color") {{ selected.name | translate }}
            .card-info
              .card-text {{ selected.subject | translate }}

          .scroll
            mu-card-text.battle(v-if="selected.battle")
              .log(v-for="log, index in selected.battle", :key="index")
                .round {{ 'lbl_text_round' | translate }}  {{ index + 1 | numeric }}
                .attacker(:class="log.attacker.left ? 'left' : 'right'")
                  mu-chip(:class="log.attacker.color")
                    span {{ log.attacker.name | translate }}
                    i.ra.ra-crossed-axes
                    span {{ log.defender.name | translate }}
                .defender(:class="log.defender.left ? 'left' : 'right'")
                  mu-chip(:class="log.defender.color")
                    span {{ log.defender.name | translate }}
                    i.ra.ra-crossed-axes
                    span {{ log.attacker.name | translate }}
              
              .log(v-if="selected.bounty")
                .bounty {{ 'lbl_text_bounty' | translate }}
                mu-chip(:class="selected.bounty.color")
                  i.ra.ra-crystals
                  span {{ selected.bounty.name | translate }}

              .log
                p {{ selected.text | translate }}
                mu-chip(v-if="selected.relic", :class="selected.relic.color")
                  i.ra.ra-crystals
                  span {{ selected.relic.name | translate }}

          mu-card-actions
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
        this.selected = this.messages[index]
        this.selected.battle = [
          {
            attacker: {
              left: true,
              name: 'lbl_unit_goblin',
              color: 'red',
              kills: 5
            },
            defender: {
              left: false,
              name: 'lbl_unit_elf',
              color: 'green',
              quantity: 233,
              kills: 23
            }
          },
          {
            attacker: {
              left: false,
              name: 'lbl_unit_elf',
              color: 'green',
              quantity: 233,
              kills: 9
            },
            defender: {
              left: true,
              name: 'lbl_unit_goblin',
              color: 'red',
              quantity: 23,
              kills: 6
            }
          }
        ]
        this.selected.bounty = {
          name: 'lbl_artifact_mana_potion',
          color: 'blue'
        }
        this.dialog = true
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
      .battle
        .log
          .mu-chip
            padding 5px 10px
            i
              margin 0 5px
          .attacker
          .defender
          .bounty
            margin 5px
            display flex
            align-items center
            justify-content  center
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
