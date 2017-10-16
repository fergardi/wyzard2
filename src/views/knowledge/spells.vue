<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="100", desktop="100", key="-2")
        mu-card
          mu-card-text
            form
              mu-text-field(v-model="search", name="search", :label="translate('lbl_label_search')", :hintText="translate('lbl_label_search')", :fullWidth="true")
      mu-col(width="100", tablet="50", desktop="33", v-for="spell, index in filtered", :key="index")
        spell-card.animated.fadeInUp(:data="spell", :info="true")
      // mu-infinite-scroll(v-if="visible", :scroller="scroller", :loading="loading", @load="more", :loadingText="translate('lbl_label_loading')", key="-1")
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
        search: '',
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
          }, 500)
        }
      }
    },
    computed: {
      scrolled () {
        return this.spells.slice(0, Math.min(this.spells.length - 1, this.max))
      },
      visible () {
        return this.scroller && this.max > 0 && this.max < this.spells.length
      },
      filtered () {
        return this.search && this.search !== ''
          ? this.spells.filter(u => {
            return this.translate(u.name).toLowerCase().includes(this.search.toLowerCase()) ||
              this.translate(u.description).toLowerCase().includes(this.search.toLowerCase())
          })
          : this.spells
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
