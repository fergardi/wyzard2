<template lang="pug">
  mu-card.faction
    mu-card-media
      img.lazy(v-lazy-load="picture('factions', data.image)", :src="picture('miscellaneous', 'loading')", :alt="translate(data.name)")
      .card-info
        .card-text(:class="data.color", v-tooltip="translate('ttp_faction_name')") {{ data.name | translate }}
    mu-card-text
      p.card-description {{ data.description | translate }}
</template>

<script>
  export default {
    name: 'faction-card',
    props: {
      data: Object
    }
  }
</script>

<style lang="stylus" scoped>
</style>
