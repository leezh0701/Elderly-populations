<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import BHeader from './components/BHeader.vue'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()

const isAuthenticated = computed(() => store.getters.isAuthenticated)
const currentUser = computed(() => store.state.user)
const isAdmin = computed(() => currentUser.value && currentUser.value.role === 'admin')

const handleAuthAction = () => {
  if (isAuthenticated.value) {
    store.dispatch('logout')
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
