<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.defense.animated.fadeInUp
        mu-card-media
          img(src="http://3.bp.blogspot.com/-lBuo6st_Glg/Vm1W4PAqxBI/AAAAAAAA0Kc/djgMInNes8Q/s1600/Fortezza_di_Masyaf_concept_art_2%255B1%255D.jpg")
          .card-info
            .card-title {{ 'lbl_label_defense' | translate }}
        mu-card-text
          p {{ '' | lorem }}
        mu-card-text
          mu-select-field(v-model="spell", :label="translate('lbl_label_spell')", :fullWidth="true")
            mu-menu-item(v-for="spell, index in spells", :key="index", :value="spell.name", :title="translate(spell.name)")
          mu-select-field(v-model="artifact", :label="translate('lbl_label_artifact')", :fullWidth="true")
            mu-menu-item(v-for="artifact, index in artifacts", :key="index", :value="artifact.name", :title="translate(artifact.name)")
        mu-card-actions
          mu-raised-button(primary, @click="save") {{ 'lbl_button_save' | translate }}
</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
    name: 'defense',
    data () {
      return {
        spell: null,
        artifact: null
      }
    },
    created () {
      store.commit('title', 'lbl_title_defense')
      this.$bindAsArray('spells', database.ref('users').child(store.state.uid).child('spells').orderByChild('defensive').equalTo(true))
      this.$bindAsArray('artifacts', database.ref('users').child(store.state.uid).child('artifacts').orderByChild('defensive').equalTo(true))
    },
    methods: {
      save () {
        // TODO
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
