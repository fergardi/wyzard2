<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.messages.animated.fadeInUp
        mu-card-media
          img(src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/messages.jpg?alt=media", :alt="translate('lbl_label_messages')")
          .card-extra
            .card-number
              i.ra.ra-quill-ink
              span {{ messages.length | minimize }}
          .card-info
            .card-text {{ 'lbl_label_messages' | translate }}

        mu-table(:showCheckbox="false", :enableSelectAll="false", :multiSelectable="false", @rowClick="select")
          mu-thead
            mu-tr
              mu-th
                mu-icon(value=":ra ra-stopwatch")
              mu-th
                mu-icon(value=":ra ra-player")
              mu-th
                mu-icon(value=":ra ra-help")
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
              .army
                .troop(v-for="wave, index in selected.battle", :key="index", :class="wave.location")
                  .name(:class="wave.color") {{ wave.name | translate }}

            mu-card-text
              p {{ selected.text | translate }}
              p(v-if="selected.attachment")
                mu-chip {{ selected.attachment.quantity | minimize }}

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
        .army
          .troop
            margin-top 5px
            display flex
            align-items center
            max-width 90%
            &.attacker
              justify-content flex-end
              margin-left 10%
            &.defender
              justify-content flex-start
            .name
            .quantity
              padding 5px 10px
              font-weight bold
              border-radius 5px
              font-size 0.9em
              border 1px solid
              display inline-block
</style>
