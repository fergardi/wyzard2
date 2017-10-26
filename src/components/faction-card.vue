<template lang="pug">
  mu-card.faction
    mu-card-media
      img.lazy(v-lazy-load="data.image", src="https://firebasestorage.googleapis.com/v0/b/wyzard-14537.appspot.com/o/loading.jpg?alt=media", :alt="translate(data.name)")
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
