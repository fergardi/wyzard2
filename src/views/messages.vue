<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.messages.animated.fadeInUp
        mu-card-media
          img(src="http://i.jeuxactus.com/datas/jeux/e/m/empire-total-war/xl/empire-total-war-4e2610bfb95fd.jpg", :alt="translate('lbl_label_messages')")
          .card-info
            .card-title {{ 'lbl_label_messages' | translate }}
            .card-number {{ messages.length | numeric }}
        mu-table(:showCheckbox="false", :enableSelectAll="false", :multiSelectable="false", @rowClick="select")
          mu-thead
            mu-tr
              mu-th {{ 'lbl_table_since' | translate }}
              mu-th {{ 'lbl_table_from' | translate }}
              mu-th {{ 'lbl_table_subject' | translate }}
          mu-tbody
            mu-tr(v-for="message, index in messages", :key="index")
              mu-td {{ message.timestamp | datetime }}
              mu-td
                mu-chip(:class="message.color") {{ message.username }}
              mu-td {{ message.subject | translate }}
          mu-tfoot(slot="footer")
            mu-pagination(:total="total", :current="current", @pageChange="move", :pageSize="10")

      mu-dialog(:open="dialog", @close="close")
        mu-card.dialog
          mu-card-header(:title="translate(selected.subject)", :subTitle="datetime(selected.timestamp)")
          mu-card-text.timeline.scroll(v-if="selected.battle")
            mu-timeline
              mu-timeline-item(v-for="timeline, index in selected.battle", :key="index", :class="timeline.location")
                mu-icon(:value="':ra ra-' + timeline.icon", :color="timeline.color", slot="icon")
                span(slot="time") {{ timeline.name | translate }}
                span(slot="des") {{ timeline.description }}
          mu-card-text
            p {{ selected.text | translate }}
          mu-card-text.right
            mu-chip(:class="selected.color") {{ selected.username }}
          mu-card-actions
            mu-raised-button(primary, @click="close") {{ 'lbl_button_close' | translate }}
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
    data () {
      return {
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
      },
      create () {
        // TODO
      },
      remove () {
        // TODO
      }
    },
    computed: {
      total () {
        return this.messages.length
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .right
    text-align right !important
</style>

<style lang="stylus">
  .mu-dialog
    .timeline
      max-height 50vh
      overflow auto
      .mu-timeline-item
        display flex
        align-items flex-start
        .mu-timeline-item-line
          display none
        .mu-timeline-item-des span
          font-style italic
          font-size 0.8em
        .mu-timeline-item-icon
          position relative
          width 10%
          background-color transparent
        .mu-timeline-item-content
          left unset !important
          padding-bottom 0
          width 45%
        &.attacker
          .mu-timeline-item-icon
            text-align right
            margin-left 45%
            margin-right 5%
          .mu-timeline-item-content
            text-align left
        &.defender
          flex-direction row-reverse
          .mu-timeline-item-icon
            margin-right 45%
            margin-left 5%
            text-align left
          .mu-timeline-item-content
            text-align right
</style>
