<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.census.animated.fadeInUp
        mu-card-media
          img(src="https://i.pinimg.com/originals/4a/9f/99/4a9f99a8bf410e4ff033440c64d23ab5.jpg")
          .card-info
            .card-title {{ 'lbl_label_players' | translate }}
            .card-number {{ users.length | numeric }}
        mu-table(:showCheckbox="false")
          mu-thead
            mu-tr
              mu-th {{ 'lbl_table_position' | translate }}
              mu-th {{ 'lbl_table_name' | translate }}
              mu-th {{ 'lbl_table_karma' | translate }}
          mu-tbody
            mu-tr(v-for="user, index in users", :key="index")
              mu-td {{ index + 1 }}
              mu-td
                mu-chip(:class="user.color") {{ user.name }}
              mu-td 0
          mu-tfoot(slot="footer")
            mu-pagination(:total="total", :current="current", @pageChange="move", :pageSize="10")
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
    name: 'census',
    data () {
      return {
        current: 1
      }
    },
    created () {
      store.commit('title', 'lbl_title_census')
    },
    firebase: {
      users: database.ref('users').orderByChild('name')
    },
    methods: {
      move (page) {
        this.current = page
      }
    },
    computed: {
      total () {
        return this.users.length
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
