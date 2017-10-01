<template lang="pug">
  mu-card.faction
    mu-card-media
      img(:src="data.image", :alt="translate(data.name)")
      .card-info
        .card-title(:class="data.color") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}
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
