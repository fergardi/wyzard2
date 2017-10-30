<template lang="pug">
  mu-row
    mu-col(width="100", tablet="66", desktop="50")
      mu-card.defense.animated.fadeInUp
        form(@submit.stop.prevent="confirm('save')")
          mu-card-media
            img(src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/defense.jpg?alt=media", :alt="translate('lbl_label_defense')")
            .card-info
              .card-text {{ 'lbl_label_defense' | translate }}
          mu-card-text
            p {{ 'lbl_label_protection' | translate }}

          mu-card-text
            mu-select-field(v-model="defense.first", :label="translate('lbl_label_army_first')", :fullWidth="true")
              mu-menu-item(v-for="troop, index in first", :key="index", :value="troop['.key']", :title="translate(troop.name)")
          
            mu-select-field(v-model="defense.second", :label="translate('lbl_label_army_second')", :fullWidth="true", :disabled="!canSecond")
              mu-menu-item(v-for="troop, index in second", :key="index", :value="troop['.key']", :title="translate(troop.name)")
          
            mu-select-field(v-model="defense.third", :label="translate('lbl_label_army_third')", :fullWidth="true", :disabled="!canThird")
              mu-menu-item(v-for="troop, index in third", :key="index", :value="troop['.key']", :title="translate(troop.name)")
          
            mu-select-field(v-model="defense.fourth", :label="translate('lbl_label_army_fourth')", :fullWidth="true", :disabled="!canFourth")
              mu-menu-item(v-for="troop, index in fourth", :key="index", :value="troop['.key']", :title="translate(troop.name)")
          
            mu-select-field(v-model="defense.fifth", :label="translate('lbl_label_army_fifth')", :fullWidth="true", :disabled="!canFifth")
              mu-menu-item(v-for="troop, index in fifth", :key="index", :value="troop['.key']", :title="translate(troop.name)")

            mu-select-field(v-model="defense.spell", :label="translate('lbl_label_spell')", :fullWidth="true", :maxHeight="300")
              mu-menu-item(v-for="spell, index in book", :key="index", :value="spell['.key']", :title="translate(spell.name)")

            mu-select-field(v-model="defense.artifact", :label="translate('lbl_label_artifact')", :fullWidth="true", :maxHeight="300")
              mu-menu-item(v-for="artifact, index in relics", :key="index", :value="artifact['.key']", :title="translate(artifact.name)")

          mu-card-actions
            mu-raised-button(primary, type="reset", @click="restore") {{ 'lbl_button_restore' | translate }}
            mu-raised-button(primary, type="submit") {{ 'lbl_button_save' | translate }}

    confirm-dialog(:dialog="dialog", :busy="busy", @close="close", @accept="accept") 
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  import confirm from '../components/confirm-dialog'
  
  export default {
    components: {
      'confirm-dialog': confirm
    },
    data () {
      return {
        busy: false,
        type: null,
        dialog: false
      }
    },
    created () {
      store.commit('title', 'lbl_title_defense')
      store.commit('help', 'txt_help_defense')
      this.$bindAsArray('troops', database.ref('users').child(store.state.uid).child('troops').orderByChild('name'))
      this.$bindAsArray('book', database.ref('users').child(store.state.uid).child('book').orderByChild('battle').equalTo(true))
      this.$bindAsArray('relics', database.ref('users').child(store.state.uid).child('relics').orderByChild('battle').equalTo(true))
    },
    methods: {
      confirm (type) {
        this.type = type
        this.dialog = true
      },
      accept () {
        this.busy = true
        switch (this.type) {
          case 'save':
            this.save()
            break
        }
      },
      async save () {
        let defense = {
          first: this.defense.first || null,
          second: this.defense.second || null,
          third: this.defense.third || null,
          fourth: this.defense.fourth || null,
          fifth: this.defense.fifth || null,
          artifact: this.defense.artifact || null,
          spell: this.defense.spell || null
        }
        await database.ref('users').child(store.state.uid).child('defense').set(defense)
        store.commit('success', 'lbl_toast_defense_saved')
        this.close()
      },
      async restore () {
        await database.ref('users').child(store.state.uid).child('defense').remove()
        store.commit('success', 'lbl_toast_defense_restored')
      },
      close () {
        this.type = null
        this.dialog = false
        this.busy = false
      }
    },
    computed: {
      user () {
        return store.state.user
      },
      defense () {
        return this.user.defense
          ? this.user.defense
          : {
            first: null,
            second: null,
            third: null,
            fourth: null,
            fifth: null,
            artifact: null,
            spell: null
          }
      },
      first () {
        return this.troops
      },
      second () {
        return this.first
          ? this.first.filter(t => t['.key'] !== this.defense.first)
          : null
      },
      third () {
        return this.second
          ? this.second.filter(t => t['.key'] !== this.defense.second)
          : null
      },
      fourth () {
        return this.third
          ? this.third.filter(t => t['.key'] !== this.defense.third)
          : null
      },
      fifth () {
        return this.fourth
          ? this.fourth.filter(t => t['.key'] !== this.defense.fourth)
          : null
      },
      canFirst () {
        return this.troops && this.troops.length > 0
      },
      canSecond () {
        return this.canFirst && this.hasFirst
      },
      canThird () {
        return this.canSecond && this.hasSecond
      },
      canFourth () {
        return this.canThird && this.hasThird
      },
      canFifth () {
        return this.canFourth && this.hasFourth
      },
      hasFirst () {
        return this.defense.first || false
      },
      hasSecond () {
        return this.defense.second || false
      },
      hasThird () {
        return this.defense.third || false
      },
      hasFourth () {
        return this.defense.fourth || false
      },
      hasFifth () {
        return this.defense.fifth || false
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
