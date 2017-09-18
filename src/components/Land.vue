<template lang="pug">
  mapbox#map(:access-token="token", :map-options="options", @map-load="ready")
</template>

<script>
  import mapbox from 'mapbox-gl-vue'

  export default {
    name: 'land',
    components: {
      'mapbox': mapbox
    },
    data () {
      return {
        map: null,
        token: 'pk.eyJ1IjoiZmVyZ2FyZGkiLCJhIjoiY2lxdWl1enJiMDAzaWh4bTNwY3F6MnNwdiJ9.fPkJoOfrARPtZWCj1ehyCQ',
        options: {
          zoom: 4,
          bearing: 0,
          pitch: 0,
          center: [-5.5795430999999995, 42.5821452],
          style: 'mapbox://styles/fergardi/cirymo82r004jgym6lh1lkgo5',
          position: 'bottom-left',
          range: 1000,
          speed: 1,
          curve: 1,
          interactive: true,
          attributionControl: false
        },
        visibility: 0.1,
        position: {
          lat: 42.5821452,
          lng: -5.5795430999999995
        }
      }
    }
  }
</script>

<style lang="stylus">
  #map
    opacity 0.95
    height calc(100vh - 69px)
    width 100%
    border-radius 5px
    .mapboxgl-ctrl
      display none
    canvas
      width 100% !important
      height 100% !important
</style>
