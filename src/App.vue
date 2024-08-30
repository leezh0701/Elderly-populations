<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import BHeader from './components/BHeader.vue'

const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
const currentUser = ref(JSON.parse(localStorage.getItem('currentUser') || '{}'))
const router = useRouter()

const isAdmin = computed(() => currentUser.value.role === 'admin')

watch([isAuthenticated, currentUser], () => {
  localStorage.setItem('isAuthenticated', isAuthenticated.value.toString())
  localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
})

const handleAuthAction = () => {
  if (isAuthenticated.value) {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('currentUser')
    isAuthenticated.value = false
    currentUser.value = {}
    router.push('/login')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <div>
    <BHeader
      :isAuthenticated="isAuthenticated"
      :isAdmin="isAdmin"
      :handleAuthAction="handleAuthAction"
    />
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
