<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.messages.animated.fadeInUp
        mu-card-media
          img(src="http://i.jeuxactus.com/datas/jeux/e/m/empire-total-war/xl/empire-total-war-4e2610bfb95fd.jpg")
          .card-info
            .card-title {{ 'lbl_label_messages' | translate }}
            .card-number {{ messages.length | numeric }}
        mu-table(:showCheckbox="false", :enableSelectAll="false", :multiSelectable="false")
          mu-thead
            mu-tr
              mu-th {{ 'lbl_table_datetime' | translate }}
              mu-th {{ 'lbl_table_from' | translate }}
              mu-th {{ 'lbl_table_subject' | translate }}
              // mu-th {{ 'lbl_table_actions' | translate }}
          mu-tbody
            mu-tr(v-for="message, index in messages", :key="index", @click="select(message)")
              mu-td {{ message.timestamp | datetime }}
              mu-td
                mu-chip(:class="message.color") {{ message.name }}
              mu-td {{ message.subject }}
              // mu-td
                mu-icon-button(icon=":ra ra-scroll-unfurled", @click="select(message)")
          // mu-tfoot(slot="footer")
            mu-raised-button(primary, @click="create") {{ 'lbl_button_create' | translate }}
            mu-raised-button(primary, @click="remove") {{ 'lbl_button_remove' | translate }}
          mu-tfoot(slot="footer")
            mu-pagination(:total="total", :current="current", @pageChange="move", :pageSize="10")

      mu-dialog(:open="detail", @close="dismiss")
        mu-card
          mu-card-title(:title="selected.subject", :subTitle="datetime(selected.datetime)")
            p {{ selected.subject }}
          mu-card-text
            p {{ selected.content }}
          mu-card-text.right
            mu-chip(:class="selected.color") {{ selected.name }}
          mu-card-actions
            mu-raised-button(primary, @click="dismiss") {{ 'lbl_button_close' | translate }}
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
    name: 'census',
    data () {
      return {
        current: 1,
        detail: false,
        selected: {
          subject: '',
          content: '',
          name: '',
          color: ''
        }
      }
    },
    created () {
      store.commit('title', 'lbl_title_messages')
      this.$bindAsArray('messages', database.ref('users').child(store.state.username).child('messages').orderByChild('timestamp'))
    },
    methods: {
      move (page) {
        this.current = page
      },
      select (message) {
        this.selected = message
        this.detail = true
      },
      dismiss () {
        this.detail = false
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
