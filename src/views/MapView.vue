<template>
    <div class="map-container">
      <div class="search-container">
        <input 
          v-model="searchQuery" 
          @input="fetchSuggestions" 
          placeholder="Search places of interest" 
          class="search-box"
        />
        <ul v-if="suggestions.length" class="suggestions-list">
          <li v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)">
            {{ suggestion.place_name }}
          </li>
        </ul>
      </div>
      
      <button @click="getCurrentLocation" class="location-button">Get Current Location</button>
      
      <div class="directions-container">
        <input v-model="start" placeholder="Start Location" class="input-box" />
        <input v-model="end" @keyup.enter="getDirections" placeholder="End Location" class="input-box" />
        <select v-model="travelMode" class="travel-mode">
          <option value="driving">Driving</option>
          <option value="walking">Walking</option>
          <option value="cycling">Cycling</option>
        </select>
        <button @click="getDirections" class="direction-button">Get Directions</button>
      </div>
      
      <div class="nearby-poi-container">
        <select v-model="poiType" class="poi-type">
          <option value="restaurant">Restaurant</option>
          <option value="gas station">Gas Station</option>
          <option value="park">Park</option>
        </select>
        <button @click="findNearbyPOI" class="poi-button">Find Nearby</button>
      </div>
      
      <div id="map" ref="mapContainer" class="map"></div>
    </div>
  </template>
  
  <script>
  import mapboxgl from 'mapbox-gl';
  import axios from 'axios';
  
  export default {
    name: 'MapView',
    data() {
      return {
        map: null,
        searchQuery: '',
        suggestions: [],
        start: '',
        end: '',
        travelMode: 'driving',
        poiType: 'restaurant'
      };
    },
    mounted() {
      mapboxgl.accessToken = 'pk.eyJ1IjoibGVlemgwNzAxIiwiYSI6ImNtMjVuamI2aTB2ZXUybnB2YmVzMWJyNXEifQ.kP6nC3f5LfApxi8FQKFJwQ';
      this.map = new mapboxgl.Map({
        container: this.$refs.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [144.9631, -37.8136],
        zoom: 10
      });
    },
    methods: {
      async fetchSuggestions() {
        if (!this.searchQuery) {
          this.suggestions = [];
          return;
        }
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(this.searchQuery)}.json`, {
          params: {
            access_token: mapboxgl.accessToken,
            autocomplete: true,
            limit: 5
          }
        });
        this.suggestions = response.data.features;
      },
      selectSuggestion(suggestion) {
        this.searchQuery = suggestion.place_name;
        this.searchPlace();
        this.suggestions = [];
      },
      async searchPlace() {
        if (!this.searchQuery) return;
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(this.searchQuery)}.json`, {
          params: {
            access_token: mapboxgl.accessToken,
            limit: 1
          }
        });
        if (response.data.features.length > 0) {
          const place = response.data.features[0];
          const [lng, lat] = place.geometry.coordinates;
          this.map.flyTo({ center: [lng, lat], zoom: 14 });
          new mapboxgl.Marker().setLngLat([lng, lat]).addTo(this.map);
        }
      },
      getCurrentLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            const lng = position.coords.longitude;
            const lat = position.coords.latitude;
            this.map.flyTo({ center: [lng, lat], zoom: 14 });
            new mapboxgl.Marker({ color: 'red' })
              .setLngLat([lng, lat])
              .setPopup(new mapboxgl.Popup().setText("You are here"))
              .addTo(this.map);
          }, error => {
            console.error("Error retrieving location:", error);
          });
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      },
      async geocodePlace(placeName) {
        try {
          const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(placeName)}.json`, {
            params: {
              access_token: mapboxgl.accessToken,
              limit: 1
            }
          });
          if (response.data.features.length > 0) {
            return response.data.features[0].geometry.coordinates;
          }
        } catch (error) {
          console.error(`Error geocoding place ${placeName}:`, error);
        }
        return null;
      },
      async getDirections() {
        if (!this.start || !this.end) {
          alert("Please enter both start and end locations");
          return;
        }
        const startCoords = await this.geocodePlace(this.start);
        const endCoords = await this.geocodePlace(this.end);
        if (startCoords && endCoords) {
          const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/${this.travelMode}/${startCoords.join(',')};${endCoords.join(',')}`, {
            params: {
              access_token: mapboxgl.accessToken,
              geometries: 'geojson'
            }
          });
          const route = response.data.routes[0].geometry;
          if (this.map.getSource('route')) {
            this.map.getSource('route').setData({
              type: 'Feature',
              properties: {},
              geometry: route
            });
          } else {
            this.map.addLayer({
              id: 'route',
              type: 'line',
              source: {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: route
                }
              },
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
              }
            });
          }
          this.map.flyTo({
            center: startCoords,
            zoom: 12
          });
        }
      },
      async findNearbyPOI() {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.poiType}.json`, {
          params: {
            access_token: mapboxgl.accessToken,
            proximity: `${this.map.getCenter().lng},${this.map.getCenter().lat}`,
            limit: 10
          }
        });
        response.data.features.forEach(feature => {
          const [lng, lat] = feature.geometry.coordinates;
          new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setText(feature.place_name))
            .addTo(this.map);
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .map-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
    padding-top: 60px;
  }
  
  .search-container {
    width: 100%;
    max-width: 600px;
    margin-bottom: 10px;
  }
  
  .search-box {
    padding: 8px;
    width: 100%;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .suggestions-list {
    list-style: none;
    padding: 0;
    margin: 5px 0;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    max-width: 600px;
  }
  
  .suggestions-list li {
    padding: 8px;
    cursor: pointer;
  }
  
  .suggestions-list li:hover {
    background-color: #f0f0f0;
  }
  
  .location-button {
    padding: 8px 16px;
    margin-bottom: 15px;
    background-color: #ff9800;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .directions-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
    width: 100%;
    max-width: 600px;
  }
  
  .input-box {
    margin-bottom: 8px;
    padding: 8px;
    width: 100%;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .travel-mode {
    margin-bottom: 8px;
    padding: 8px;
    width: 100%;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .direction-button {
    padding: 8px 16px;
    background-color: #3887be;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .nearby-poi-container {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .poi-type {
    padding: 8px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 8px;
  }
  
  .poi-button {
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .map {
    height: 500px;
    width: 100%;
    max-width: 1000px;
    border-radius: 10px;
    margin-top: 15px;
  }
  </style>