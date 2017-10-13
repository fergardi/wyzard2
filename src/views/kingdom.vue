<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.animated.fadeInUp
        mu-card-media
          img(src="https://i.pinimg.com/736x/4f/24/ce/4f24ce0a235a763bb1a4a110bcbe028a--magic-book-dark-fantasy.jpg", :alt="translate('lbl_label_summary')")
          .card-info
            .card-text {{ 'lbl_label_summary' | translate }}

        mu-table(:showCheckbox="false", :selectable="false")
          mu-thead
            mu-tr
              mu-th {{ 'lbl_table_name' | translate }}
              mu-th {{ 'lbl_table_quantity' | translate }}
              mu-th {{ 'lbl_table_gold' | translate }}
              mu-th {{ 'lbl_table_people' | translate }}
              mu-th {{ 'lbl_table_mana' | translate }}
              mu-th {{ 'lbl_table_power' | translate }}

          mu-tbody
            mu-tr(v-for="building, index in user.constructions", :key="index")
              mu-td
                mu-chip(:class="building.color") {{ building.name | translate }}
              mu-td {{ building.quantity | numeric }}
              mu-td {{ building.quantity * (building.goldProduction - building.goldMaintenance) | numeric }}
              mu-td {{ building.quantity * (building.peopleProduction - building.peopleMaintenance) | numeric }}
              mu-td {{ building.quantity * (building.manaProduction - building.manaMaintenance) | numeric }}
              mu-td {{ building.quantity * building.power | numeric }}

            mu-tr(v-for="unit, index in user.troops", :key="index")
              mu-td
                mu-chip(:class="unit.color") {{ unit.name | translate }}
              mu-td {{ unit.quantity | numeric }}
              mu-td {{ unit.quantity * unit.goldMaintenance | numeric }}
              mu-td {{ unit.quantity * unit.peopleMaintenance | numeric }}
              mu-td {{ unit.quantity * unit.manaMaintenance | numeric }}
              mu-td {{ unit.quantity * unit.power | numeric }}

            mu-tr(v-for="hero, index in user.contracts", :key="index")
              mu-td
                mu-chip(:class="hero.color") {{ hero.name | translate }}
              mu-td {{ hero.level | numeric }}
              mu-td {{ hero.level * hero.goldMaintenance | numeric }}
              mu-td {{ hero.level * hero.peopleMaintenance | numeric }}
              mu-td {{ hero.level * hero.manaMaintenance | numeric }}
              mu-td {{ hero.level * hero.power | numeric }}
            
            mu-tr
              mu-td {{ 'lbl_table_total' | translate }}
              mu-td =
              mu-td
                span.income(:class="user.goldPerTurn >= 0 ? 'green' : 'red'") {{ user.goldPerTurn >= 0 ? '&#9650;' : '&#9660;' }}
                span {{ user.goldPerTurn }}
              mu-td
                span.income(:class="user.peoplePerTurn >= 0 ? 'green' : 'red'") {{ user.peoplePerTurn >= 0 ? '&#9650;' : '&#9660;' }}
                span {{ user.peoplePerTurn }}
              mu-td
                span.income(:class="user.manaPerTurn >= 0 ? 'green' : 'red'") {{ user.manaPerTurn >= 0 ? '&#9650;' : '&#9660;' }}
                span {{ user.manaPerTurn }}
              mu-td {{ user.power }}
</template>

<script>
  import store from '../vuex/store'
  
  export default {
    created () {
      store.commit('title', 'lbl_title_kingdom')
    },
    computed: {
      user () {
        return store.state.user
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
