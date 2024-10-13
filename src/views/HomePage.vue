<template>
  <div class="homepage">
    <h1 class="text-center">Welcome to Our Services</h1>
    <p class="text-center">Explore our various services and provide your feedback.</p>

    <div class="services">
      <ServiceCard
        v-for="service in services"
        :key="service.id"
        :service="service"
        @rate="rateService"
      />
    </div>

    <Bfooter />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import ServiceCard from './ServiceCard.vue'
import Bfooter from '../components/Bfooter.vue'

//service
const services = reactive([
  { id: 1, name: 'Health Support', ratings: [], averageRating: 0 },
  { id: 2, name: 'Mental Health', ratings: [], averageRating: 0 },
  { id: 3, name: 'Financial Assistance', ratings: [], averageRating: 0 },
  { id: 4, name: 'Online Learning', ratings: [], averageRating: 0 },
  { id: 5, name: 'Community Activities', ratings: [], averageRating: 0 }
])

const rateService = (id, rating) => {
  const service = services.find((service) => service.id === id)
  if (service) {
    service.ratings.push(rating)
    service.averageRating = (
      service.ratings.reduce((acc, curr) => acc + curr, 0) / service.ratings.length
    ).toFixed(1)
  }
}
</script>

<style scoped>
.homepage {
  max-width: 800px;
  margin: 0 auto;
  padding: 50px;
}

.services {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
</style>
