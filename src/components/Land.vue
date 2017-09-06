<template lang="pug">
  .land
    mapbox#map(:access-token="token", :map-options="options", @map-load="loaded", @map-click="clicked", @map-move="moving")

    mu-popup(position="left", :open="popup", @close="close")
      mu-appbar(:title="selected.name")
        mu-icon-button(slot="right", icon="close", @click="close")
      mu-card
        mu-card-header(:title="selected.name", subTitle="zone")
          mu-avatar(:src="selected.src", slot="avatar")
        mu-card-text {{ '' | ipsum }}
      mu-card-actions
        mu-raised-button(:label="translate('lbl_ok')", primary, @click="close")
        mu-raised-button(:label="translate('lbl_cancel')", secondary, @click="close")
</template>

<script>
  import store from '../vuex/store'
  import i18n from '../services/i18n'
  import mapboxgl from 'mapbox-gl'
  import Mapbox from 'mapbox-gl-vue'
  import firebase from '../services/firebase'

  export default {
    name: 'Map',
    components: {
      'mapbox': Mapbox
    },
    data () {
      return {
        map: null,
        popup: false,
        selected: {
          src: '',
          name: ''
        },
        token: 'pk.eyJ1IjoiZmVyZ2FyZGkiLCJhIjoiY2lxdWl1enJiMDAzaWh4bTNwY3F6MnNwdiJ9.fPkJoOfrARPtZWCj1ehyCQ',
        options: {
          zoom: 12,
          bearing: 0,
          pitch: 60,
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
        },
        images: [
          { src: 'https://image.flaticon.com/icons/svg/119/119572.svg', name: 'lbl_fountain' },
          { src: 'https://image.flaticon.com/icons/svg/119/119592.svg', name: 'lbl_waterfall' },
          { src: 'https://image.flaticon.com/icons/svg/119/119591.svg', name: 'lbl_plains' },
          { src: 'https://image.flaticon.com/icons/svg/119/119580.svg', name: 'lbl_forest' },
          { src: 'https://image.flaticon.com/icons/svg/119/119596.svg', name: 'lbl_beach' },
          { src: 'https://image.flaticon.com/icons/svg/119/119573.svg', name: 'lbl_river' },
          { src: 'https://image.flaticon.com/icons/svg/119/119588.svg', name: 'lbl_village' },
          { src: 'https://image.flaticon.com/icons/svg/119/119578.svg', name: 'lbl_inn' },
          { src: 'https://image.flaticon.com/icons/svg/119/119598.svg', name: 'lbl_mountain' },
          { src: 'https://image.flaticon.com/icons/svg/119/119575.svg', name: 'lbl_iceberg' },
          { src: 'https://image.flaticon.com/icons/svg/119/119576.svg', name: 'lbl_island' },
          { src: 'https://image.flaticon.com/icons/svg/119/119574.svg', name: 'lbl_desert' },
          { src: 'https://image.flaticon.com/icons/svg/119/119590.svg', name: 'lbl_paradise' },
          { src: 'https://image.flaticon.com/icons/svg/119/119594.svg', name: 'lbl_windmill' },
          { src: 'https://image.flaticon.com/icons/svg/119/119581.svg', name: 'lbl_harbour' },
          { src: 'https://image.flaticon.com/icons/svg/119/119585.svg', name: 'lbl_castle' },
          { src: 'https://image.flaticon.com/icons/svg/119/119589.svg', name: 'lbl_dungeon' },
          { src: 'https://image.flaticon.com/icons/svg/119/119595.svg', name: 'lbl_tree' }
        ],
        placesMarkers: []
      }
    },
    firebase: {
      placesRef: firebase.ref('places')
    },
    filters: {
      translate (label) {
        return i18n[store.state.lang][label] || label
      }
    },
    methods: {
      loaded (map) {
        this.map = map
        setTimeout(() => {
          this.ready()
        }, 250)
      },
      ready () {
        firebase.ref('places').on('child_added', (place) => {
          this.add(place.val(), place.key)
        })
        firebase.ref('places').on('child_removed', (place) => {
          this.remove(place.key)
        })
      },
      add (marker, key) {
        var width = 75
        var height = width
        var element = document.createElement('div')
        element.className = 'marker'
        element.id = key
        element.style.backgroundImage = 'url(' + marker.src + ')'
        element.style.backgroundSize = width + 'px ' + height + 'px'
        element.style.backgroundRepeat = 'no-repeat'
        element.style.width = width + 'px'
        element.style.height = height + 'px'
        var shadow = document.createElement('div')
        shadow.className = 'shadow'
        element.appendChild(shadow)
        element.addEventListener('click', (e) => {
          this.selected = marker
          this.popup = true
          e.preventDefault()
          // e.stopPropagation()
          return false
        })
        this.placesMarkers.push(new mapboxgl.Marker(element, {
          offset: [-width / 2, -height]
        })
        .setLngLat([marker.lng, marker.lat])
        // .setPopup(new mapboxgl.Popup({ offset: 0 }).setHTML('<h3>' + marker.name + '</h3><p>' + marker.name + '</p>'))
        .addTo(this.map))
      },
      remove (key) {
        var found = this.placesMarkers.find(p => p.getElement().id === key)
        if (found) {
          found.remove()
          this.placesMarkers.splice(this.placesMarkers.indexOf(found), 1)
        }
      },
      fake (lat, lng) {
        var image = this.images[Math.floor(Math.random() * (this.images.length))]
        return {
          lat: lat,
          lng: lng,
          src: image.src,
          name: image.name,
          style: 'red',
          timestamp: Date.now()
        }
      },
      clicked (map, event) {
        // this.$firebaseRefs.placesRef.child(this.placesRef[Math.floor(Math.random() * this.placesRef.length)]['.key']).remove()
        // this.$firebaseRefs.placesRef.push(this.fake(parseFloat(event.lngLat.lat), parseFloat(event.lngLat.lng)))
      },
      contains (extension, point) {
        return point.lng <= extension._ne.lng + 0.1 &&
          point.lat <= extension._ne.lat + 0.1 &&
          point.lng >= extension._sw.lng - 0.1 &&
          point.lat >= extension._sw.lat - 0.1
      },
      near (geolocation, point) {
        return Math.abs(geolocation.lng) - Math.abs(point.lng) <= 0.01 &&
          Math.abs(geolocation.lat) - Math.abs(point.lat) <= 0.01
      },
      moving () {
        this.placesMarkers.forEach(m => {
          if (!this.contains(this.map.getBounds(), m.getLngLat())) {
            m._element.classList.add('invisible')
          } else {
            m._element.classList.remove('invisible')
            if (!this.near(this.position, m.getLngLat())) {
              m._element.classList.add('close')
            } else {
              m._element.classList.remove('close')
            }
          }
        })
      },
      translate (label) {
        return i18n[store.state.lang][label] || label
      },
      close () {
        this.popup = false
      }
    }
  }
</script>

<style lang="stylus">
  .land
    #map
      width 100vw
      height 100vh
      .marker
        cursor pointer
        display block
        &.invisible
          visibility hidden
        &.close
          width 125%
          heigh 125%
      .shadow
        width 100%
        height 7px
        border-radius 50%
        background-color black
        opacity .3
        position absolute
        bottom -10px
  .mu-popup-left
    width 100%
    .mu-card-actions
      display flex
      justify-content center
      align-items center
      button + button
        margin-left 5px
</style>
