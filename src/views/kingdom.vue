<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.animated.fadeInUp
        mu-card-media
          img(src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/kingdom.jpg?alt=media", :alt="translate('lbl_label_summary')")
          .card-info
            .card-text {{ 'lbl_label_summary' | translate }}

        mu-table.kingdom(:showCheckbox="false", :selectable="false")
          mu-thead
            mu-tr
              mu-th.title
                mu-icon(value=":ra ra-help")
              mu-th.number
                mu-icon(value=":ra ra-daggers")
              mu-th.number
                mu-icon(value=":ra ra-gold-bar")
              mu-th.number
                mu-icon(value=":ra ra-double-team")
              mu-th.number
                mu-icon(value=":ra ra-burst-blob")
              mu-th.number
                mu-icon(value=":ra ra-fire-symbol")

          mu-tbody
            mu-tr(v-for="building, index in user.constructions", :key="index")
              mu-td.title
                mu-chip(:class="building.color") {{ building.name | translate }}
              mu-td.number {{ building.quantity | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ building.quantity * building.goldProduction | minimize }}
                div
                  span.income(class="red") &#9660;
                  span -{{ building.quantity * building.goldMaintenance | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ building.quantity * building.peopleProduction | minimize }}
                div
                  span.income(class="red") &#9660;
                  span -{{ building.quantity * building.peopleMaintenance | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ building.quantity * building.manaProduction | minimize }}
                div
                  span.income(class="red") &#9660;
                  span -{{ building.quantity * building.manaMaintenance | minimize }}
              mu-td.number {{ building.quantity * building.power | minimize }}

            mu-tr(v-for="unit, index in user.troops", :key="index")
              mu-td.title
                mu-chip(:class="unit.color") {{ unit.name | translate }}
              mu-td.number {{ unit.quantity | minimize }}
              mu-td.number
                span.income(class="red") &#9660;
                span -{{ unit.quantity * unit.goldMaintenance | minimize }}
              mu-td.number
                span.income(class="red") &#9660;
                span -{{ unit.quantity * unit.peopleMaintenance | minimize }}
              mu-td.number
                span.income(class="red") &#9660;
                span -{{ unit.quantity * unit.manaMaintenance | minimize }}
              mu-td.number {{ unit.quantity * unit.power | minimize }}

            mu-tr(v-for="hero, index in user.contracts", :key="index")
              mu-td.title
                mu-chip(:class="hero.color") {{ hero.name | translate }}
              mu-td.number {{ hero.level | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ hero.level * hero.goldProduction | percentage }}
                div
                  span.income(class="red") &#9660;
                  span -{{ hero.level * hero.goldMaintenance | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ hero.level * hero.peopleProduction | percentage }}
                div
                  span.income(class="red") &#9660;
                  span -{{ hero.level * hero.peopleMaintenance | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ hero.level * hero.manaProduction | percentage }}
                div
                  span.income(class="red") &#9660;
                  span -{{ hero.level * hero.manaMaintenance | minimize }}
              mu-td.number {{ hero.level * hero.power | minimize }}
            
            mu-tr(v-for="enchantment, index in praises", :key="index")
              mu-td.title
                mu-chip(:class="enchantment.color") {{ enchantment.name | translate }}
              mu-td.number {{ enchantment.magic | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ enchantment.magic * enchantment.goldProduction | percentage }}
                div
                  span.income(class="red") &#9660;
                  span {{ enchantment.magic * enchantment.goldMaintenance | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ enchantment.magic * enchantment.peopleProduction | percentage }}
                div
                  span.income(class="red") &#9660;
                  span {{ enchantment.magic * enchantment.peopleMaintenance | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ enchantment.magic * enchantment.manaProduction | percentage }}
                div
                  span.income(class="red") &#9660;
                  span {{ enchantment.magic * enchantment.manaMaintenance | minimize }}
              mu-td.number {{ enchantment.magic * enchantment.power | minimize }}

            mu-tr(v-for="enchantment, index in curses", :key="index")
              mu-td.title
                mu-chip(:class="enchantment.color") {{ enchantment.name | translate }}
              mu-td.number {{ enchantment.magic | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ enchantment.magic * enchantment.goldProduction | percentage }}
                div
                  span.income(class="red") &#9660;
                  span {{ enchantment.magic * enchantment.goldMaintenance | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ enchantment.magic * enchantment.peopleProduction | percentage }}
                div
                  span.income(class="red") &#9660;
                  span {{ enchantment.magic * enchantment.peopleMaintenance | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ enchantment.magic * enchantment.manaProduction | percentage }}
                div
                  span.income(class="red") &#9660;
                  span {{ enchantment.magic * enchantment.manaMaintenance | minimize }}
              mu-td.number {{ enchantment.magic * enchantment.power | minimize }}

            mu-tr(v-for="blessing, index in blessings", :key="index")
              mu-td.title
                mu-chip(:class="blessing.color") {{ blessing.name | translate }}
              mu-td.number ?
              mu-td.number
                span.income(class="green") &#9650;
                span {{ blessing.goldProduction | percentage }}
              mu-td.number
                span.income(class="green") &#9650;
                span {{ blessing.peopleProduction | percentage }}
              mu-td.number
                span.income(class="green") &#9650;
                span {{ blessing.manaProduction | percentage }}
              mu-td.number {{ blessing.power | minimize }}
            
            mu-tr
              mu-td.title {{ 'lbl_table_total' | translate }}
              mu-td.number =
              mu-td.number
                span.income(:class="user.goldPerTurn >= 0 ? 'green' : 'red'") {{ user.goldPerTurn >= 0 ? '&#9650;' : '&#9660;' }}
                span {{ user.goldPerTurn | minimize }}
              mu-td.number
                span.income(:class="user.peoplePerTurn >= 0 ? 'green' : 'red'") {{ user.peoplePerTurn >= 0 ? '&#9650;' : '&#9660;' }}
                span {{ user.peoplePerTurn | minimize }}
              mu-td.number
                span.income(:class="user.manaPerTurn >= 0 ? 'green' : 'red'") {{ user.manaPerTurn >= 0 ? '&#9650;' : '&#9660;' }}
                span {{ user.manaPerTurn | minimize }}
              mu-td.number {{ user.power | minimize }}
</template>

<script>
  import store from '../vuex/store'
  import { database } from '../services/firebase'
  
  export default {
    created () {
      store.commit('title', 'lbl_title_kingdom')
      this.$bindAsArray('enchantments', database.ref('enchantments'))
      this.$bindAsArray('blessings', database.ref('gods').orderByChild('blessed').equalTo(store.state.uid))
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
  @media only screen and (max-width 479px)
    .kingdom
      .mu-th
      .mu-td
        padding-left 6px
        padding-right 6px
        .mu-chip
          padding 0 6px
      .mu-td
        font-size 10px
</style>
