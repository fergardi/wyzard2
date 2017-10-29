<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.messages.animated.fadeInUp
        mu-card-media
          img.lazy(v-lazy-load="'https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/confirm.jpg?alt=media'", src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/messages.jpg?alt=media", :alt="translate('lbl_label_messages')")
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
            img(src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/message.jpg?alt=media")
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
              .spell(v-for="spell, index in selected.battle.spells", :key="index")
                .info.title {{ 'lbl_battle_spells' | translate }}
                .info(v-if="spell.attacker", :class="spell.attacker.left ? 'left' : 'right'")
                  mu-chip(v-if="spell.attacker.level", :class="spell.attacker.color", v-tooltip="translate('ttp_spell_level')")
                    i.ra.ra-trophy
                    span {{ spell.attacker.level | numeric }}
                  mu-chip.ellipsis(v-if="spell.attacker.spell", :class="spell.attacker.color", v-tooltip="translate('ttp_spell_name')")
                    span {{ spell.attacker.spell | translate }}
                  mu-chip(v-if="spell.attacker.casualties", :class="spell.attacker.color", v-tooltip="translate('ttp_message_casualties')")
                    i.ra.ra-death-skull
                    span {{ spell.attacker.casualties | translate }}
                .info(v-if="spell.defender", :class="spell.defender.left ? 'left' : 'right'")
                  mu-chip(v-if="spell.defender.level", :class="spell.defender.color", v-tooltip="translate('ttp_spell_level')")
                    i.ra.ra-trophy
                    span {{ spell.defender.level | numeric }}
                  mu-chip.ellipsis(v-if="spell.defender.spell", :class="spell.defender.color", v-tooltip="translate('ttp_spell_name')")
                    span {{ spell.defender.spell | translate }}
                  mu-chip(v-if="spell.defender.casualties", :class="spell.defender.color", v-tooltip="translate('ttp_message_casualties')")
                    i.ra.ra-death-skull
                    span {{ spell.defender.casualties | translate }}
              .artifact(v-for="artifact, index in selected.battle.artifacts", :key="index")
                .info.title {{ 'lbl_battle_artifacts' | translate }}
                .info(v-if="artifact.attacker", :class="artifact.attacker.left ? 'left' : 'right'")
                  mu-chip.ellipsis(v-if="artifact.attacker.artifact", :class="artifact.attacker.color", v-tooltip="translate('ttp_artifact_name')")
                    span {{ artifact.attacker.artifact | translate }}
                  mu-chip(v-if="artifact.attacker.casualties", :class="artifact.attacker.color", v-tooltip="translate('ttp_message_casualties')")
                    i.ra.ra-death-skull
                    span {{ artifact.attacker.casualties | translate }}
                .info(v-if="artifact.defender", :class="artifact.defender.left ? 'left' : 'right'")
                  mu-chip.ellipsis(v-if="artifact.defender.artifact", :class="artifact.defender.color", v-tooltip="translate('ttp_artifact_name')")
                    span {{ artifact.defender.artifact | translate }}
                  mu-chip(v-if="artifact.defender.casualties", :class="artifact.defender.color", v-tooltip="translate('ttp_message_casualties')")
                    i.ra.ra-death-skull
                    span {{ artifact.defender.casualties | translate }}
              .log(v-for="log, index in selected.battle.logs", :key="index")
                .info.title {{ 'lbl_battle_round' | translate }}  {{ index + 1 | numeric }}
                .info(v-if="log.attacker", :class="log.attacker.left ? 'left' : 'right'")
                  mu-chip(v-if="log.attacker.quantity", :class="log.attacker.color", v-tooltip="translate('ttp_unit_quantity')")
                    i.ra.ra-crossed-axes
                    span {{ log.attacker.quantity | numeric }}
                  mu-chip.ellipsis(v-if="log.attacker.unit", :class="log.attacker.color", v-tooltip="translate('ttp_unit_name')")
                    span {{ log.attacker.unit | translate }}
                  mu-chip(v-if="log.attacker.casualties", :class="log.attacker.color", v-tooltip="translate('ttp_message_casualties')")
                    i.ra.ra-death-skull
                    span {{ log.attacker.casualties | translate }}
                .info(v-if="log.defender", :class="log.defender.left ? 'left' : 'right'")
                  mu-chip(v-if="log.defender.quantity", :class="log.defender.color", v-tooltip="translate('ttp_unit_quantity')")
                    i.ra.ra-crossed-axes
                    span {{ log.defender.quantity | numeric }}
                  mu-chip.ellipsis(v-if="log.defender.unit", :class="log.defender.color", v-tooltip="translate('ttp_unit_name')")
                    span {{ log.defender.unit | translate }}
                  mu-chip(v-if="log.defender.casualties", :class="log.defender.color", v-tooltip="translate('ttp_message_casualties')")
                    i.ra.ra-death-skull
                    span {{ log.defender.casualties | translate }}
              .log
                .info.title {{ 'lbl_battle_finish' | translate }}
              
            mu-card-text.attachments
              .attachment(v-if="selected.gold", v-tooltip="translate('ttp_resource_gold')")
                mu-chip
                  i.ra.ra-gold-bar
                  span {{ selected.gold | numeric }}
              .attachment(v-if="selected.people", v-tooltip="translate('ttp_resource_people')")
                mu-chip
                  i.ra.ra-double-team
                  span {{ selected.people | numeric }}
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

          mu-card-actions
            mu-raised-button(primary, @click="remove") {{ 'lbl_button_remove' | translate }}
            mu-raised-button(primary, @click="close") {{ 'lbl_button_close' | translate }}
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
    data () {
      return {
        size: 10,
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
      }
    }
  }
</script>

<style lang="stylus">
  @import '../css/colors.styl'
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
</style>
