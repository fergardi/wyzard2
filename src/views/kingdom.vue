<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.animated.fadeInUp
        mu-card-media
          img(src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/kingdom.jpg?alt=media", :alt="translate('lbl_label_summary')")
          .card-info
            .card-text {{ 'lbl_label_summary' | translate }}

        mu-table(:showCheckbox="false", :selectable="false")
          mu-thead
            mu-tr
              mu-th.title {{ 'lbl_table_name' | translate }}
              mu-th.number {{ 'lbl_table_quantity' | translate }}
              mu-th.number {{ 'lbl_table_gold' | translate }}
              mu-th.number {{ 'lbl_table_people' | translate }}
              mu-th.number {{ 'lbl_table_mana' | translate }}
              mu-th.number {{ 'lbl_table_power' | translate }}

          mu-tbody
            mu-tr(v-for="building, index in user.constructions", :key="index")
              mu-td.title
                mu-chip(:class="building.color") {{ building.name | translate }}
              mu-td.number {{ building.quantity | numeric }}
              mu-td.number {{ building.quantity * (building.goldProduction - building.goldMaintenance) | numeric }}
              mu-td.number {{ building.quantity * (building.peopleProduction - building.peopleMaintenance) | numeric }}
              mu-td.number {{ building.quantity * (building.manaProduction - building.manaMaintenance) | numeric }}
              mu-td.number {{ building.quantity * building.power | numeric }}

            mu-tr(v-for="unit, index in user.troops", :key="index")
              mu-td.title
                mu-chip(:class="unit.color") {{ unit.name | translate }}
              mu-td.number {{ unit.quantity | numeric }}
              mu-td.number {{ unit.quantity * unit.goldMaintenance | numeric }}
              mu-td.number {{ unit.quantity * unit.peopleMaintenance | numeric }}
              mu-td.number {{ unit.quantity * unit.manaMaintenance | numeric }}
              mu-td.number {{ unit.quantity * unit.power | numeric }}

            mu-tr(v-for="hero, index in user.contracts", :key="index")
              mu-td.title
                mu-chip(:class="hero.color") {{ hero.name | translate }}
              mu-td.number {{ hero.level | numeric }}
              mu-td.number {{ hero.level * hero.goldMaintenance | numeric }}
              mu-td.number {{ hero.level * hero.peopleMaintenance | numeric }}
              mu-td.number {{ hero.level * hero.manaMaintenance | numeric }}
              mu-td.number {{ hero.level * hero.power | numeric }}
            
            mu-tr(v-for="enchantment, index in praises", :key="index")
              mu-td.title
                mu-chip(:class="enchantment.color") {{ enchantment.name | translate }}
              mu-td.number {{ enchantment.magic | numeric }}
              mu-td.number {{ enchantment.magic * enchantment.goldMaintenance | numeric }}
              mu-td.number {{ enchantment.magic * enchantment.peopleMaintenance | numeric }}
              mu-td.number {{ enchantment.magic * enchantment.manaMaintenance | numeric }}
              mu-td.number {{ enchantment.magic * enchantment.power | numeric }}

            mu-tr(v-for="enchantment, index in curses", :key="index")
              mu-td.title
                mu-chip(:class="enchantment.color") {{ enchantment.name | translate }}
              mu-td.number {{ enchantment.magic | numeric }}
              mu-td.number {{ enchantment.magic * 0 | numeric }}
              mu-td.number {{ enchantment.magic * 0 | numeric }}
              mu-td.number {{ enchantment.magic * 0 | numeric }}
              mu-td.number {{ enchantment.magic * enchantment.power | numeric }}
            
            mu-tr
              mu-td.title {{ 'lbl_table_total' | translate }}
              mu-td.number =
              mu-td.number
                span.income(:class="user.goldPerTurn >= 0 ? 'green' : 'red'") {{ user.goldPerTurn >= 0 ? '&#9650;' : '&#9660;' }}
                span {{ user.goldPerTurn }}
              mu-td.number
                span.income(:class="user.peoplePerTurn >= 0 ? 'green' : 'red'") {{ user.peoplePerTurn >= 0 ? '&#9650;' : '&#9660;' }}
                span {{ user.peoplePerTurn }}
              mu-td.number
                span.income(:class="user.manaPerTurn >= 0 ? 'green' : 'red'") {{ user.manaPerTurn >= 0 ? '&#9650;' : '&#9660;' }}
                span {{ user.manaPerTurn }}
              mu-td.number {{ user.power }}
</template>

<script>
  import store from '../vuex/store'
  import { database } from '../services/firebase'
  
  export default {
    created () {
      store.commit('title', 'lbl_title_kingdom')
      this.$bindAsArray('enchantments', database.ref('enchantments'))
    },
    computed: {
      user () {
        return store.state.user
      },
      praises () {
        return this.enchantments.filter(e => e.support && e.target === store.state.uid && e.source === store.state.uid)
      },
      curses () {
        return this.enchantments.filter(e => !e.support && e.target === store.state.uid && e.source !== store.state.uid)
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
