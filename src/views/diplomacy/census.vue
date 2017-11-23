<template lang="pug">
  mu-row
    
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.census.animated.fadeInUp
        mu-card-media
          .card-image
            img(v-lazy-load="picture('miscellaneous', 'census')", :src="picture('miscellaneous', 'loading')", :alt="translate('lbl_label_users')")
          .card-extra
            .card-number(v-tooltip="translate('ttp_census_quantity')")
              i.ra.ra-player
              span {{ users.length | minimize }}
          .card-info
            .card-text {{ 'lbl_label_players' | translate }}
            
        mu-table(:showCheckbox="false", :selectable="false")
          mu-thead
            mu-tr
              mu-th(v-tooltip="translate('ttp_census_domains')")
                i.ra.ra-lg.ra-tower
              mu-th(v-tooltip="translate('ttp_census_name')")
                i.ra.ra-lg.ra-player
              mu-th.number(v-tooltip="translate('ttp_census_power')")
                i.ra.ra-lg.ra-fire-symbol
          mu-tbody
            mu-tr(v-for="user, index in paginated", :key="index", :selectable="false")
              mu-td {{ user.domains | minimize }}
              mu-td
                i.ra.ra-shield(v-if="protected(user.attacked)", v-tooltip="translate('ttp_census_attacked')")
                mu-chip(:class="user.color") {{ user.name }}
              mu-td.number {{ user.power | minimize }}
          mu-tfoot(slot="footer")
            mu-pagination(:total="total", :current="current", @pageChange="move", :pageSize="size")
</template>

<script>
  import { database } from '@/services/firebase'
  import store from '@/vuex/store'
  
  export default {
    data () {
      return {
        size: 10,
        current: 1
      }
    },
    created () {
      store.commit('title', 'lbl_title_census')
      store.commit('help', 'txt_help_census')
    },
    firebase: {
      users: database.ref('users').orderByChild('name')
    },
    methods: {
      move (page) {
        this.current = page
      },
      protected (timestamp) {
        return Date.now() <= timestamp
      }
    },
    computed: {
      total () {
        return this.users.length
      },
      sorted () {
        return this.users.sort((a, b) => b.power - a.power)
      },
      paginated () {
        return this.sorted.slice((this.current - 1) * this.size, this.current * this.size)
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
