<template lang="pug">
  mu-row
    transition-group.flex(name="card", tag="div", mode="out-in", enter-active-class="animated fadeInUp", leave-active-class="animated fadeOutDown")
      mu-col(width="100", tablet="100", desktop="100", key="-2")
        mu-card
          mu-card-text
            form
              mu-text-field(v-model="search", name="search", :label="translate('lbl_label_search')", :hintText="translate('lbl_label_search')", :fullWidth="true")
      mu-col(v-for="unit, index in filtered", :key="index", width="100", tablet="50", desktop="33")
        unit-card.animated.fadeInUp(:data="unit", :info="true")
      // mu-infinite-scroll(v-if="visible", :scroller="scroller", :loading="loading", @load="more", :loadingText="translate('lbl_label_loading')", key="-1")
</template>

<script>
  import { database } from '../../services/firebase'
  import store from '../../vuex/store'
  import unit from '../../components/unit-card'
  
  export default {
    components: {
      'unit-card': unit
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
      store.commit('title', 'lbl_title_units')
    },
    mounted () {
      this.scroller = this.$el
    },
    firebase: {
      units: database.ref('units').orderByChild('color')
    },
    methods: {
      more () {
        if (this.max < this.units.length) {
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
        return this.units.slice(0, Math.min(this.units.length - 1, this.max))
      },
      visible () {
        return this.scroller && this.max > 0 && this.max < this.units.length
      },
      filtered () {
        return this.search && this.search !== ''
          ? this.units.filter(u => {
            return this.translate(u.name).toLowerCase().includes(this.search.toLowerCase()) ||
              this.translate(u.description).toLowerCase().includes(this.search.toLowerCase()) ||
              this.translate(u.family).toLowerCase().includes(this.search.toLowerCase()) ||
              this.translate(u.type).toLowerCase().includes(this.search.toLowerCase())
          })
          : this.units
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
