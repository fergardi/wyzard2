<template lang="pug">
  mu-card.unit
    mu-card-media
      img(:src="data.image")
      #title(:class="data.color") {{ data.name | translate }}
    mu-card-text
      p {{ data.description | lorem }}
</template>

<script>
  export default {
    name: 'unit',
    props: ['data']
  }
</script>

<style lang="stylus" scoped>
</style>
