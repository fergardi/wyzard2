<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.census.animated.fadeInUp
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
                mu-chip(:class="user.faction.color") {{ user['.key'] }}
              mu-td 0
          mu-tfoot(slot="footer")
            mu-pagination(:total="total", :current="current", @pageChange="move", :pageSize="10")
</template>

<script>
  import firebase from '../services/firebase'
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
      users: firebase.ref('users')
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
