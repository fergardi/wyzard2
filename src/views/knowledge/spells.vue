<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="50", desktop="33", v-for="spell, index in scrolled", :key="index")
        spell-card.animated.fadeInUp(:data="spell", :info="true")
      mu-infinite-scroll(v-if="visible", :scroller="scroller", :loading="loading", @load="more", :loadingText="translate('lbl_label_loading')", key="-1")
</template>

<script>
  import { database } from '../../services/firebase'
  import store from '../../vuex/store'
  import spell from '../../components/spell-card'
  
  export default {
    components: {
      'spell-card': spell
    },
    data () {
      return {
        scroller: null,
        loading: false,
        max: 9
      }
    },
    created () {
      store.commit('title', 'lbl_title_spells')
    },
    mounted () {
      this.scroller = this.$el
    },
    firebase: {
      spells: database.ref('spells').orderByChild('color')
    },
    methods: {
      more () {
        if (this.max < this.spells.length) {
          this.loading = true
          setTimeout(() => {
            this.max += 9
            this.loading = false
          }, 250)
        }
      }
    },
    computed: {
      scrolled () {
        return this.spells.slice(0, Math.min(this.spells.length - 1, this.max))
      },
      visible () {
        return this.scroller && this.max > 0 && this.max < this.spells.length
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
