<template lang="pug">
  mu-row

    mu-col(width="100", tablet="100", desktop="100")
      mu-card.messages.animated.fadeInUp
        mu-card-media
          .card-image(v-once)
            img(v-lazy-load="picture('miscellaneous', 'messages')", :src="picture('miscellaneous', 'loading')", :alt="translate('lbl_label_messages')")
          .card-spinner
            mu-circular-progress(v-if="busy", :size="100", color="#ad835a")
          .card-extra
            .card-number(v-tooltip="translate('ttp_message_quantity')")
              i.ra.ra-quill-ink
              span {{ messages.length | minimize }}
          .card-info
            .card-text {{ 'lbl_label_messages' | translate }}

        mu-table(:showCheckbox="false", :enableSelectAll="false", :multiSelectable="false", @rowClick="select")
          mu-thead
            mu-tr
              mu-th(v-tooltip="translate('ttp_message_time')")
                .ra.ra-lg.ra-stopwatch
              mu-th(v-tooltip="translate('ttp_message_name')")
                .ra.ra-lg.ra-player
              mu-th(v-tooltip="translate('ttp_message_subject')")
                .ra.ra-lg.ra-help
          mu-tbody
            template(v-if="paginated.length")
              mu-tr(v-for="message, index in paginated", :key="index")
                mu-td {{ message.timestamp | timesince }}
                mu-td
                  mu-chip(:class="message.color") {{ message.name | translate }}
                mu-td {{ message.subject | translate }}
            mu-tr(v-else)
              mu-td -
              mu-td -
              mu-td -
          mu-tfoot(slot="footer")
            mu-pagination(:total="total", :current="current", @pageChange="move", :pageSize="size")

      mu-dialog(:open="dialog", @close="close")
        mu-card.dialog
          mu-card-media
            .card-image(v-once)
              img(v-lazy-load="picture('miscellaneous', 'message')", :src="picture('miscellaneous', 'loading')", :alt="translate('lbl_label_message')")
            .card-extra
              .card-text(:class="selected.color", v-tooltip="translate('ttp_message_name')")
                i.ra.ra-player
                span {{ selected.name | translate }}
              .card-number(v-tooltip="translate('ttp_message_time')")
                i.ra.ra-stopwatch
                span {{ selected.timestamp | timesince }}
            .card-info
              .card-text(v-tooltip="translate('ttp_message_subject')")
                i.ra.ra-quill-ink
                span {{ selected.subject | translate }}
                
          .scroll
            mu-card-text
              p {{ selected.text | translate }}

            mu-card-text(v-if="selected.battle")
              .log
                .info.heading
                  span {{ 'lbl_battle_attacker' | translate }}
                  span {{ 'lbl_battle_defender' | translate }}

              .log(v-if="selected.battle.gods")
                .info.title {{ 'lbl_battle_gods' | translate }}
                .gods(v-for="god, index in selected.battle.gods", :key="index")
                  .info(:class="god.left ? 'left' : 'right'")
                    mu-chip.ellipsis(:class="god.color", v-tooltip="translate('ttp_god_name')")
                      span {{ god.name | translate }}
                    
              .log(v-if="selected.battle.heroes")
                .info.title {{ 'lbl_battle_heroes' | translate }}
                .heroes(v-for="hero, index in selected.battle.heroes", :key="index")
                  .info(:class="hero.left ? 'left' : 'right'")
                    mu-chip.ellipsis(:class="hero.color", v-tooltip="translate('ttp_hero_name')")
                      span {{ hero.name | translate }}
                    mu-chip(:class="hero.color", v-tooltip="translate('ttp_hero_level')")
                      i.ra.ra-trophy
                      span {{ hero.level | translate }}
                    
              .log(v-if="selected.battle.spells")
                .info.title {{ 'lbl_battle_spells' | translate }}
                .spell(v-for="spell, index in selected.battle.spells", :key="index")
                  .info(:class="spell.left ? 'left' : 'right'")
                    mu-chip(:class="spell.color", v-tooltip="translate('ttp_spell_magic')")
                      i.ra.ra-trophy
                      span {{ spell.level | numeric }}
                    mu-chip.ellipsis(:class="spell.color", v-tooltip="translate('ttp_spell_name')")
                      span {{ spell.name | translate }}

              .log(v-if="selected.battle.artifacts")
                .info.title {{ 'lbl_battle_artifacts' | translate }}
                .artifact(v-for="artifact, index in selected.battle.artifacts", :key="index")
                  .info(:class="artifact.left ? 'left' : 'right'")
                    mu-chip.ellipsis(:class="artifact.color", v-tooltip="translate('ttp_artifact_name')")
                      span {{ artifact.name | translate }}

              .log(v-for="log, index in selected.battle.logs", :key="index")
                .info.title {{ 'lbl_battle_round' | translate }}  {{ index + 1 | numeric }}
                .info(v-if="log.attacker", :class="log.attacker.left ? 'left' : 'right'")
                  mu-chip(:class="log.attacker.color", v-tooltip="translate('ttp_unit_quantity')")
                    i.ra.ra-crossed-axes
                    span {{ log.attacker.quantity | numeric }}
                  mu-chip.ellipsis(:class="[log.attacker.color, {'dead': log.attacker.quantity <= 0}]", v-tooltip="translate('ttp_unit_name')")
                    span {{ log.attacker.name | translate }}
                  mu-chip(v-tooltip="translate('ttp_message_casualties')")
                    i.ra.ra-death-skull
                    span {{ log.attacker.casualties | translate }}
                .info(v-if="log.defender", :class="log.defender.left ? 'left' : 'right'")
                  mu-chip(:class="log.defender.color", v-tooltip="translate('ttp_unit_quantity')")
                    i.ra.ra-crossed-axes
                    span {{ log.defender.quantity | numeric }}
                  mu-chip.ellipsis(:class="[log.defender.color, {'dead': log.defender.quantity <= 0}]", v-tooltip="translate('ttp_unit_name')")
                    span {{ log.defender.name | translate }}
                  mu-chip(v-tooltip="translate('ttp_message_casualties')")
                    i.ra.ra-death-skull
                    span {{ log.defender.casualties | translate }}

              .log
                .info.title {{ 'lbl_battle_finish' | translate }}

            mu-card-text(v-if="selected.spionage")
              .log
                .info.title {{ 'lbl_spionage_buildings' | translate }}
                .building(v-for="building, index in selected.spionage.buildings", :key="index")
                  mu-chip(v-tooltip="translate('ttp_building_quantity')")
                    i.ra.ra-tower
                    span {{ building.quantity | numeric }}
                  mu-chip.ellipsis(v-tooltip="translate('ttp_building_name')")
                    span {{ building.name | translate }}

              .log
                .info.title {{ 'lbl_spionage_spells' | translate }}
                .spell(v-for="spell, index in selected.spionage.spells", :key="index")
                  mu-chip(:class="spell.color", v-tooltip="translate('ttp_spell_magic')")
                    i.ra.ra-trophy
                    span {{ spell.magic | numeric }}
                  mu-chip.ellipsis(:class="spell.color", v-tooltip="translate('ttp_spell_name')")
                    span {{ spell.name | translate }}

              .log
                .info.title {{ 'lbl_spionage_artifacts' | translate }}
                .artifact(v-for="artifact, index in selected.spionage.artifacts", :key="index")
                  mu-chip(:class="artifact.color", v-tooltip="translate('ttp_artifact_quantity')")
                    i.ra.ra-crystals
                    span {{ artifact.quantity | numeric }}
                  mu-chip.ellipsis(:class="artifact.color", v-tooltip="translate('ttp_artifact_name')")
                    span {{ artifact.name | translate }}
                
              .log
                .info.title {{ 'lbl_spionage_gods' | translate }}
                .god(v-for="god, index in selected.spionage.gods", :key="index")
                  mu-chip.ellipsis(:class="god.color", v-tooltip="translate('ttp_god_name')")
                    span {{ god.name | translate }}

              .log
                .info.title {{ 'lbl_spionage_enchantments' | translate }}
                .enchantment(v-for="enchantment, index in selected.spionage.enchantments", :key="index")
                  mu-chip(:class="enchantment.color", v-tooltip="translate('ttp_spell_magic')")
                    i.ra.ra-trophy
                    span {{ enchantment.magic | numeric }}
                  mu-chip.ellipsis(:class="enchantment.color", v-tooltip="translate('ttp_spell_name')")
                    span {{ enchantment.name | translate }}

              .log
                .info.title {{ 'lbl_spionage_units' | translate }}
                .unit(v-for="unit, index in selected.spionage.units", :key="index")
                  mu-chip(:class="unit.color", v-tooltip="translate('ttp_unit_quantity')")
                    i.ra.ra-crossed-axes
                    span {{ unit.quantity | numeric }}
                  mu-chip.ellipsis(:class="unit.color", v-tooltip="translate('ttp_unit_name')")
                    span {{ unit.name | translate }}

              .log
                .info.title {{ 'lbl_spionage_heroes' | translate }}
                .hero(v-for="hero, index in selected.spionage.heroes", :key="index")
                  mu-chip(:class="hero.color", v-tooltip="translate('ttp_hero_level')")
                    i.ra.ra-trophy
                    span {{ hero.level | numeric }}
                  mu-chip.ellipsis(:class="hero.color", v-tooltip="translate('ttp_hero_name')")
                    span {{ hero.name | translate }}

              .log
                .info.title {{ 'lbl_spionage_resources' | translate }}
                .resource
                  mu-chip(v-tooltip="translate('ttp_resource_gold')")
                    i.ra.ra-gold-bar
                    span {{ selected.spionage.gold | numeric }}
                  mu-chip(v-tooltip="translate('ttp_resource_people')")
                    i.ra.ra-double-team
                    span {{ selected.spionage.people | numeric }}
                  mu-chip(v-tooltip="translate('ttp_resource_mana')")
                    i.ra.ra-burst-blob
                    span {{ selected.spionage.mana | numeric }}
                  mu-chip(v-tooltip="translate('ttp_resource_magic')")
                    i.ra.ra-trophy
                    span {{ selected.spionage.magic | numeric }}
              
            mu-card-text.attachments(v-if="attachment")
              .attachment(v-if="selected.gold", v-tooltip="translate('ttp_resource_gold')")
                mu-chip
                  i.ra.ra-gold-bar
                  span {{ selected.gold | numeric }}
              .attachment(v-if="selected.people", v-tooltip="translate('ttp_resource_people')")
                mu-chip
                  i.ra.ra-double-team
                  span {{ selected.people | numeric }}
              .attachment(v-if="selected.mana", v-tooltip="translate('ttp_resource_mana')")
                mu-chip
                  i.ra.ra-burst-blob
                  span {{ selected.mana | numeric }}
              .attachment(v-if="selected.kills", v-tooltip="translate('ttp_message_kills')")
                mu-chip
                  i.ra.ra-decapitation
                  span {{ selected.kills | numeric }}
              .attachment(v-if="selected.conquered", v-tooltip="translate('ttp_message_conquered')")
                mu-chip
                  i.ra.ra-tower
                  span {{ selected.conquered | numeric }}
              .attachment(v-if="selected.sieged", v-tooltip="translate('ttp_message_sieged')")
                mu-chip
                  i.ra.ra-demolish
                  span {{ selected.sieged | numeric }}
              .attachment(v-if="selected.artifact", v-tooltip="translate('ttp_message_artifact')")
                mu-chip(:class="selected.artifact.color")
                  i.ra.ra-crystals
                  span {{ selected.artifact.name | translate }}
              .attachment(v-if="selected.hero", v-tooltip="translate('ttp_message_hero')")
                mu-chip(:class="selected.hero.color")
                  i.ra.ra-trophy
                  span {{ selected.hero.name | translate }}
              .attachment(v-if="selected.god", v-tooltip="translate('ttp_message_god')")
                mu-chip(:class="selected.god.color")
                  i.ra.ra-bleeding-eye
                  span {{ selected.god.name | translate }}
              .attachment(v-if="selected.spell", v-tooltip="translate('ttp_message_spell')")
                mu-chip(:class="selected.spell.color")
                  i.ra.ra-fire-ring
                  span {{ selected.spell.name | translate }}

          mu-card-actions
            mu-raised-button(primary, @click="remove") {{ 'lbl_button_remove' | translate }}
            mu-raised-button(primary, @click="close") {{ 'lbl_button_close' | translate }}
</template>

<script>
  import { database } from '@/services/firebase'
  import store from '@/vuex/store'
  
  export default {
    data () {
      return {
        size: 10,
        current: 1,
        dialog: false,
        selected: {}
      }
    },
    async created () {
      store.commit('title', 'lbl_title_messages')
      store.commit('help', 'txt_help_messages')
      await this.$bindAsArray('messages', database.ref('users').child(store.state.uid).child('messages').orderByChild('timestamp'))
    },
    methods: {
      move (page) {
        this.current = page
      },
      select (index) {
        if (index !== null && this.messages[index] !== undefined) {
          this.selected = this.messages[index]
          this.dialog = true
        }
      },
      async remove () {
        await database.ref('users').child(store.state.uid).child('messages').child(this.selected['.key']).remove()
        store.commit('success', 'lbl_toast_message_ok')
        this.close()
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
      },
      attachment () {
        return this.selected && (this.selected.gold || this.selected.people || this.selected.mana || this.selected.kills || this.selected.conquered || this.selected.sieged || this.selected.artifact || this.selected.hero || this.selected.god || this.selected.spell)
      },
      busy () {
        return !this.messages || this.messages.length === undefined || this.messages.length === null
      },
      spionage () {
        return this.selected && this.selected.spionage
      }
    }
  }
</script>


<style lang="stylus"> // not scoped due to mu-dialog being created outside this template
  @import '../../assets/css/colors.styl'
  .mu-dialog
    .scroll
      max-height 40vh
      overflow-y auto
      .attachments
        display flex
        justify-content center
        align-items center
      .log
      .artifact
      .god
      .hero
      .building
      .spell
      .attachment
        .mu-chip
          padding 2px 5px
          i
            margin-right 3px
          &.ellipsis
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
          &.dead
            text-decoration line-through
        .info
          margin 5px
          display flex
          align-items center
          justify-content center
          &.left
          &.right
            max-width 90%
            width 90%
            min-width 90%
          &.left
            justify-content flex-start
          &.right
            justify-content flex-end
            margin-left 10%
            .mu-chip
              justify-content flex-end
          &.title
            overflow hidden
            text-align center
            font-weight bold
            &:before
            &:after
              background-color $gold
              content ""
              display inline-block
              height 1px
              position relative
              vertical-align middle
              width 50%
            &:before
              right 0.5em
              margin-left -50%
            &:after
              left 0.5em
              margin-right -50%
          &.heading
            display flex
            justify-content space-between
            align-items center
</style>
