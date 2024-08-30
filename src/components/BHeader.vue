<template>
  <div class="container">
    <header class="d-flex justify-content-between align-items-center py-3">
      <div class="d-flex flex-column align-items-center">
        <img src="@/assets/logo.png" alt="Logo" class="logo mb-1" />
        <span class="institution-name">Elderly population</span>
      </div>

      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/homepage" class="nav-link" active-class="active">Homepage</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/service" class="nav-link" active-class="active">Service</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/blog" class="nav-link" active-class="active">Blog</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/contact-us" class="nav-link" active-class="active"
            >Contact Us</router-link
          >
        </li>
        <!-- only admin shows Admin Page -->
        <li class="nav-item" v-if="isAdmin">
          <router-link to="/admin-page" class="nav-link" active-class="active"
            >Admin Page</router-link
          >
        </li>
      </ul>

      <ul class="nav nav-pills ms-auto">
        <li class="nav-item">
          <button @click="handleAuthAction" class="nav-link btn btn-link">
            {{ isAuthenticated ? 'Logout' : 'Login' }}
          </button>
        </li>
      </ul>
    </header>
  </div>
</template>

<script setup>
const props = defineProps({
  isAuthenticated: Boolean,
  isAdmin: Boolean,
  handleAuthAction: Function
})
</script>

<style scoped>
.logo {
  height: 60px;
  width: auto;
}

.institution-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.navbar {
  display: flex;
  justify-content: center;
  gap: 15px;
}

button {
  padding: 5px 10px;
}
</style>
