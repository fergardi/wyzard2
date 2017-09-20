<template lang="pug">
  .map
    mapbox#map(:access-token="token", :map-options="options", @map-load="ready")
</template>

<script>
  import mapbox from 'mapbox-gl-vue'
  import extent from 'turf-extent'
  import store from '../vuex/store'
  import firebase from '../services/firebase'

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
    },
    firebase: {
      kingdoms: firebase.ref('users').child(store.state.username).child('kingdoms')
    },
    methods: {
      ready (map) {
        // add countries geojson
        map.addSource('data', {
          'type': 'geojson',
          'data': 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
        })
        // show countries hidden to get features on click
        map.addLayer({
          'id': 'countries',
          'type': 'fill',
          'source': 'data',
          'paint': {
            'fill-color': 'transparent',
            'fill-outline-color': 'transparent',
            'fill-opacity': 0
          }
        })
        // show country borders
        map.addLayer({
          'id': 'countries-borders',
          'type': 'line',
          'source': 'data',
          'layout': {},
          'paint': {
            'line-color': '#ad835a',
            'line-width': 3
          }
        })
        // show coutnries conquered
        map.addLayer({
          'id': 'countries-conquered',
          'type': 'fill',
          'source': 'data',
          'layout': {},
          'paint': {
            'fill-color': '#ad835a',
            'fill-outline-color': '#ad835a',
            'fill-opacity': 0.75
          }
        })
        // show selected country
        map.addLayer({
          'id': 'country-selected',
          'type': 'fill',
          'source': 'data',
          'layout': {
            'visibility': 'none'
          },
          'paint': {
            'fill-color': '#680600',
            'fill-outline-color': '#ad835a',
            'fill-opacity': 0.75
          }
        })
        // show conquered countries
        map.setFilter('countries-conquered', ['in', 'name'].concat(this.countries))
        // show selected country on click
        map.on('click', 'countries', (e) => {
          store.commit('untoast')
          if (map.getLayoutProperty('country-selected', 'visibility') === 'none') {
            map.setLayoutProperty('country-selected', 'visibility', 'visible')
          }
          if (e.features && e.features.length > 0) {
            map.setFilter('country-selected', ['==', 'name', e.features[0].properties.name])
            let bbox = extent(e.features[0].geometry)
            map.fitBounds(bbox, { padding: 100, linear: true, maxZoom: 20 })
            store.commit('info', e.features[0].properties.name)
          }
        })
      }
    },
    computed: {
      countries () {
        return this.kingdoms.map(kingdom => { return kingdom['.value'] })
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
