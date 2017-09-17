<template lang="pug">
  mu-card.building
    mu-card-media
      img(:src="data.image")
      #title(:class="data.faction ? data.faction.color : ''") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}

    template(v-if="construction && quantity >= 0")
      mu-card-text
        form
          mu-text-field(type="number", v-model="ammount", min="0", required, :label="translate('lbl_label_quantity')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="demolish") {{ 'lbl_button_demolish' | translate }}
        mu-raised-button(primary, @click="construct") {{ 'lbl_button_construct' | translate }}

    template(v-if="exploration")
      mu-card-text
        form
          mu-text-field(type="number", v-model="ammount", min="0", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="explore") {{ 'lbl_button_explore' | translate }}

    template(v-if="meditation")
      mu-card-text
        form
          mu-text-field(type="number", v-model="ammount", min="0", required, :label="translate('lbl_resource_turns')", :fullWidth="true")
      mu-card-actions
        mu-raised-button(primary, @click="meditate") {{ 'lbl_button_meditate' | translate }}
</template>

<script>
  import firebase from '../services/firebase'

  export default {
    name: 'building',
    props: ['name', 'quantity', 'exploration', 'construction', 'meditation'],
    data () {
      return {
        ammount: 0
      }
    },
    created () {
      this.$bindAsObject('data', firebase.ref('buildings').child(this.name))
    },
    methods: {
      demolish () {
        // TODO
      },
      construct () {
        // TODO
      },
      explore () {
        // TODO
      },
      meditate () {
        // TODO
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
