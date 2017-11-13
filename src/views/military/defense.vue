<template lang="pug">
  mu-row
    mu-col(width="100", tablet="66", desktop="50")
      mu-card.defense.animated.fadeInUp
        form(@submit.stop.prevent="confirm('save')")
          mu-card-media
            img(v-lazy-load="picture('miscellaneous', 'defense')", :src="picture('miscellaneous', 'defense')", :alt="translate('lbl_label_defense')")
            .card-info
              .card-text {{ 'lbl_label_defense' | translate }}
          mu-card-text
            p {{ 'lbl_label_protection' | translate }}

          mu-card-text
            mu-select-field(v-model="defense.first", :label="translate('lbl_label_army_first')", :fullWidth="true", @change="changeFirst")
              mu-menu-item(v-for="troop, index in first", :key="index", :value="troop['.key']", :title="translate(troop.name)")
          
            mu-select-field(v-model="defense.second", :label="translate('lbl_label_army_second')", :fullWidth="true", :disabled="!canSecond", @change="changeSecond")
              mu-menu-item(v-for="troop, index in second", :key="index", :value="troop['.key']", :title="translate(troop.name)")
          
            mu-select-field(v-model="defense.third", :label="translate('lbl_label_army_third')", :fullWidth="true", :disabled="!canThird", @change="changeThird")
              mu-menu-item(v-for="troop, index in third", :key="index", :value="troop['.key']", :title="translate(troop.name)")
          
            mu-select-field(v-model="defense.fourth", :label="translate('lbl_label_army_fourth')", :fullWidth="true", :disabled="!canFourth", @change="changeFourth")
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
  import { database } from '@/services/firebase'
  import store from '@/vuex/store'
  import confirm from '@/components/confirm-dialog'
  
  export default {
    components: {
      'confirm-dialog': confirm
    },
    data () {
      return {
        busy: false,
        type: null,
        dialog: false,
        defense: {
          first: null,
          second: null,
          third: null,
          fourth: null,
          fifth: null,
          spell: null,
          artifact: null
        }
      }
    },
    created () {
      store.commit('title', 'lbl_title_defense')
      store.commit('help', 'txt_help_defense')
      this.$bindAsArray('troops', database.ref('users').child(store.state.uid).child('troops').orderByChild('name'))
      this.$bindAsArray('book', database.ref('users').child(store.state.uid).child('book').orderByChild('battle').equalTo(true))
      this.$bindAsArray('relics', database.ref('users').child(store.state.uid).child('relics').orderByChild('battle').equalTo(true))
      database.ref('users').child(store.state.uid).child('defense').once('value', defense => {
        if (defense) {
          this.defense = Object.assign(this.defense, defense.val())
        }
      })
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
        this.reset()
        store.commit('success', 'lbl_toast_defense_restored')
      },
      reset () {
        this.defense = {
          first: null,
          second: null,
          third: null,
          fourth: null,
          fifth: null,
          spell: null,
          artifact: null
        }
      },
      close () {
        this.type = null
        this.dialog = false
        this.busy = false
      },
      changeFirst () {
        console.log('changing first')
        this.defense.second = null
        this.defense.third = null
        this.defense.fourth = null
        this.defense.fifth = null
      },
      changeSecond () {
        console.log('changing second')
        this.defense.third = null
        this.defense.fourth = null
        this.defense.fifth = null
      },
      changeThird () {
        console.log('changing third')
        this.defense.fourth = null
        this.defense.fifth = null
      },
      changeFourth () {
        console.log('changing fourth')
        this.defense.fifth = null
      }
    },
    computed: {
      user () {
        return store.state.user || {}
      },
      first () {
        return this.troops
      },
      second () {
        return this.hasFirst
          ? this.first.filter(t => t['.key'] !== this.defense.first)
          : null
      },
      third () {
        return this.hasSecond
          ? this.second.filter(t => t['.key'] !== this.defense.second)
          : null
      },
      fourth () {
        return this.hasThird
          ? this.third.filter(t => t['.key'] !== this.defense.third)
          : null
      },
      fifth () {
        return this.hasFourth
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
        return this.defense.first !== undefined && this.defense.first !== null
      },
      hasSecond () {
        return this.defense.second !== undefined && this.defense.second !== null
      },
      hasThird () {
        return this.defense.third !== undefined && this.defense.third !== null
      },
      hasFourth () {
        return this.defense.fourth !== undefined && this.defense.fourth !== null
      },
      hasFifth () {
        return this.defense.fifth !== undefined && this.defense.fifth !== null
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
