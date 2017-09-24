<template lang="pug">
  mu-row
    mu-col(width="100", tablet="100", desktop="100")
      mu-card.defense.animated.fadeInUp
        mu-card-media
          img(src="http://3.bp.blogspot.com/-lBuo6st_Glg/Vm1W4PAqxBI/AAAAAAAA0Kc/djgMInNes8Q/s1600/Fortezza_di_Masyaf_concept_art_2%255B1%255D.jpg")
          #info
            #title {{ 'lbl_label_defense' | translate }}
        mu-card-text
          p {{ '' | lorem }}
        mu-card-text
          form

</template>

<script>
  import { database } from '../services/firebase'
  import store from '../vuex/store'
  
  export default {
    name: 'defense',
    created () {
      store.commit('title', 'lbl_title_defense')
      this.$bindAsArray('spells', database.ref('users').child(store.state.username).child('spells').orderByChild('defensive').equalTo(true))
      this.$bindAsArray('artifacts', database.ref('users').child(store.state.username).child('artifacts').orderByChild('defensive').equalTo(true))
    }
  }
</script>

<style lang="stylus" scoped>
</style>
