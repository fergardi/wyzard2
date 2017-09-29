<template lang="pug">
  mu-card.faction
    mu-card-media
      img(:src="data.image")
      .card-info
        .card-title(:class="data.color") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}
</template>

<script>
  export default {
    name: 'faction',
    props: ['data']
  }
</script>

<style lang="stylus" scoped>
</style>
