<template>
  <div class="service-card">
    <h2>{{ service.name }}</h2>
    <p>Average Rating: {{ service.averageRating }} / 5</p>
    <div class="rating">
      <span v-for="n in 5" :key="n" @click="rate(n)" class="star"> ★ </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  service: Object
});

const emit = defineEmits(['rate']);

const rate = (rating) => {
  emit('rate', props.service.id, rating);
};
</script>

<style scoped>
.service-card {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  width: 200px;
  text-align: center;
}

.star {
  cursor: pointer;
  font-size: 24px;
  color: gold;
  margin: 0 2px;
}

.star:hover {
  transform: scale(1.2);
  transition: transform 0.2s;
}
</style>
