<template lang="pug">
  .map
    mapbox#map(:access-token="token", :map-options="options", @map-load="ready")

    mu-toast.toast(v-if="toast.show", :message="toast.message", @close="hide")
</template>

<script>
  import mapbox from 'mapbox-gl-vue'
  import extent from 'turf-extent'

  export default {
    name: 'land',
    components: {
      'mapbox': mapbox
    },
    data () {
      return {
        toast: {
          show: false,
          message: null
        },
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
    },
    methods: {
      show (message) {
        this.toast.message = message
        this.toast.show = true
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => { this.toast.show = false }, 3000)
      },
      hide () {
        this.toast.message = null
        this.toast.show = false
        if (this.timer) clearTimeout(this.timer)
      },
      ready (map) {
        map.addLayer({
          'id': 'countries',
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
          },
          'paint': {
            'fill-color': 'transparent',
            'fill-outline-color': 'transparent',
            'fill-opacity': 0
          }
        })
        map.addLayer({
          'id': 'countries-borders',
          'type': 'line',
          'source': {
            'type': 'geojson',
            'data': 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
          },
          'layout': {},
          'paint': {
            'line-color': '#ad835a',
            'line-width': 3
          }
        })
        map.addLayer({
          'id': 'country',
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
          },
          'layout': {
            'visibility': 'none'
          },
          'paint': {
            'fill-color': '#ad835a',
            'fill-outline-color': '#ad835a',
            'fill-opacity': 0.5
          }
        })
        map.on('click', 'countries', (e) => {
          this.hide()
          if (map.getLayoutProperty('country', 'visibility') === 'none') {
            map.setLayoutProperty('country', 'visibility', 'visible')
          }
          map.setFilter('country', ['==', 'name', e.features[0].properties.name])
          if (e.features && e.features.length > 0) {
            let bbox = extent(e.features[0].geometry)
            map.fitBounds(bbox, { padding: 100, linear: true, maxZoom: 20 })
            this.show(e.features[0].properties.name)
          }
        })
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
