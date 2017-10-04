<template lang="pug">
  .map
    mapbox#map(:access-token="token", :map-options="options", @map-load="ready")
    
    mu-dialog(:open="dialog", @close="close")
      mu-card.dialog
        mu-card-media
          img(src="https://i.pinimg.com/originals/8b/b0/96/8bb09649164365bf93dbcc0b12031f34.jpg", :alt="translate('lbl_label_conquest')")
          .card-info
            .card-title {{ name | translate }}
        mu-card-text.conquest
          .army
            .troop(v-for="troop, index in army", :key="index")
              .name(:class="troop.color") {{ troop.name | translate }}
              .quantity(:class="troop.color") {{ troop.quantity | numeric }}
        //
          mu-list.army
            mu-list-item(v-for="troop, index in army", :key="index", :title="translate(troop.name)")
              // mu-avatar(icon=":ra ra-sword", :backgroundColor="troop.color", slot="leftAvatar")
              mu-icon(slot="left", value=":ra ra-sword", :class="troop.color")
              mu-badge(slot="after") {{ troop.quantity | numeric }}

        mu-card-actions
          mu-raised-button(primary, :label="translate('lbl_button_cancel')", @click="close")
          mu-raised-button(primary, :label="translate('lbl_button_attack')", @click="conquest")
</template>

<script>
  import mapbox from 'mapbox-gl-vue'
  import extent from 'turf-extent'
  import store from '../vuex/store'
  import { database } from '../services/firebase'

  export default {
    name: 'land-card',
    components: {
      'mapbox': mapbox
    },
    data () {
      return {
        army: [],
        name: null,
        dialog: false,
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
    created () {
      this.$bindAsArray('kingdoms', database.ref('users').child(store.state.uid).child('kingdoms'))
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
            const name = e.features[0].properties.name
            map.setFilter('country-selected', ['==', 'name', name])
            let bbox = extent(e.features[0].geometry)
            map.fitBounds(bbox, { padding: 100, linear: true, maxZoom: 20 })
            this.$bindAsArray('army', database.ref('countries').child(name.replace(' ', '_').toLowerCase()).child('troops'))
            this.name = 'lbl_country_' + name.replace(' ', '_').toLowerCase()
            this.dialog = true
          }
        })
      },
      close () {
        this.dialog = false
        this.name = null
        this.army = []
      },
      conquest () {
        // TODO
        this.close()
      }
    },
    computed: {
      countries () {
        return this.kingdoms.map(kingdom => { return kingdom['.value'] })
      }
    }
  }
</script>

<style src="../../node_modules/mapbox-gl/dist/mapbox-gl.css"></style>

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
