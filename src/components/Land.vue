<template lang="pug">
  .map
    mapbox#map(:access-token="token", :map-options="options", @map-load="ready")
    mu-popup(position="bottom", :open="popup", @close="close")
      mu-appbar(:title="selected.name")
        mu-icon-button(slot="right", icon="close", @click="close")
      mu-content-block
        mu-list
          mu-list-item(v-for="troop, index in selected.army", :title="translate(troop.name)", :class="troop.color", :key="index")
            mu-avatar(:src="troop.image", slot="leftAvatar")
            mu-badge(slot="after") {{ troop.quantity | numeric }}
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
        popup: false,
        selected: {},
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
            'fill-opacity': 0.5
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
            'fill-opacity': 0.5
          }
        })
        // show conquered countries
        map.setFilter('countries-conquered', ['in', 'name'].concat(this.countries))
        // show selected country on click
        map.on('click', 'countries', (e) => {
          if (map.getLayoutProperty('country-selected', 'visibility') === 'none') {
            map.setLayoutProperty('country-selected', 'visibility', 'visible')
          }
          if (e.features && e.features.length > 0) {
            map.setFilter('country-selected', ['==', 'name', e.features[0].properties.name])
            let bbox = extent(e.features[0].geometry)
            map.fitBounds(bbox, { padding: 100, linear: true, maxZoom: 20 })
            this.selected = {
              name: e.features[0].properties.name,
              army: [
                { name: 'lbl_unit_skeleton', color: 'purple', quantity: 1233221, image: 'https://i.pinimg.com/736x/23/a5/e5/23a5e5affb327bd0ffb197f3dd4906ec--fantasy-monster-dark-fantasy.jpg' },
                { name: 'lbl_unit_zombie', color: 'purple', quantity: 435565, image: 'https://i.pinimg.com/736x/e4/51/58/e4515821a313a33764e06502561b79bf--fantasy-illustration-d-art.jpg' },
                { name: 'lbl_unit_spider', color: 'purple', quantity: 5435, image: 'http://conceptartworld.com/wp-content/uploads/2008/11/leonid_snow_07.jpg' },
                { name: 'lbl_unit_wraith', color: 'purple', quantity: 2343, image: 'https://i.pinimg.com/originals/93/6b/4c/936b4cdd91c6f96f84bafa3b93da03fa.jpg' },
                { name: 'lbl_unit_vampire', color: 'purple', quantity: 43, image: 'https://i.pinimg.com/originals/86/ec/49/86ec491c65f763284cf167575836f15f.jpg' }
              ]
            }
            this.popup = true
          }
        })
      },
      close () {
        this.popup = false
        this.selected = {}
      }
    },
    computed: {
      countries () {
        return this.kingdoms.map(kingdom => { return kingdom['.value'] })
      }
    }
  }
</script>

<style lang="stylus" scoped>
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
  .mu-popup
    min-width 50%
    .mu-content-block
      padding 0
</style>
