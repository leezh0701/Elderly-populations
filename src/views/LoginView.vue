<template>
  <div class="container mt-5">
    <h1 class="text-center">Elderly Population</h1>
    <p class="text-center">
      This is a website of a non-profit organization that focuses on the needs of the elderly.
    </p>
    <form @submit.prevent="submitForm">
      <div class="row justify-content-center">
        <div class="col-md-8 col-sm-10">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              id="username"
              @blur="() => validateName(true)"
              @input="() => validateName(false)"
              v-model="formData.username"
            />
            <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="formData.password"
              @blur="() => validatePassword(true)"
            />
            <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Login</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
          <div v-if="errors.general" class="text-danger text-center mt-3">
            {{ errors.general }}
          </div>
        </div>
      </div>
    </form>
    <p class="text-center mt-3">
      Don't have an account? <router-link to="/register">Register here</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  username: '',
  password: ''
})

const errors = ref({
  username: null,
  password: null,
  general: null
})

const submitForm = () => {
  validateName(true)
  validatePassword(true)

  if (!errors.value.username && !errors.value.password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(
      (u) => u.username === formData.value.username && u.password === formData.value.password
    )

    if (user) {
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('currentUser', JSON.stringify(user))

      window.location.reload()

      router.push('/homepage')
    } else {
      errors.value.general = 'Invalid username or password.'
    }
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: ''
  }
  errors.value.general = null
}

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  if (formData.value.password.length < 8) {
    if (blur) errors.value.password = 'Password must be at least 8 characters long.'
  } else {
    errors.value.password = null
  }
}
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
}
</style>
