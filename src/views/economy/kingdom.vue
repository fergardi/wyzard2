<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.animated.fadeInUp
        mu-card-media
          img(v-lazy-load="picture('miscellaneous', 'kingdom')", :src="picture('miscellaneous', 'loading')", :alt="translate('lbl_label_summary')")
          mu-circular-progress(v-if="busy", :size="100", color="#ad835a")
          .card-info
            .card-text {{ 'lbl_label_summary' | translate }}

        mu-table.kingdom(:showCheckbox="false", :selectable="false")
          mu-thead
            mu-tr(v-if="user.constructions")
              mu-th.title(v-tooltip="translate('ttp_kingdom_name')")
                span {{ 'lbl_table_infrastructure' | translate }}
              mu-th.number(v-tooltip="translate('ttp_kingdom_quantity')")
                i.ra.ra-lg.ra-help
              mu-th.number(v-tooltip="translate('ttp_kingdom_gold')")
                i.ra.ra-lg.ra-gold-bar
              mu-th.number(v-tooltip="translate('ttp_kingdom_people')")
                i.ra.ra-lg.ra-double-team
              mu-th.number(v-tooltip="translate('ttp_kingdom_mana')")
                i.ra.ra-lg.ra-burst-blob
              mu-th.number(v-tooltip="translate('ttp_kingdom_terrain')")
                i.ra.ra-lg.ra-tower
              mu-th.number(v-tooltip="translate('ttp_kingdom_power')")
                i.ra.ra-lg.ra-fire-symbol

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
              mu-td.number
                span ?
              mu-td.number {{ building.quantity * building.power | minimize }}
            
            mu-tr(v-if="user.troops")
              mu-th.title(v-tooltip="translate('ttp_kingdom_name')")
                span {{ 'lbl_table_troops' | translate }}
              mu-th.number(v-tooltip="translate('ttp_kingdom_quantity')")
                i.ra.ra-lg.ra-help
              mu-th.number(v-tooltip="translate('ttp_kingdom_gold')")
                i.ra.ra-lg.ra-gold-bar
              mu-th.number(v-tooltip="translate('ttp_kingdom_people')")
                i.ra.ra-lg.ra-double-team
              mu-th.number(v-tooltip="translate('ttp_kingdom_mana')")
                i.ra.ra-lg.ra-burst-blob
              mu-th.number(v-tooltip="translate('ttp_kingdom_terrain')")
                i.ra.ra-lg.ra-tower
              mu-th.number(v-tooltip="translate('ttp_kingdom_power')")
                i.ra.ra-lg.ra-fire-symbol

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
              mu-td.number
                span ?
              mu-td.number {{ unit.quantity * unit.power | minimize }}

            mu-tr(v-if="user.contracts")
              mu-th.title(v-tooltip="translate('ttp_kingdom_name')")
                span {{ 'lbl_table_contracts' | translate }}
              mu-th.number(v-tooltip="translate('ttp_kingdom_quantity')")
                i.ra.ra-lg.ra-help
              mu-th.number(v-tooltip="translate('ttp_kingdom_gold')")
                i.ra.ra-lg.ra-gold-bar
              mu-th.number(v-tooltip="translate('ttp_kingdom_people')")
                i.ra.ra-lg.ra-double-team
              mu-th.number(v-tooltip="translate('ttp_kingdom_mana')")
                i.ra.ra-lg.ra-burst-blob
              mu-th.number(v-tooltip="translate('ttp_kingdom_terrain')")
                i.ra.ra-lg.ra-tower
              mu-th.number(v-tooltip="translate('ttp_kingdom_power')")
                i.ra.ra-lg.ra-fire-symbol

            mu-tr(v-for="hero, index in user.contracts", :key="index")
              mu-td.title
                mu-chip(:class="hero.color") {{ hero.name | translate }}
              mu-td.number {{ hero.level | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ hero.level * hero.goldProduction | minimize }}
                div
                  span.income(class="red") &#9660;
                  span -{{ hero.level * hero.goldMaintenance | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ hero.level * hero.peopleProduction | minimize }}
                div
                  span.income(class="red") &#9660;
                  span -{{ hero.level * hero.peopleMaintenance | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ hero.level * hero.manaProduction | minimize }}
                div
                  span.income(class="red") &#9660;
                  span -{{ hero.level * hero.manaMaintenance | minimize }}
              mu-td.number
                span ?
              mu-td.number {{ hero.level * hero.power | minimize }}

            mu-tr(v-if="praises.length")
              mu-th.title(v-tooltip="translate('ttp_kingdom_name')")
                span {{ 'lbl_table_praises' | translate }}
              mu-th.number(v-tooltip="translate('ttp_kingdom_quantity')")
                i.ra.ra-lg.ra-help
              mu-th.number(v-tooltip="translate('ttp_kingdom_gold')")
                i.ra.ra-lg.ra-gold-bar
              mu-th.number(v-tooltip="translate('ttp_kingdom_people')")
                i.ra.ra-lg.ra-double-team
              mu-th.number(v-tooltip="translate('ttp_kingdom_mana')")
                i.ra.ra-lg.ra-burst-blob
              mu-th.number(v-tooltip="translate('ttp_kingdom_terrain')")
                i.ra.ra-lg.ra-tower
              mu-th.number(v-tooltip="translate('ttp_kingdom_power')")
                i.ra.ra-lg.ra-fire-symbol
            
            mu-tr(v-for="enchantment, index in praises", :key="index")
              mu-td.title
                mu-chip(:class="enchantment.color") {{ enchantment.name | translate }}
              mu-td.number {{ enchantment.magic | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ enchantment.magic * enchantment.goldProduction | minimize }}
                div
                  span.income(class="red") &#9660;
                  span -{{ enchantment.magic * enchantment.goldMaintenance | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ enchantment.magic * enchantment.peopleProduction | minimize }}
                div
                  span.income(class="red") &#9660;
                  span -{{ enchantment.magic * enchantment.peopleMaintenance | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ enchantment.magic * enchantment.manaProduction | minimize }}
                div
                  span.income(class="red") &#9660;
                  span -{{ enchantment.magic * enchantment.manaMaintenance | minimize }}
              mu-td.number
                div
                  span.income(class="green") &#9650;
                  span {{ enchantment.magic * enchantment.terrainProduction | minimize }}
              mu-td.number {{ enchantment.magic * enchantment.power | minimize }}

            mu-tr(v-if="curses.length")
              mu-th.title(v-tooltip="translate('ttp_kingdom_name')")
                span {{ 'lbl_table_curses' | translate }}
              mu-th.number(v-tooltip="translate('ttp_kingdom_quantity')")
                i.ra.ra-lg.ra-help
              mu-th.number(v-tooltip="translate('ttp_kingdom_gold')")
                i.ra.ra-lg.ra-gold-bar
              mu-th.number(v-tooltip="translate('ttp_kingdom_people')")
                i.ra.ra-lg.ra-double-team
              mu-th.number(v-tooltip="translate('ttp_kingdom_mana')")
                i.ra.ra-lg.ra-burst-blob
              mu-th.number(v-tooltip="translate('ttp_kingdom_terrain')")
                i.ra.ra-lg.ra-tower
              mu-th.number(v-tooltip="translate('ttp_kingdom_power')")
                i.ra.ra-lg.ra-fire-symbol

            mu-tr(v-for="enchantment, index in curses", :key="index")
              mu-td.title
                mu-chip(:class="enchantment.color") {{ enchantment.name | translate }}
              mu-td.number {{ enchantment.magic | minimize }}
              mu-td.number
                div
                  span.income(class="red") &#9660;
                  span {{ enchantment.magic * enchantment.goldProduction | minimize }}
              mu-td.number
                div
                  span.income(class="red") &#9660;
                  span {{ enchantment.magic * enchantment.peopleProduction | minimize }}
              mu-td.number
                div
                  span.income(class="red") &#9660;
                  span {{ enchantment.magic * enchantment.manaProduction | minimize }}
              mu-td.number
                div
                  span.income(class="red") &#9660;
                  span {{ enchantment.magic * enchantment.terrainProduction | minimize }}
              mu-td.number {{ enchantment.magic * enchantment.power | minimize }}

            mu-tr(v-if="torments.length")
              mu-th.title(v-tooltip="translate('ttp_kingdom_name')")
                span {{ 'lbl_table_torments' | translate }}
              mu-th.number(v-tooltip="translate('ttp_kingdom_quantity')")
                i.ra.ra-lg.ra-help
              mu-th.number(v-tooltip="translate('ttp_kingdom_gold')")
                i.ra.ra-lg.ra-gold-bar
              mu-th.number(v-tooltip="translate('ttp_kingdom_people')")
                i.ra.ra-lg.ra-double-team
              mu-th.number(v-tooltip="translate('ttp_kingdom_mana')")
                i.ra.ra-lg.ra-burst-blob
              mu-th.number(v-tooltip="translate('ttp_kingdom_terrain')")
                i.ra.ra-lg.ra-tower
              mu-th.number(v-tooltip="translate('ttp_kingdom_power')")
                i.ra.ra-lg.ra-fire-symbol
            
            mu-tr(v-for="enchantment, index in torments", :key="index")
              mu-td.title
                mu-chip(:class="enchantment.color") {{ enchantment.name | translate }}
              mu-td.number {{ enchantment.magic | minimize }}
              mu-td.number
                div
                  span.income(class="red") &#9660;
                  span -{{ enchantment.magic * enchantment.goldMaintenance | minimize }}
              mu-td.number
                div
                  span.income(class="red") &#9660;
                  span -{{ enchantment.magic * enchantment.peopleMaintenance | minimize }}
              mu-td.number
                div
                  span.income(class="red") &#9660;
                  span -{{ enchantment.magic * enchantment.manaMaintenance | minimize }}
              mu-td.number ?
              mu-td.number 0

            mu-tr(v-if="user.relics")
              mu-th.title(v-tooltip="translate('ttp_kingdom_name')")
                span {{ 'lbl_table_relics' | translate }}
              mu-th.number(v-tooltip="translate('ttp_kingdom_quantity')")
                i.ra.ra-lg.ra-help
              mu-th.number(v-tooltip="translate('ttp_kingdom_gold')")
                i.ra.ra-lg.ra-gold-bar
              mu-th.number(v-tooltip="translate('ttp_kingdom_people')")
                i.ra.ra-lg.ra-double-team
              mu-th.number(v-tooltip="translate('ttp_kingdom_mana')")
                i.ra.ra-lg.ra-burst-blob
              mu-th.number(v-tooltip="translate('ttp_kingdom_terrain')")
                i.ra.ra-lg.ra-tower
              mu-th.number(v-tooltip="translate('ttp_kingdom_power')")
                i.ra.ra-lg.ra-fire-symbol

            mu-tr(v-for="relic, index in user.relics", :key="index")
              mu-td.title
                mu-chip(:class="relic.color") {{ relic.name | translate }}
              mu-td.number {{ relic.quantity | minimize }}
              mu-td.number
                span.income(class="green") &#9650;
                span ?
              mu-td.number
                span.income(class="green") &#9650;
                span ?
              mu-td.number
                span.income(class="green") &#9650;
                span ?
              mu-td.number
                span ?
              mu-td.number {{ relic.power * relic.quantity | minimize }}

            mu-tr(v-if="blessings.length")
              mu-th.title(v-tooltip="translate('ttp_kingdom_name')")
                span {{ 'lbl_table_blessings' | translate }}
              mu-th.number(v-tooltip="translate('ttp_kingdom_quantity')")
                i.ra.ra-lg.ra-help
              mu-th.number(v-tooltip="translate('ttp_kingdom_gold')")
                i.ra.ra-lg.ra-gold-bar
              mu-th.number(v-tooltip="translate('ttp_kingdom_people')")
                i.ra.ra-lg.ra-double-team
              mu-th.number(v-tooltip="translate('ttp_kingdom_mana')")
                i.ra.ra-lg.ra-burst-blob
              mu-th.number(v-tooltip="translate('ttp_kingdom_terrain')")
                i.ra.ra-lg.ra-tower
              mu-th.number(v-tooltip="translate('ttp_kingdom_power')")
                i.ra.ra-lg.ra-fire-symbol

            mu-tr(v-for="blessing, index in blessings", :key="index")
              mu-td.title
                mu-chip(:class="blessing.color") {{ blessing.name | translate }}
              mu-td.number ?
              mu-td.number
                span.income(class="green") &#9650;
                span {{ blessing.goldProduction | minimize }}
              mu-td.number
                span.income(class="green") &#9650;
                span {{ blessing.peopleProduction | minimize }}
              mu-td.number
                span.income(class="green") &#9650;
                span {{ blessing.manaProduction | minimize }}
              mu-td.number
                span ?
              mu-td.number {{ blessing.power | minimize }}

            mu-tr
              mu-th.title(v-tooltip="translate('ttp_kingdom_name')")
                span {{ 'lbl_table_total' | translate }}
              mu-th.number(v-tooltip="translate('ttp_kingdom_quantity')")
                i.ra.ra-lg.ra-help
              mu-th.number(v-tooltip="translate('ttp_kingdom_gold')")
                i.ra.ra-lg.ra-gold-bar
              mu-th.number(v-tooltip="translate('ttp_kingdom_people')")
                i.ra.ra-lg.ra-double-team
              mu-th.number(v-tooltip="translate('ttp_kingdom_mana')")
                i.ra.ra-lg.ra-burst-blob
              mu-th.number(v-tooltip="translate('ttp_kingdom_terrain')")
                i.ra.ra-lg.ra-tower
              mu-th.number(v-tooltip="translate('ttp_kingdom_power')")
                i.ra.ra-lg.ra-fire-symbol
            
            mu-tr
              mu-td.title {{ 'lbl_table_turn' | translate }}
              mu-td.number ?
              mu-td.number
                span.income(:class="user.goldPerTurn >= 0 ? 'green' : 'red'") {{ user.goldPerTurn >= 0 ? '&#9650;' : '&#9660;' }}
                span {{ user.goldPerTurn | minimize }}
              mu-td.number
                span.income(:class="user.peoplePerTurn >= 0 ? 'green' : 'red'") {{ user.peoplePerTurn >= 0 ? '&#9650;' : '&#9660;' }}
                span {{ user.peoplePerTurn | minimize }}
              mu-td.number
                span.income(:class="user.manaPerTurn >= 0 ? 'green' : 'red'") {{ user.manaPerTurn >= 0 ? '&#9650;' : '&#9660;' }}
                span {{ user.manaPerTurn | minimize }}
              mu-td.number
                span.income(:class="user.terrainPerTurn >= 0 ? 'green' : 'red'") {{ user.terrainPerTurn >= 0 ? '&#9650;' : '&#9660;' }}
                span {{ user.terrainPerTurn | minimize }}
              mu-td.number {{ user.power | minimize }}
</template>

<script>
  import store from '@/vuex/store'
  import { database } from '@/services/firebase'
  import { updateGeneralStatus } from '@/services/api'
  
  export default {
    async created () {
      store.commit('title', 'lbl_title_kingdom')
      store.commit('help', 'txt_help_kingdom')
      await this.$bindAsArray('enchantments', database.ref('enchantments'))
      await this.$bindAsArray('blessings', database.ref('gods').orderByChild('blessed').equalTo(store.state.uid))
      await updateGeneralStatus(store.state.uid)
    },
    computed: {
      user () {
        return store.state.user || {}
      },
      praises () {
        return this.enchantments.filter(e => e.support && e.target === store.state.uid && e.source === store.state.uid)
      },
      curses () {
        return this.enchantments.filter(e => !e.support && e.target === store.state.uid && e.source !== store.state.uid)
      },
      torments () {
        return this.enchantments.filter(e => !e.support && e.target !== store.state.uid && e.source === store.state.uid)
      },
      busy () {
        return this.user['.key'] === undefined
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .mu-td.title
  .mu-th.title
    text-align left
    min-width 20%
    width 20%
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
